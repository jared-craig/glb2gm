'use client';

import { Box, Button, ButtonGroup, Container, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Fragment, useEffect, useState } from 'react';
import { SKILL_LOOKUP, TRAIT_LOOKUP } from '../players/lookups';
import SkillBar from '../components/SkillBar';
import { Player } from '../players/player';
import { getFactors } from './factors';
import { getTemplates, Template } from './templates';

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
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [player, setPlayer] = useState<Player>();
  const [remSkillPoints, setRemSkillPoints] = useState<number>(210000);
  const [remCapBoosts, setRemCapBoosts] = useState<number>(7);
  const [capBoostsSpent, setCapBoostsSpent] = useState<{ [key: string]: number }>({});
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

    let level = 0;
    let spspent = 0;
    let spmax = player.trait1 === 'natural' || player.trait2 === 'natural' || player.trait3 === 'natural' ? 1000 : 500;
    while (spspent < spmax) {
      level += 1;
      spspent += CalcCostSP(data, player, 1, level);
    }
    return level;
  };

  const FindMaxLevel = (skill: string, playerData: Player, capBoostsSpent: any): number => {
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
      cost *= 1 + (filteredData.traits[playerData.trait1].skill_modifiers[skill].cost || 0);
    }
    if (skill in filteredData.traits[playerData.trait2].skill_modifiers) {
      cost *= 1 + (filteredData.traits[playerData.trait2].skill_modifiers[skill].cost || 0);
    }
    if (skill in filteredData.traits[playerData.trait3].skill_modifiers) {
      cost *= 1 + (filteredData.traits[playerData.trait3].skill_modifiers[skill].cost || 0);
    }

    cost = Math.round(cost * (Math.pow(level, exponent) / 59.0));

    return cost;
  };

  const filterAndSortSkills = () => {
    if (!selectedPosition || !data.skills) return;

    const skillsEntries = Object.entries(data.skills).filter(([key, value]) => (value as any).positions.includes(selectedPosition));

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
      filteredSkills = [...filteredSkills, { key, value }].filter((x) => factors[x.key] < 20.0);
    }

    while (skillPoints > 0 && filteredSkills.length > 0) {
      filteredSkills.sort((a, b) =>
        CalcCostSP(a.key, player, 1, suggestedBuild[a.key]) * factors[a.key] < CalcCostSP(b.key, player, 1, suggestedBuild[b.key]) * factors[b.key] ? -1 : 1
      );

      if (skillPoints - CalcCostSP(filteredSkills[0].key, player, 1, suggestedBuild[filteredSkills[0].key]) < 0) {
        filteredSkills.shift();
        continue;
      }

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
    setCapBoostsSpent(capBoostsSpent);
    setBuild(suggestedBuild);
  };

  const factorChange = (skill: string, change: number) => {
    setFactors((prevState) => ({
      ...prevState,
      [skill]: prevState ? (prevState[skill] + change < 0.0 ? 0.0 : prevState[skill] + change > 20.0 ? 20.0 : prevState[skill] + change) : change,
    }));
  };

  const handlePositionChange = (event: SelectChangeEvent) => {
    setSelectedPosition(event.target.value as string);
  };

  const handleTemplateChange = (event: SelectChangeEvent) => {
    setSelectedTemplate(event.target.value as string);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedTemplate('');
    setTemplates(getTemplates(selectedPosition));
    filterAndSortSkills();
  }, [selectedPosition]);

  useEffect(() => {
    if (!selectedPosition || !selectedTemplate) return;

    setPlayer(templates.find((x) => x.templateName === selectedTemplate));
    setFactors(getFactors(selectedPosition, selectedTemplate));
  }, [selectedTemplate]);

  useEffect(() => {
    buildPlayer();
  }, [factors]);

  return (
    <Container maxWidth='xl'>
      <Grid container rowGap={1} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
          <Typography sx={{ typography: { xs: 'body1', lg: 'h6' } }}>Player Builder is a work in progress...</Typography>
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
          <Typography variant='body2'>
            Numbers multiply the SP cost of taking the next point for algorithm consideration.
            <br />A value of 20.0 or greater will not be considered.
          </Typography>
        </Grid>
        {data.skills && data.traits && (
          <Box width={350} mt={1}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', mb: 1 }}>
              <FormControl sx={{ minWidth: 150 }} size='small'>
                <InputLabel id='position-select-label'>Position</InputLabel>
                <Select labelId='position-select-label' id='position-select' value={selectedPosition} label='Position' onChange={handlePositionChange}>
                  <MenuItem value={'QB'}>QB</MenuItem>
                  <MenuItem value={'HB'}>HB</MenuItem>
                  <MenuItem value={'TE'}>TE</MenuItem>
                  <MenuItem value={'WR'}>WR</MenuItem>
                  <MenuItem value={'DE'}>DE</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 150 }} size='small' disabled={!selectedPosition}>
                <InputLabel id='template-select-label'>Template</InputLabel>
                <Select labelId='template-select-label' id='template-select' value={selectedTemplate} label='Template' onChange={handleTemplateChange}>
                  {templates.map((x) => (
                    <MenuItem key={x.templateName} value={x.templateName}>
                      {x.templateName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>
        )}
      </Grid>
      {selectedPosition && selectedTemplate && factors && player && (
        <>
          <Box sx={{ width: 350, mb: 2 }}>
            <Stack direction='row' sx={{ justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>
                Height: {Math.floor(player.height / 12)}&apos; {player.height % 12}&apos;&apos;
              </Typography>
              <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Weight: {player.weight} lbs.</Typography>
            </Stack>
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Strength: {player.strength}</Typography>
              <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Speed: {player.speed}</Typography>
            </Stack>
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Agility: {player.agility}</Typography>
              <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Stamina: {player.stamina}</Typography>
            </Stack>
            <Stack direction='row' sx={{ justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Awareness: {player.awareness}</Typography>
              <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Confidence: {player.confidence}</Typography>
            </Stack>
            <Stack>
              <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Trait 1: {TRAIT_LOOKUP[player.trait1]}</Typography>
              <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Trait 2: {TRAIT_LOOKUP[player.trait2]}</Typography>
              <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Trait 3: {TRAIT_LOOKUP[player.trait3]}</Typography>
            </Stack>
          </Box>

          {build && (
            <Grid container rowGap={{ xs: 0.5, lg: 1 }} columnSpacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography sx={{ typography: { xs: 'body1', lg: 'h6' } }}>Skill Points: {remSkillPoints}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography sx={{ typography: { xs: 'body1', lg: 'h6' } }}>Cap Boosts: {remCapBoosts}</Typography>
              </Grid>
              {groupOrder[selectedPosition].map((group) => (
                <Fragment key={group}>
                  <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                    <Typography>
                      <strong>{group}</strong>
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  {Object.entries(data.skills)
                    .filter(([key, value]) => (value as any).group === group && (value as any).positions.includes(selectedPosition))
                    .sort((a: any, b: any) => {
                      const groupIndexA = groupOrder[selectedPosition].indexOf(a[1].group);
                      const groupIndexB = groupOrder[selectedPosition].indexOf(b[1].group);

                      if (groupIndexA !== groupIndexB) {
                        return groupIndexA - groupIndexB;
                      } else {
                        return a[1].priority - b[1].priority;
                      }
                    })
                    .map(([key, value]) => (
                      <Fragment key={key}>
                        <Grid size={{ xs: 6, lg: 2 }} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{SKILL_LOOKUP[key]}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6, lg: 2 }}>
                          <Stack direction='row' spacing={1} sx={{ height: 38.75, alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{factors[key]?.toFixed(1)}</Typography>
                            <ButtonGroup size='small'>
                              <Button variant='outlined' onClick={() => factorChange(key, -1)}>
                                --
                              </Button>
                              <Button variant='outlined' onClick={() => factorChange(key, -0.1)}>
                                -
                              </Button>
                              <Button variant='outlined' onClick={() => factorChange(key, 0.1)}>
                                +
                              </Button>
                              <Button variant='outlined' onClick={() => factorChange(key, 1.0)}>
                                ++
                              </Button>
                            </ButtonGroup>
                          </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 2 }}>
                          <SkillBar
                            skillLevel={build[key]}
                            maxSkillLevel={FindMaxLevel(key, player, capBoostsSpent)}
                            skillCost={build[key] === 100 ? 0 : CalcCostSP(key, player, 1, build[key])}
                            capBoostsSpent={capBoostsSpent[key]}
                          />
                        </Grid>
                      </Fragment>
                    ))}
                </Fragment>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
}
