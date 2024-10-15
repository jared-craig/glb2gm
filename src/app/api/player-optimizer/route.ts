import { Player } from '@/app/players/player';
import { PlayerBuilderData } from '@/app/player-optimizer/page';
import { NextRequest } from 'next/server';

const CalcCostSP = (filteredData: any, skill: string, playerData: Player, mod: number, level: number) => {
  const skillData = filteredData.skills[skill];
  if (!skillData) return Math.max();
  level += mod;
  const base_price =
    typeof skillData.position_base_price[playerData.position] !== 'undefined' ? skillData.position_base_price[playerData.position] : skillData.base_price;

  let cost = base_price * skillData.position_multiplier[playerData.position];
  const exponent = typeof skillData.exponent !== 'undefined' ? skillData.exponent : 1.3;
  cost += skillData.attributes.strength * playerData.strength;
  cost += skillData.attributes.agility * playerData.agility;
  cost += skillData.attributes.awareness * playerData.awareness;
  cost += skillData.attributes.speed * playerData.speed;
  cost += skillData.attributes.stamina * playerData.stamina;
  cost += skillData.attributes.confidence * playerData.confidence;
  cost += skillData.height * (playerData.height - 66);
  cost += skillData.weight * playerData.weight;

  for (const trait of [playerData.trait1, playerData.trait2, playerData.trait3]) {
    if (skill in filteredData.traits[trait].skill_modifiers) {
      cost *= 1 + filteredData.traits[trait].skill_modifiers[skill].cost;
    }
  }

  cost = Math.round(cost * (Math.pow(level, exponent) / 59.0));

  return cost;
};

const FindBaseLevel = (filteredData: any, skill: string, player: Player) => {
  if (!player) return 1;

  var level = 0;
  var spspent = 0;
  var spmax = player.trait1 === 'natural' || player.trait2 === 'natural' || player.trait3 === 'natural' ? 1000 : 500;
  while (spspent < spmax) {
    level += 1;
    spspent += CalcCostSP(filteredData, skill, player, 1, level);
  }
  return level;
};

const FindMaxLevel = (filteredData: any, data: any, skill: string, playerData: Player, capBoostsSpent: any): number => {
  if (!filteredData.skills[skill]) return 100;

  var maxlevel = 33;
  maxlevel -= Math.pow(playerData.strength, 1.3) * (filteredData.skills[skill].attributes.strength || 0);
  maxlevel -= Math.pow(playerData.agility, 1.3) * (filteredData.skills[skill].attributes.agility || 0);
  maxlevel -= Math.pow(playerData.awareness, 1.3) * (filteredData.skills[skill].attributes.awareness || 0);
  maxlevel -= Math.pow(playerData.speed, 1.3) * (filteredData.skills[skill].attributes.speed || 0);
  maxlevel -= Math.pow(playerData.stamina, 1.3) * (filteredData.skills[skill].attributes.stamina || 0);
  maxlevel -= Math.pow(playerData.confidence, 1.3) * (filteredData.skills[skill].attributes.confidence || 0);

  if (skill in data.traits[playerData.trait1].skill_modifiers) {
    maxlevel += data.traits[playerData.trait1].skill_modifiers[skill].max || 0;
  }
  if (skill in data.traits[playerData.trait2].skill_modifiers) {
    maxlevel += data.traits[playerData.trait2].skill_modifiers[skill].max || 0;
  }
  if (skill in data.traits[playerData.trait3].skill_modifiers) {
    maxlevel += data.traits[playerData.trait3].skill_modifiers[skill].max || 0;
  }

  maxlevel += (100 - filteredData.skills[skill].position_multiplier[playerData.position]) * 0.4;
  maxlevel -= filteredData.skills[skill].height * (playerData.height - 66) * 0.5;
  maxlevel -= filteredData.skills[skill].weight * playerData.weight * 0.25;

  if (maxlevel < 25) {
    maxlevel = 25;
  }

  if (capBoostsSpent?.hasOwnProperty(skill)) maxlevel += capBoostsSpent[skill] * 5.0;

  maxlevel = Math.round(maxlevel);

  if (maxlevel > 100) {
    maxlevel = 100;
  }

  return maxlevel;
};

