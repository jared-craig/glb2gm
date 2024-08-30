'use client';

import { Box, Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Fragment, useEffect, useState } from 'react';
import { SKILL_LOOKUP, TRAIT_LOOKUP } from './lookups';
import SkillBar from '../components/SkillBar';
import { Player } from './player';
import { getDefaultFactors } from './defaultFactors';

interface PlayerBuilderData {
  skills: any;
  traits: any;
}

const groupOrder: { [key: string]: string[] } = {
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
  const [filteredData, setFilteredData] = useState<PlayerBuilderData>({ skills: null, traits: null });
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [player, setPlayer] = useState<Player>();
  const [remSkillPoints, setRemSkillPoints] = useState<number>(210000);
  const [remCapBoosts, setRemCapBoosts] = useState<number>(7);
  const [build, setBuild] = useState<any>();
  const [factors, setFactors] = useState<{ [key: string]: number }>();

  const fetchData = async () => {
    const skillsRes = await fetch('/api/glb2-data/skills');
    const skillsData = await skillsRes.json();

    const traitsRes = await fetch('/api/glb2-data/traits');
    const traitsData = await traitsRes.json();
    setData({ skills: skillsData, traits: traitsData });
  };

  const FindBaseLevel = (data: any) => {
    if (!player) return 1;

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
      spspent += CalcCostSP(data, player, 1, level);
    }
    return level;
  };

  const FindMaxLevel = (skill: string, playerData: Player, capBoostsSpent: any) => {
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

  const CalcCostSP = (skill: string, playerData: Player, mod: number, level: number) => {
    if (!filteredData.skills[skill]) return Math.max();
    level += mod;
    const base_price =
      typeof filteredData.skills[skill].position_base_price[playerData.position] !== 'undefined'
        ? filteredData.skills[skill].position_base_price[playerData.position]
        : filteredData.skills[skill].base_price;

    let cost = base_price * filteredData.skills[skill].position_multiplier[playerData.position];
    const exponent = typeof filteredData.skills[skill].exponent !== 'undefined' ? filteredData.skills[skill].exponent : 1.3;
    cost += filteredData.skills[skill].attributes.strength * playerData.strength;
    cost += filteredData.skills[skill].attributes.agility * playerData.agility;
    cost += filteredData.skills[skill].attributes.awareness * playerData.awareness;
    cost += filteredData.skills[skill].attributes.speed * playerData.speed;
    cost += filteredData.skills[skill].attributes.stamina * playerData.stamina;
    cost += filteredData.skills[skill].attributes.confidence * playerData.confidence;
    cost += filteredData.skills[skill].height * (playerData.height - 66);
    cost += filteredData.skills[skill].weight * playerData.weight;

    if (skill in filteredData.traits[playerData.trait1].skill_modifiers) {
      cost *= 1 + filteredData.traits[playerData.trait1].skill_modifiers[skill].cost;
    }
    if (skill in filteredData.traits[playerData.trait2].skill_modifiers) {
      cost *= 1 + filteredData.traits[playerData.trait2].skill_modifiers[skill].cost;
    }
    if (skill in filteredData.traits[playerData.trait3].skill_modifiers) {
      cost *= 1 + filteredData.traits[playerData.trait3].skill_modifiers[skill].cost;
    }

    cost = Math.round(cost * (Math.pow(level, exponent) / 59.0));

    return cost;
  };

  const filterAndSortSkills = () => {
    if (!selectedPosition || !data.skills) return;

    const skillsEntries = Object.entries(data.skills).filter(([key, value]) => (value as any).positions.includes(selectedPosition));

    console.log(skillsEntries);

    skillsEntries.sort((a: any, b: any) => {
      const groupIndexA = groupOrder[selectedPosition].indexOf(a[1].group);
      const groupIndexB = groupOrder[selectedPosition].indexOf(b[1].group);

      if (groupIndexA !== groupIndexB) {
        return groupIndexA - groupIndexB;
      } else {
        return a[1].priority - b[1].priority;
      }
    });

    const newSkills = Object.fromEntries(skillsEntries);

    setFilteredData({ skills: newSkills, traits: data.traits });
  };

  const buildPlayer = () => {
    if (!filteredData.skills || !player || !factors) return;

    let skillPoints = player.trait1.includes('superstar') || player.trait2.includes('superstar') || player.trait3.includes('superstar') ? 220000 : 210000;
    let capBoosts = 7;
    let capBoostsSpent: { [key: string]: number } = {};
    let suggestedBuild: { [key: string]: number } = {};

    for (const [key, value] of Object.entries(filteredData.skills)) {
      suggestedBuild[key] = FindBaseLevel(key);
    }

    let filteredSkills: any[] = [];

    for (const [key, value] of Object.entries(filteredData.skills)) {
      filteredSkills = [...filteredSkills, { key, value }];
    }

    while (skillPoints > 0) {
      filteredSkills.sort((a, b) =>
        CalcCostSP(a.key, player, 1, suggestedBuild[a.key]) * factors[a.key] < CalcCostSP(b.key, player, 1, suggestedBuild[b.key]) * factors[b.key] ? -1 : 1
      );

      if (skillPoints - CalcCostSP(filteredSkills[0].key, player, 1, suggestedBuild[filteredSkills[0].key]) < 0) break;
      skillPoints -= CalcCostSP(filteredSkills[0].key, player, 1, suggestedBuild[filteredSkills[0].key]);
      suggestedBuild[filteredSkills[0].key]++;

      if (suggestedBuild[filteredSkills[0].key] === FindMaxLevel(filteredSkills[0].key, player, capBoostsSpent)) {
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
      [skill]: prevState ? prevState[skill] + change : change,
    }));
  };

  const handlePositionChange = (event: SelectChangeEvent) => {
    setSelectedPosition(event.target.value as string);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    switch (selectedPosition) {
      case 'QB':
        setPlayer({
          position: 'QB',
          height: 78,
          weight: 253,
          strength: 5,
          speed: 1,
          agility: 10,
          stamina: 5,
          awareness: 4,
          confidence: 10,
          trait1: 'superstar_glam',
          trait2: 'qb_pocket_passer',
          trait3: 'qb_precision_passer',
        });
        break;
      case 'HB':
        setPlayer({
          position: 'HB',
          height: 66,
          weight: 184,
          strength: 9,
          speed: 1,
          agility: 9,
          stamina: 9,
          awareness: 6,
          confidence: 1,
          trait1: 'superstar_glam',
          trait2: 'hb_rushing_back',
          trait3: 'unpredictable',
        });
        break;
      case 'TE':
        setPlayer({
          position: 'TE',
          height: 80,
          weight: 276,
          strength: 1,
          speed: 2,
          agility: 7,
          stamina: 5,
          awareness: 10,
          confidence: 10,
          trait1: 'superstar_avg',
          trait2: 'te_receiver',
          trait3: 'nerves_of_steel',
        });
        break;
      case 'WR':
        setPlayer({
          position: 'WR',
          height: 78,
          weight: 195,
          strength: 1,
          speed: 1,
          agility: 7,
          stamina: 6,
          awareness: 10,
          confidence: 10,
          trait1: 'superstar_avg',
          trait2: 'soft_hands',
          trait3: 'wr_shifty',
        });
        break;
    }
    filterAndSortSkills();
    setFactors(getDefaultFactors(selectedPosition));
  }, [selectedPosition]);

  useEffect(() => {
    buildPlayer();
  }, [factors]);

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
        {data && (
          <Grid size={{ xs: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id='position-select-label'>Position</InputLabel>
              <Select labelId='position-select-label' id='position-select' value={selectedPosition} label='Position' onChange={handlePositionChange}>
                <MenuItem value={'QB'}>QB</MenuItem>
                <MenuItem value={'HB'}>HB</MenuItem>
                <MenuItem value={'TE'}>TE</MenuItem>
                <MenuItem value={'WR'}>WR</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
      {selectedPosition && selectedPosition.length > 0 && factors && player && (
        <>
          {/* <Grid container mb={2} rowGap={1}>
            {Object.entries(factors).map(([key, value]) => (
              <Grid size={{ xs: 6 }} key={key}>
                <Typography>
                  {key}: {value}
                </Typography>
              </Grid>
            ))}
          </Grid> */}
          <Box maxWidth={350} mb={1}>
            <Stack direction='row' justifyContent='space-between' mb={1}>
              <Typography>
                Height: {Math.floor(player.height / 12)}&apos; {player.height % 12}&apos;&apos;
              </Typography>
              <Typography>Weight: {player.weight} lbs.</Typography>
            </Stack>
            <Stack direction='row' justifyContent='space-between'>
              <Typography>Strength: {player.strength}</Typography>
              <Typography>Speed: {player.speed}</Typography>
            </Stack>
            <Stack direction='row' justifyContent='space-between'>
              <Typography>Agility: {player.agility}</Typography>
              <Typography>Stamina: {player.stamina}</Typography>
            </Stack>
            <Stack direction='row' justifyContent='space-between' mb={1}>
              <Typography>Awareness: {player.awareness}</Typography>
              <Typography>Confidence: {player.confidence}</Typography>
            </Stack>
            <Typography>{TRAIT_LOOKUP[player.trait1]}</Typography>
            <Typography>{TRAIT_LOOKUP[player.trait2]}</Typography>
            <Typography>{TRAIT_LOOKUP[player.trait3]}</Typography>
          </Box>

          {build && (
            <Grid container rowGap={1} columnSpacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant='h6'>Skill Points: {remSkillPoints}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }} mb={1}>
                <Typography variant='h6'>Cap Boosts: {remCapBoosts}</Typography>
              </Grid>
              {Object.entries(build).map(([key, value]) => (
                <Fragment key={key}>
                  <Grid size={{ xs: 6, lg: 2 }}>
                    <Typography>{SKILL_LOOKUP[key]}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, lg: 2 }}>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='flex-end'>
                      <Typography>{factors[key]?.toFixed(1)}</Typography>
                      <ButtonGroup>
                        <Button size='small' variant='outlined' onClick={() => factorChange(key, -1)}>
                          --
                        </Button>
                        <Button size='small' variant='outlined' onClick={() => factorChange(key, -0.1)}>
                          -
                        </Button>
                        <Button size='small' variant='outlined' onClick={() => factorChange(key, 0.1)}>
                          +
                        </Button>
                        <Button size='small' variant='outlined' onClick={() => factorChange(key, 1.0)}>
                          ++
                        </Button>
                      </ButtonGroup>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, lg: 2 }} sx={{ mb: 1 }}>
                    <SkillBar skillLevel={value as number} skillCost={(value as number) === 100 ? 0 : CalcCostSP(key, player, 1, value as number)} />
                  </Grid>
                </Fragment>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
