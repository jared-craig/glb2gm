import { Player } from '@/app/players/player';
import { PlayerBuilderData } from '@/app/player-optimizer/page';
import { NextRequest } from 'next/server';

const CalcCostSP = (filteredData: any, skill: string, playerData: Player, mod: number, level: number) => {
  const skillData = filteredData.skills[skill];
  if (!skillData) return Number.MAX_SAFE_INTEGER;
  level += mod;

  const basePrice = skillData.position_base_price?.[playerData.position] ?? skillData.base_price;
  const positionMultiplier = skillData.position_multiplier[playerData.position];
  const attributes = skillData.attributes;
  const { strength, agility, awareness, speed, stamina, confidence, height, weight } = playerData;

  let cost = basePrice * positionMultiplier;
  const exponent = typeof skillData.exponent !== 'undefined' ? skillData.exponent : 1.3;
  cost += attributes.strength * strength;
  cost += attributes.agility * agility;
  cost += attributes.awareness * awareness;
  cost += attributes.speed * speed;
  cost += attributes.stamina * stamina;
  cost += attributes.confidence * confidence;
  cost += skillData.height * (height - 66);
  cost += skillData.weight * weight;

  let skillModifiers = filteredData.traits[playerData.trait1].skill_modifiers;
  if (skill in skillModifiers) {
    cost *= 1 + (skillModifiers[skill].cost || 0);
  }

  skillModifiers = filteredData.traits[playerData.trait2].skill_modifiers;
  if (skill in skillModifiers) {
    cost *= 1 + (skillModifiers[skill].cost || 0);
  }

  skillModifiers = filteredData.traits[playerData.trait3].skill_modifiers;
  if (skill in skillModifiers) {
    cost *= 1 + (skillModifiers[skill].cost || 0);
  }

  cost = Math.round(cost * (Math.pow(level, exponent) / 59.0));

  return cost;
};

const FindBaseLevel = (filteredData: any, skill: string, player: Player) => {
  if (!player) return 1;

  let level = 0;
  let spspent = 0;
  let spmax = player.trait1 === 'natural' || player.trait2 === 'natural' || player.trait3 === 'natural' ? 1000 : 500;
  while (spspent < spmax) {
    level += 1;
    spspent += CalcCostSP(filteredData, skill, player, 1, level);
  }
  return level;
};

const FindMaxLevel = (filteredData: any, data: any, skill: string, playerData: Player, capBoostsSpent: any): number => {
  if (!filteredData.skills[skill]) return 100;

  let maxlevel = 33;
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

const isBuild1Better = (build1: any, build2: any): boolean => {
  if (build1.cbr === build2.cbr && build1.sp > build2.sp) return true;
  else if (build1.sp <= build2.sp && build1.cbr <= build2.cbr) return false;
  else if (build1.sp > build2.sp && build1.cbr > build2.cbr) return true;
  else {
    const build1Value = build1.sp - Math.abs(build1.cbr) * 5000;
    const build2Value = build2.sp - Math.abs(build2.cbr) * 5000;
    return build1Value > build2Value;
  }
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

  let best: any = { sp: Number.NEGATIVE_INFINITY, cbr: Number.NEGATIVE_INFINITY };
  let bestFailing: any = { sp: Number.NEGATIVE_INFINITY, cbr: Number.NEGATIVE_INFINITY };

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

        let skillPoints = 210000;

        for (const trait of [player.trait1, player.trait2, player.trait3]) {
          if (trait.includes('superstar')) {
            skillPoints = 220000;
            break;
          } else if (trait.includes('prodigy')) {
            skillPoints = 216000;
          }
        }

        let capBoosts = 7;
        let capBoostsSpent: { [key: string]: number } = {};
        let suggestedBuild: Map<string, number> = new Map();

        for (const key of Object.keys(filteredData.skills)) {
          suggestedBuild.set(key, FindBaseLevel(filteredData, key, player));
        }

        const filteredSkillMins = Object.entries(skillMins).filter(([key, value]: any) => value > suggestedBuild.get(key)!);

        for (const [skKey, skValue] of filteredSkillMins) {
          const levelsNeeded = skValue - suggestedBuild.get(skKey)!;

          let neededSp = 0;
          for (let i = 1; i <= levelsNeeded; i++) {
            neededSp += CalcCostSP(filteredData, skKey, player, i, suggestedBuild.get(skKey)!);
          }

          skillPoints -= neededSp;

          suggestedBuild.set(skKey, suggestedBuild.get(skKey)! + levelsNeeded);

          const maxLevel = FindMaxLevel(filteredData, data, skKey, player, capBoostsSpent);

          if (suggestedBuild.get(skKey)! >= maxLevel) {
            const attDiff = suggestedBuild.get(skKey)! - maxLevel;
            const capsSpent = Math.ceil(attDiff / 5.0);

            capBoosts -= capsSpent;
            capBoostsSpent[skKey] = (capBoostsSpent[skKey] || 0) + capsSpent;
          }
        }

        const combo = {
          ...hwCombo,
          ...attCombo,
          ...traitCombo,
          sp: skillPoints,
          cbr: capBoosts,
          cbs: capBoostsSpent,
          build: Object.fromEntries(suggestedBuild),
        };

        const canAchieveBuild = skillPoints >= 0 && capBoosts >= 0;

        if (canAchieveBuild && combo.sp === best.sp && combo.cbr > best.cbr) best = combo;
        else if (canAchieveBuild && combo.sp > best.sp) best = combo;

        if (!canAchieveBuild && isBuild1Better(combo, bestFailing)) bestFailing = combo;
      }
    }
  }

  return Response.json({ best, bestFailing, success: best.sp > Number.MIN_SAFE_INTEGER });
}
