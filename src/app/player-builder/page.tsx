'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Fragment, useEffect, useState } from 'react';
import { SKILL_LOOKUP, TRAIT_LOOKUP } from './lookups';
import SkillBar from '../components/SkillBar';

interface PlayerBuilderData {
  skills: any;
  traits: any;
}

const groupOrder = {
  QB: ['Passing', 'Carrying', 'Physical', 'Mental'],
  FB: ['Blocking', 'Receiving', 'Carrying', 'Physical', 'Mental'],
  HB: ['Carrying', 'Receiving', 'Blocking', 'Physical', 'Mental'],
  TE: ['Receiving', 'Blocking', 'Carrying', 'Physical', 'Mental'],
  WR: ['Receiving', 'Carrying', 'Blocking', 'Physical', 'Mental'],
  OT: ['Blocking', 'Physical', 'Mental'],
  G: ['Blocking', 'Physical', 'Mental'],
  C: ['Blocking', 'Physical', 'Mental'],
  DT: ['Pass Rushing', 'Defense', 'Tackling', 'Physical', 'Mental'],
  DE: ['Pass Rushing', 'Defense', 'Pass Coverage', 'Tackling', 'Physical', 'Mental'],
  LB: ['Tackling', 'Defense', 'Pass Coverage', 'Pass Rushing', 'Physical', 'Mental'],
  CB: ['Pass Coverage', 'Tackling', 'Defense', 'Pass Rushing', 'Carrying', 'Physical', 'Mental'],
  FS: ['Pass Coverage', 'Tackling', 'Defense', 'Pass Rushing', 'Carrying', 'Physical', 'Mental'],
  SS: ['Pass Coverage', 'Tackling', 'Defense', 'Pass Rushing', 'Carrying', 'Physical', 'Mental'],
  K: ['Kicking', 'Tackling', 'Physical', 'Mental'],
  P: ['Punting', 'Tackling', 'Physical', 'Mental'],
};