const findElementWithHighestValue = (arr: any[], prop: string) => {
  if (arr.length === 0) {
    return null;
  }

  return arr.reduce((maxElement, currentElement) => {
    return maxElement[prop] > currentElement[prop] ? maxElement : currentElement;
  }, arr[0]);
};

const findElementWithLowestValue = (arr: any[], prop: string) => {
  if (arr.length === 0) {
    return null;
  }

  return arr.reduce((minElement, currentElement) => {
    return minElement[prop] < currentElement[prop] ? minElement : currentElement;
  }, arr[0]);
};

interface PostRequestProps {
  position: string;
  attCombos: any;
  traitCombos: any;
  heightWeightCombos: any;
  data: PlayerBuilderData;
  filteredData: PlayerBuilderData;
  skillMins: { [key: string]: number };
}

export async function POST(request: NextRequest) {
  const reqData: any = await request.json();
  const { position, attCombos, traitCombos, heightWeightCombos, data, filteredData, skillMins }: PostRequestProps = reqData;

  let combosThatWork: any[] = [];
  let possibleCombos = 0;

  for (const hwCombo of heightWeightCombos) {
    for (const attCombo of attCombos) {
      for (const traitCombo of traitCombos) {
        let player: Player = {
          position: position,
          weight: hwCombo.weight,
          height: hwCombo.height,
          strength: attCombo.strength,
          speed: attCombo.speed,
          agility: attCombo.agility,
          stamina: attCombo.stamina,
          awareness: attCombo.awareness,
          confidence: attCombo.confidence,
          trait1: traitCombo[0],
          trait2: traitCombo[1],
          trait3: traitCombo[2],
        };

        let skillPoints =
          player.trait1.includes('superstar') || player.trait2.includes('superstar') || player.trait3.includes('superstar')
            ? 220000
            : player.trait1.includes('prodigy') || player.trait2.includes('prodigy') || player.trait3.includes('prodigy')
              ? 216000
              : 210000;
        let capBoosts = 7;
        let capBoostsSpent: { [key: string]: number } = {};
        let suggestedBuild: { [key: string]: number } = {};

        for (const key of Object.keys(filteredData.skills)) {
          suggestedBuild[key] = FindBaseLevel(filteredData, key, player);
        }

        let canAchieveBuild = true;

        for (const [skKey, skValue] of Object.entries(skillMins).filter(([key, value]: any) => value >= 0)) {
          if (!canAchieveBuild) break;

          const levelsNeeded = skValue - suggestedBuild[skKey];

          let neededSp = 0;
          for (let i = 1; i <= levelsNeeded; i++) {
            neededSp += CalcCostSP(filteredData, skKey, player, i, suggestedBuild[skKey]);
          }

          if (skillPoints - neededSp < 0) {
            canAchieveBuild = false;
            break;
          }

          skillPoints -= neededSp;

          suggestedBuild[skKey] += levelsNeeded;

          if (Number.isNaN(skillPoints)) {
            canAchieveBuild = false;
            break;
          }

          const maxLevel = FindMaxLevel(filteredData, data, skKey, player, capBoostsSpent);

          if (suggestedBuild[skKey] >= maxLevel) {
            const attDiff = suggestedBuild[skKey] - maxLevel;

            if (capBoosts >= attDiff / 5.0) {
              capBoosts -= Math.ceil(attDiff / 5.0);
              if (capBoostsSpent?.hasOwnProperty(skKey)) {
                capBoostsSpent[skKey] += Math.ceil(attDiff / 5.0);
              } else {
                capBoostsSpent[skKey] = Math.ceil(attDiff / 5.0);
              }
            } else {
              canAchieveBuild = false;
              break;
            }
          }
        }

        if (!canAchieveBuild) {
          continue;
        }

        possibleCombos++;
        combosThatWork = [...combosThatWork, { ...hwCombo, ...attCombo, ...traitCombo, sp: skillPoints, cbr: capBoosts }];
      }
    }
  }

  const best = findElementWithHighestValue([...combosThatWork], 'sp');

  return Response.json({ best, possibleCombos });
}
