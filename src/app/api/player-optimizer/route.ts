import { Player } from '@/app/players/player';
import { PlayerBuilderData } from '@/app/player-optimizer/page';
import { NextRequest } from 'next/server';

const CalcCostSP = (filteredData: any, skill: string, playerData: Player, mod: number, level: number) => {
  const skillData = filteredData.skills[skill];
  if (!skillData) return Number.MAX_SAFE_INTEGER;
  level += mod;

  const { position, strength, agility, awareness, speed, stamina, confidence, height, weight, trait1, trait2, trait3 } = playerData;
  const basePrice = skillData.position_base_price?.[position] ?? skillData.base_price;
  const positionMultiplier = skillData.position_multiplier[position];
  const attributes = skillData.attributes;

  let cost = basePrice * positionMultiplier;
  const exponent = skillData.exponent ?? 1.3;

  cost += attributes.strength * strength;
  cost += attributes.agility * agility;
  cost += attributes.awareness * awareness;
  cost += attributes.speed * speed;
  cost += attributes.stamina * stamina;
  cost += attributes.confidence * confidence;
  cost += skillData.height * (height - 66);
  cost += skillData.weight * weight;

  const traits = [trait1, trait2, trait3];
  for (const trait of traits) {
    const skillModifiers = filteredData.traits[trait]?.skill_modifiers;
    if (skillModifiers && skill in skillModifiers) {
      cost *= 1 + (skillModifiers[skill].cost || 0);
    }
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
    const cost = CalcCostSP(filteredData, skill, player, 1, level);
    if (spspent + cost > spmax) break;
    spspent += cost;
  }

  return level;
};

const FindMaxLevel = (filteredData: any, data: any, skill: string, playerData: Player, capBoostsSpent: any): number => {
  const skillData = filteredData.skills[skill];
  if (!skillData) return 100;

  const { strength, agility, awareness, speed, stamina, confidence, height, weight, position, trait1, trait2, trait3 } = playerData;
  const { attributes, position_multiplier } = skillData;

  const calculateReduction = (attributeValue: number, attributeMultiplier: number) => Math.pow(attributeValue, 1.3) * (attributeMultiplier || 0);

  let maxlevel = 33;
  maxlevel -= calculateReduction(strength, attributes.strength);
  maxlevel -= calculateReduction(agility, attributes.agility);
  maxlevel -= calculateReduction(awareness, attributes.awareness);
  maxlevel -= calculateReduction(speed, attributes.speed);
  maxlevel -= calculateReduction(stamina, attributes.stamina);
  maxlevel -= calculateReduction(confidence, attributes.confidence);

  const traits = [trait1, trait2, trait3];
  for (const trait of traits) {
    const skillModifiers = data.traits[trait]?.skill_modifiers;
    if (skillModifiers && skill in skillModifiers) {
      maxlevel += skillModifiers[skill]?.max || 0;
    }
  }

  maxlevel += (100 - position_multiplier[position]) * 0.4;
  maxlevel -= skillData.height * (height - 66) * 0.5;
  maxlevel -= skillData.weight * weight * 0.25;

  if (maxlevel < 25) {
    maxlevel = 25;
  }

  if (capBoostsSpent?.[skill]) {
    maxlevel += capBoostsSpent[skill] * 5.0;
  }

  maxlevel = Math.round(maxlevel);

  if (maxlevel > 100) {
    maxlevel = 100;
  }

  return maxlevel;
};

const isBuild1Better = (build1: any, build2: any): boolean => {
  if (build1.cbr === build2.cbr) return build1.sp > build2.sp;
  if (build1.sp <= build2.sp && build1.cbr <= build2.cbr) return false;
  if (build1.sp > build2.sp && build1.cbr > build2.cbr) return true;

  const build1Value = build1.sp - Math.abs(build1.cbr) * 2500;
  const build2Value = build2.sp - Math.abs(build2.cbr) * 2500;
  return build1Value > build2Value;
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
  const reqData: PostRequestProps = await request.json();
  const { position, attCombos, traitCombos, heightWeightCombos, data, filteredData, skillMins }: PostRequestProps = reqData;

  let best: any = { sp: Number.NEGATIVE_INFINITY, cbr: Number.NEGATIVE_INFINITY };
  let bestFailing: any = { sp: Number.NEGATIVE_INFINITY, cbr: Number.NEGATIVE_INFINITY };

  const filteredDataSkillKeys = Object.keys(filteredData.skills);

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

        if ([player.trait1, player.trait2, player.trait3].some((trait) => trait.includes('superstar'))) {
          skillPoints = 220000;
        } else if ([player.trait1, player.trait2, player.trait3].some((trait) => trait.includes('prodigy'))) {
          skillPoints = 216000;
        }

        let capBoosts = 7;
        let capBoostsSpent: { [key: string]: number } = {};
        let suggestedBuild: { [key: string]: number } = {};

        for (const key of filteredDataSkillKeys) {
          suggestedBuild[key] = FindBaseLevel(filteredData, key, player);
        }

        const filteredSkillMins = Object.entries(skillMins).filter(([key, value]: any) => value > suggestedBuild[key]);

        for (const [skKey, skValue] of filteredSkillMins) {
          const levelsNeeded = skValue - suggestedBuild[skKey];

          let neededSp = 0;
          for (let i = 1; i <= levelsNeeded; i++) {
            neededSp += CalcCostSP(filteredData, skKey, player, i, suggestedBuild[skKey]);
          }

          skillPoints -= neededSp;

          suggestedBuild[skKey] = suggestedBuild[skKey] + levelsNeeded;

          const maxLevel = FindMaxLevel(filteredData, data, skKey, player, capBoostsSpent);

          if (suggestedBuild[skKey] >= maxLevel) {
            const attDiff = suggestedBuild[skKey] - maxLevel;
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
          build: suggestedBuild,
        };

        if (skillPoints >= 0 && capBoosts >= 0) {
          if (combo.sp === best.sp && combo.cbr > best.cbr) best = combo;
          else if (combo.sp > best.sp) best = combo;
        } else if (isBuild1Better(combo, bestFailing)) bestFailing = combo;
      }
    }
  }

  return Response.json({ best, bestFailing, success: best.sp > Number.MIN_SAFE_INTEGER });
}