export default function PlayerBuilder() {
  const [data, setData] = useState<PlayerBuilderData>({ skills: null, traits: null });
  const [remSkillPoints, setRemSkillPoints] = useState<number>(210000);
  const [remCapBoosts, setRemCapBoosts] = useState<number>(7);
  const [build, setBuild] = useState<any>();
  const [factors, setFactors] = useState<{ [key: string]: number }>({
    pass_technique: 1.0,
    break_run_block: 1.0,
    tackle_technique: 1.0,
    man_coverage_awareness: 1.0,
    punt_hands: 1.0,
    kick_accuracy: 1.0,
    pass_rush_technique: 1.0,
    pass_rush_power: 1.0,
    pass_accuracy: 1.0,
    kick_power: 1.0,
    tackle_power: 1.0,
    zone_coverage_awareness: 1.0,
    punt_accuracy: 1.0,
    blitz_awareness: 1.0,
    punt_power: 1.0,
    tackle_strip: 1.0,
    kick_consistency: 1.0,
    pass_power: 1.0,
    hold_ground: 1.0,
    coverage_technique: 1.0,
    punt_consistency: 1.0,
    tackle_awareness: 1.0,
    pass_consistency: 1.0,
    pass_rush_deflection: 1.0,
    kickoff_power: 1.0,
    tackle_grip: 1.0,
    coverage_deflection: 1.0,
    coverage_interception: 1.0,
    defense_consistency: 1.0,
    pass_grip: 1.0,
    pass_evasiveness: 1.0,
    pass_carry_power: 1.0,
    pass_awareness: 1.0,
    carry_grip: 2.5,
    carry_power: 0.4,
    carry_elusiveness: 0.5,
    carry_awareness: 2.2,
    return_awareness: 1.0,
    route_technique: 1.0,
    route_elusiveness: 1.0,
    catch_hands: 1.0,
    catch_in_traffic: 1.0,
    catch_grip: 1.0,
    catch_awareness: 1.0,
    catch_consistency: 1.0,
    pass_block_technique: 1.0,
    pass_block_power: 1.0,
    pass_block_awareness: 1.0,
    run_block_technique: 1.0,
    run_block_power: 1.0,
    run_block_awareness: 1.0,
    lead_block_awareness: 1.0,
    block_consistency: 1.0,
    balance: 1.3,
    footwork: 1.0,
    quickness: 1.2,
    sprinting: 1.0,
    vertical: 1.0,
    diving: 1.0,
    conditioning: 1.2,
    toughness: 1.0,
    snap_reaction: 1.0,
    heart: 1.0,
    intimidation: 1.0,
    leadership: 1.0,
  });

  const hbData = {
    Position: 'HB',
    Height: 66,
    Weight: 184,
    Strength: 9,
    Speed: 1,
    Agility: 9,
    Stamina: 9,
    Awareness: 6,
    Confidence: 1,
    Trait1: 'superstar_glam',
    Trait2: 'hb_rushing_back',
    Trait3: 'unpredictable',
  };

  const fetchData = async () => {
    const skillsRes = await fetch('/api/glb2-data/skills');
    const skillsData = await skillsRes.json();

    const traitsRes = await fetch('/api/glb2-data/traits');
    const traitsData = await traitsRes.json();
    setData({ skills: sortSkills(skillsData), traits: traitsData });
  };

  const FindBaseLevel = (data: any) => {
    var level = 0;
    var spspent = 0;
    var spmax = 500;
    // if (
    //   document.getElementsByClassName('btn-warning')[0].id.indexOf('natural') !== -1 ||
    //   document.getElementsByClassName('btn-warning')[1].id.indexOf('natural') !== -1 ||
    //   document.getElementsByClassName('btn-warning')[2].id.indexOf('natural') !== -1
    // )
    //   {spmax = 1000;}
    // else {spmax = 500;}
    while (spspent < spmax) {
      level += 1;
      spspent += CalcCostSP(data, hbData, 1, level);
    }
    return level;
  };

  const FindMaxLevel = (skill: string, playerData: any, capBoostsSpent: any) => {
    var maxlevel = 33;
    maxlevel -= Math.pow(playerData.Strength, 1.3) * (data.skills[skill].attributes.strength || 0);
    maxlevel -= Math.pow(playerData.Agility, 1.3) * (data.skills[skill].attributes.agility || 0);
    maxlevel -= Math.pow(playerData.Awareness, 1.3) * (data.skills[skill].attributes.awareness || 0);
    maxlevel -= Math.pow(playerData.Speed, 1.3) * (data.skills[skill].attributes.speed || 0);
    maxlevel -= Math.pow(playerData.Stamina, 1.3) * (data.skills[skill].attributes.stamina || 0);
    maxlevel -= Math.pow(playerData.Confidence, 1.3) * (data.skills[skill].attributes.confidence || 0);

    if (skill in data.traits[playerData.Trait1].skill_modifiers) {
      maxlevel += data.traits[playerData.Trait1].skill_modifiers[skill].max || 0;
    }
    if (skill in data.traits[playerData.Trait2].skill_modifiers) {
      maxlevel += data.traits[playerData.Trait2].skill_modifiers[skill].max || 0;
    }
    if (skill in data.traits[playerData.Trait3].skill_modifiers) {
      maxlevel += data.traits[playerData.Trait3].skill_modifiers[skill].max || 0;
    }

    maxlevel += (100 - data.skills[skill].position_multiplier[playerData.Position]) * 0.4;
    maxlevel -= data.skills[skill].height * (playerData.Height - 66) * 0.5;
    maxlevel -= data.skills[skill].weight * playerData.Weight * 0.25;

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

  const CalcCostSP = (skill: string, playerData: any, mod: number, level: number) => {
    level += mod;
    const base_price =
      typeof data.skills[skill].position_base_price[playerData.Position] !== 'undefined'
        ? data.skills[skill].position_base_price[playerData.Position]
        : data.skills[skill].base_price;

    let cost = base_price * data.skills[skill].position_multiplier[playerData.Position];
    const exponent = typeof data.skills[skill].exponent !== 'undefined' ? data.skills[skill].exponent : 1.3;
    cost += data.skills[skill].attributes.strength * playerData.Strength;
    cost += data.skills[skill].attributes.agility * playerData.Agility;
    cost += data.skills[skill].attributes.awareness * playerData.Awareness;
    cost += data.skills[skill].attributes.speed * playerData.Speed;
    cost += data.skills[skill].attributes.stamina * playerData.Stamina;
    cost += data.skills[skill].attributes.confidence * playerData.Confidence;
    cost += data.skills[skill].height * (playerData.Height - 66);
    cost += data.skills[skill].weight * playerData.Weight;

    if (skill in data.traits[playerData.Trait1].skill_modifiers) {
      cost *= 1 + data.traits[playerData.Trait1].skill_modifiers[skill].cost;
    }
    if (skill in data.traits[playerData.Trait2].skill_modifiers) {
      cost *= 1 + data.traits[playerData.Trait2].skill_modifiers[skill].cost;
    }
    if (skill in data.traits[playerData.Trait3].skill_modifiers) {
      cost *= 1 + data.traits[playerData.Trait3].skill_modifiers[skill].cost;
    }

    cost = Math.round(cost * (Math.pow(level, exponent) / 59.0));

    return cost;
  };

  const sortSkills = (skills: any) => {
    const skillsEntries = Object.entries(skills);

    skillsEntries.sort((a: any, b: any) => {
      const groupIndexA = groupOrder.HB.indexOf(a[1].group);
      const groupIndexB = groupOrder.HB.indexOf(b[1].group);

      if (groupIndexA !== groupIndexB) {
        return groupIndexA - groupIndexB;
      } else {
        return a[1].priority - b[1].priority;
      }
    });

    return Object.fromEntries(skillsEntries);
  };

  const buildHB = () => {
    if (!data.skills) return;

    let skillPoints = 210000;
    let capBoosts = 7;
    let capBoostsSpent: { [key: string]: number } = {};
    let suggestedBuild: { [key: string]: number } = {};

    for (const [key, value] of Object.entries(data.skills)) {
      if ((value as any)['positions']?.includes('HB')) {
        suggestedBuild[key] = FindBaseLevel(key);
      }
    }

    let filteredSkills: any[] = [];

    for (const [key, value] of Object.entries(data.skills)) {
      if (
        key !== 'return_awareness' &&
        key !== 'snap_reaction' &&
        key !== 'diving' &&
        key !== 'vertical' &&
        key !== 'intimidation' &&
        (value as any)['positions']?.includes('HB') &&
        (value as any)['group'] !== 'Blocking' &&
        (value as any)['group'] !== 'Receiving'
      )
        filteredSkills = [...filteredSkills, { key, value }];
    }

    while (skillPoints > 0) {
      filteredSkills.sort((a, b) =>
        CalcCostSP(a.key, hbData, 1, suggestedBuild[a.key]) * factors[a.key] < CalcCostSP(b.key, hbData, 1, suggestedBuild[b.key]) * factors[b.key] ? -1 : 1
      );

      if (skillPoints - CalcCostSP(filteredSkills[0].key, hbData, 1, suggestedBuild[filteredSkills[0].key]) < 0) break;
      skillPoints -= CalcCostSP(filteredSkills[0].key, hbData, 1, suggestedBuild[filteredSkills[0].key]);
      suggestedBuild[filteredSkills[0].key]++;

      if (
        (filteredSkills[0].key === 'heart' && suggestedBuild[filteredSkills[0].key] === 30) ||
        (filteredSkills[0].key === 'toughness' && suggestedBuild[filteredSkills[0].key] === 40)
      ) {
        filteredSkills.shift();
      } else if (suggestedBuild[filteredSkills[0].key] === FindMaxLevel(filteredSkills[0].key, hbData, capBoostsSpent)) {
        if (capBoosts > 0 && suggestedBuild[filteredSkills[0].key] !== 100) {
          capBoosts--;
          if (capBoostsSpent?.hasOwnProperty(filteredSkills[0].key)) {
            capBoostsSpent[filteredSkills[0].key]++;
          } else {
            capBoostsSpent[filteredSkills[0].key] = 1;
          }
        } else {
          filteredSkills.shift();
        }
      }
    }

    setRemSkillPoints(skillPoints);
    setRemCapBoosts(capBoosts);
    setBuild(suggestedBuild);
  };

  const factorChange = (skill: string, change: number) => {
    setFactors((prevState) => ({
      ...prevState,
      [skill]: prevState[skill] + (change > 0 ? 0.1 : -0.1),
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    buildHB();
    // if (data.skills) console.log(Object.entries(data.skills).map(([key, value]) => key));
  }, [data, factors]);

  return (
    <Box>
      <Grid container mb={2} rowGap={1}>
        <Grid size={{ xs: 12 }} textAlign='center'>
          <Typography variant='h6'>Player Builder is a work in progress...</Typography>
        </Grid>
        <Grid size={{ xs: 12 }} textAlign='center'>
          <Typography variant='body2'>
            Notes: Player is static for now. Numbers multiply the SP cost of taking the next point for algorithm consideration.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant='h6'>HB</Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography>
            Height: {Math.floor(hbData.Height / 12)}&apos; {hbData.Height % 12}&apos;&apos;
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography>Weight: {hbData.Weight} lbs.</Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography>Strength: {hbData.Strength}</Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography>Speed: {hbData.Speed}</Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography>Agility: {hbData.Agility}</Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography>Stamina: {hbData.Stamina}</Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography>Awareness: {hbData.Awareness}</Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          <Typography>Confidence: {hbData.Confidence}</Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <Typography>{TRAIT_LOOKUP[hbData.Trait1]}</Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <Typography>{TRAIT_LOOKUP[hbData.Trait2]}</Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <Typography>{TRAIT_LOOKUP[hbData.Trait3]}</Typography>
        </Grid>
      </Grid>

      {build && (
        <Grid container rowGap={1} columnSpacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography variant='h6'>Skill Points: {remSkillPoints}</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant='h6'>Cap Boosts: {remCapBoosts}</Typography>
          </Grid>
          {Object.entries(build).map(([key, value]) => (
            <Fragment key={key}>
              <Grid size={{ xs: 6, lg: 2 }}>
                <Typography>{SKILL_LOOKUP[key]}</Typography>
              </Grid>
              <Grid size={{ xs: 6, lg: 2 }}>
                <Stack direction='row' spacing={1} alignItems='center' justifyContent='center'>
                  <Typography>{factors[key].toFixed(1)}</Typography>
                  <Button size='small' variant='outlined' onClick={() => factorChange(key, -1)}>
                    -
                  </Button>
                  <Button size='small' variant='outlined' onClick={() => factorChange(key, 1)}>
                    +
                  </Button>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, lg: 2 }}>
                <SkillBar skillLevel={value as number} skillCost={(value as number) === 100 ? 0 : CalcCostSP(key, hbData, 1, value as number)} />
              </Grid>
            </Fragment>
          ))}
        </Grid>
      )}
    </Box>
  );
}
