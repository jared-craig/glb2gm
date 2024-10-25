'use client';

import { Box, Container, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Slider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Fragment, useEffect, useState } from 'react';
import { SKILL_LOOKUP } from '../players/lookups';
import SkillBar from '../components/SkillBar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

interface PlayerBuilderData {
  skills: any;
  traits: any;
}

const positionData: { [key: string]: any } = {
  FS: {
    min_height: 68,
    max_height: 76,
    max_weight: 205,
    type: 'def',
    full_name: 'Free Safety',
    min_weight: 185,
    height_weight_modifier: 2,
  },
  TE: {
    min_height: 72,
    max_height: 80,
    max_weight: 260,
    type: 'off',
    full_name: 'Tight End',
    min_weight: 230,
    height_weight_modifier: 2,
  },
  HB: {
    min_height: 66,
    max_height: 76,
    max_weight: 220,
    type: 'off',
    full_name: 'Halfback',
    min_weight: 180,
    height_weight_modifier: 4,
  },
  CB: {
    min_height: 68,
    max_height: 75,
    max_weight: 200,
    type: 'def',
    full_name: 'Cornerback',
    min_weight: 170,
    height_weight_modifier: 2,
  },
  K: {
    min_height: 69,
    max_height: 77,
    max_weight: 220,
    type: 'off',
    full_name: 'Kicker',
    min_weight: 170,
    height_weight_modifier: 1,
  },
  FB: {
    min_height: 70,
    max_height: 76,
    max_weight: 250,
    type: 'off',
    full_name: 'Fullback',
    min_weight: 220,
    height_weight_modifier: 2,
  },
  LB: {
    min_height: 70,
    max_height: 78,
    max_weight: 250,
    type: 'def',
    full_name: 'Linebacker',
    min_weight: 220,
    height_weight_modifier: 2,
  },
  C: {
    min_height: 72,
    max_height: 78,
    max_weight: 300,
    type: 'off',
    full_name: 'Center',
    min_weight: 230,
    height_weight_modifier: 5,
  },
  SS: {
    min_height: 69,
    max_height: 77,
    max_weight: 225,
    type: 'def',
    full_name: 'Strong Safety',
    min_weight: 195,
    height_weight_modifier: 1,
  },
  DT: {
    min_height: 72,
    max_height: 80,
    max_weight: 300,
    type: 'def',
    full_name: 'Defensive Tackle',
    min_weight: 250,
    height_weight_modifier: 8,
  },
  DE: {
    min_height: 71,
    max_height: 80,
    max_weight: 280,
    type: 'def',
    full_name: 'Defensive End',
    min_weight: 240,
    height_weight_modifier: 5,
  },
  P: {
    min_height: 71,
    max_height: 77,
    max_weight: 230,
    type: 'def',
    full_name: 'Punter',
    min_weight: 180,
    height_weight_modifier: 4,
  },
  QB: {
    min_height: 70,
    max_height: 78,
    max_weight: 205,
    type: 'off',
    full_name: 'Quarterback',
    min_weight: 165,
    height_weight_modifier: 6,
  },
  G: {
    min_height: 74,
    max_height: 79,
    max_weight: 325,
    type: 'off',
    full_name: 'Guard',
    min_weight: 290,
    height_weight_modifier: 6,
  },
  OT: {
    min_height: 74,
    max_height: 81,
    max_weight: 320,
    type: 'off',
    full_name: 'Offensive Tackle',
    min_weight: 280,
    height_weight_modifier: 4,
  },
  WR: {
    min_height: 68,
    max_height: 78,
    max_weight: 205,
    type: 'off',
    full_name: 'Wide Receiver',
    min_weight: 165,
    height_weight_modifier: 3,
  },
};

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
  const [heightInput, setHeightInput] = useState<number>(0);
  const [weightInput, setWeightInput] = useState<number>(0);
  const [weightInputMin, setWeightInputMin] = useState<number>(0);
  const [weightInputMax, setWeightInputMax] = useState<number>(0);
  const [strength, setStrength] = useState<number>(5);
  const [speed, setSpeed] = useState<number>(5);
  const [agility, setAgility] = useState<number>(5);
  const [stamina, setStamina] = useState<number>(5);
  const [awareness, setAwareness] = useState<number>(5);
  const [confidence, setConfidence] = useState<number>(5);
  const [remAttributes, setRemAttributes] = useState<number>(5);
  const [remTrait1Options, setRemTrait1Options] = useState({});
  const [remTrait2Options, setRemTrait2Options] = useState({});
  const [remTrait3Options, setRemTrait3Options] = useState({});
  const [trait1, setTrait1] = useState('');
  const [trait2, setTrait2] = useState('');
  const [trait3, setTrait3] = useState('');
  const [skillDistribution, setSkillDistribution] = useState<{
    [key: string]: { baseLevel: number; currentLevel: number; maxLevel: number; currentMaxLevel: number; capBoostsSpent: number };
  }>({});
  const [remSkillPoints, setRemSkillPoints] = useState<number>(210000);
  const [remCapBoosts, setRemCapBoosts] = useState<number>(7);

  const fetchData = async () => {
    const skillsRes = await fetch('/api/glb2-data/skills');
    const skillsData = await skillsRes.json();

    const traitsRes = await fetch('/api/glb2-data/traits');
    const traitsData = await traitsRes.json();

    setData({ skills: skillsData, traits: traitsData });
  };

  const FindBaseLevel = (skill: string) => {
    let level = 0;
    let spspent = 0;
    let spmax = trait1 === 'natural' || trait2 === 'natural' || trait3 === 'natural' ? 1000 : 500;
    while (spspent < spmax) {
      level += 1;
      spspent += CalcCostSP(skill, 1, level);
    }
    return level;
  };

  const FindMaxLevel = (skill: string): number => {
    if (!filteredData.skills[skill]) return 100;

    var maxlevel = 33;
    maxlevel -= Math.pow(strength, 1.3) * (filteredData.skills[skill].attributes.strength || 0);
    maxlevel -= Math.pow(agility, 1.3) * (filteredData.skills[skill].attributes.agility || 0);
    maxlevel -= Math.pow(awareness, 1.3) * (filteredData.skills[skill].attributes.awareness || 0);
    maxlevel -= Math.pow(speed, 1.3) * (filteredData.skills[skill].attributes.speed || 0);
    maxlevel -= Math.pow(stamina, 1.3) * (filteredData.skills[skill].attributes.stamina || 0);
    maxlevel -= Math.pow(confidence, 1.3) * (filteredData.skills[skill].attributes.confidence || 0);

    for (const trait of [trait1, trait2, trait3]) {
      if (trait in data.traits && skill in data.traits[trait].skill_modifiers) {
        maxlevel += data.traits[trait].skill_modifiers[skill].max || 0;
      }
    }

    maxlevel += (100 - filteredData.skills[skill].position_multiplier[selectedPosition]) * 0.4;
    maxlevel -= filteredData.skills[skill].height * (heightInput - 66) * 0.5;
    maxlevel -= filteredData.skills[skill].weight * weightInput * 0.25;

    if (maxlevel < 25) {
      maxlevel = 25;
    }

    maxlevel = Math.round(maxlevel);

    if (maxlevel > 100) {
      maxlevel = 100;
    }

    return maxlevel;
  };

  const CalcCostSP = (skill: string, mod: number, level: number) => {
    if (!filteredData.skills[skill]) return Number.MAX_SAFE_INTEGER;
    level += mod;

    const skillData = filteredData.skills[skill];
    const basePrice = skillData.position_base_price?.[selectedPosition] ?? skillData.base_price;
    const positionMultiplier = skillData.position_multiplier[selectedPosition];
    const attributes = skillData.attributes;

    let cost = basePrice * positionMultiplier;
    const exponent = typeof skillData.exponent !== 'undefined' ? skillData.exponent : 1.3;
    cost += attributes.strength * strength;
    cost += attributes.agility * agility;
    cost += attributes.awareness * awareness;
    cost += attributes.speed * speed;
    cost += attributes.stamina * stamina;
    cost += attributes.confidence * confidence;
    cost += skillData.height * (heightInput - 66);
    cost += skillData.weight * weightInput;

    for (const trait of [trait1, trait2, trait3]) {
      const traitData = filteredData.traits[trait];
      if (traitData && skill in traitData.skill_modifiers) {
        cost *= 1 + (traitData.skill_modifiers[skill].cost || 0);
      }
    }

    cost = Math.round(cost * (Math.pow(level, exponent) / 59.0));

    return cost;
  };

  const filterAndSortSkills = () => {
    if (!selectedPosition || !data.skills) return;

    const skillsEntries: [string, any][] = Object.entries(data.skills).filter(([key, value]) => (value as any).positions.includes(selectedPosition));

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

    const traitsEntries: [string, any][] = Object.entries(data.traits).filter(([key, value]) => !(value as any).position_exclusions.includes(selectedPosition));

    traitsEntries.sort((a: any, b: any) => {
      if (a[1].name === 'Superstar') {
        return -1;
      } else if (b[1].name === 'Superstar') {
        return 1;
      } else if (a[1].name === 'Prodigy') {
        return -1;
      } else if (b[1].name === 'Prodigy') {
        return 1;
      } else {
        return a[1].name.localeCompare(b[1].name);
      }
    });

    const newTraits = Object.fromEntries(traitsEntries);

    setFilteredData({ skills: newSkills, traits: newTraits });
    setRemTrait1Options(newTraits);
    setRemTrait2Options(newTraits);
    setRemTrait3Options(newTraits);
  };

  const handlePositionChange = (event: SelectChangeEvent) => {
    setSelectedPosition(event.target.value as string);
  };

  const handleAttributeChange = (att: string, change: number) => {
    if (change === 1 && remAttributes <= 0) return;
    switch (att) {
      case 'strength':
        setStrength((prev) => (prev += change));
        break;
      case 'speed':
        setSpeed((prev) => (prev += change));
        break;
      case 'agility':
        setAgility((prev) => (prev += change));
        break;
      case 'stamina':
        setStamina((prev) => (prev += change));
        break;
      case 'awareness':
        setAwareness((prev) => (prev += change));
        break;
      case 'confidence':
        setConfidence((prev) => (prev += change));
        break;
    }
  };

  const handleTrait1Change = (event: SelectChangeEvent) => {
    setTrait1(event.target.value as string);
  };
  const handleTrait2Change = (event: SelectChangeEvent) => {
    setTrait2(event.target.value as string);
  };
  const handleTrait3Change = (event: SelectChangeEvent) => {
    setTrait3(event.target.value as string);
  };

  const handleSkillChange = (skill: string, change: number) => {
    if (change > 0) {
      let sd = skillDistribution[skill];
      let rsp = remSkillPoints;
      let rcb = remCapBoosts;
      for (let i = 0; i < change; i++) {
        if (sd.currentLevel < sd.currentMaxLevel) {
          rsp -= CalcCostSP(skill, 1, sd.currentLevel);
          sd = { ...sd, currentLevel: sd.currentLevel + 1 };
        } else if (remCapBoosts > 0 && skillDistribution[skill].currentLevel < 100) {
          rsp -= CalcCostSP(skill, 1, sd.currentLevel);
          sd = { ...sd, currentLevel: sd.currentLevel + 1, currentMaxLevel: sd.currentMaxLevel + 5.0, capBoostsSpent: sd.capBoostsSpent + 1 };
          rcb -= 1;
        }
      }
      setRemSkillPoints(rsp);
      setSkillDistribution((prev) => ({ ...prev, [skill]: sd }));
      setRemCapBoosts(rcb);
    } else {
      let sd = skillDistribution[skill];
      let rsp = remSkillPoints;
      let rcb = remCapBoosts;
      for (let i = change; i < 0; i++) {
        if (sd.capBoostsSpent > 0 && sd.currentLevel === sd.maxLevel + (5.0 * sd.capBoostsSpent - 5.0) + 1.0) {
          rsp += CalcCostSP(skill, 1, sd.currentLevel - 1);
          sd = { ...sd, currentLevel: sd.currentLevel - 1, currentMaxLevel: sd.currentMaxLevel - 5.0, capBoostsSpent: sd.capBoostsSpent - 1 };
          rcb += 1;
        } else if (sd.currentLevel > sd.baseLevel) {
          rsp += CalcCostSP(skill, 1, sd.currentLevel - 1);
          sd = { ...sd, currentLevel: sd.currentLevel - 1 };
        }
      }
      setRemSkillPoints(rsp);
      setSkillDistribution((prev) => ({ ...prev, [skill]: sd }));
      setRemCapBoosts(rcb);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedPosition) return;

    setHeightInput(positionData[selectedPosition].min_height);
    setWeightInput(positionData[selectedPosition].min_weight);
    setStrength(5);
    setSpeed(5);
    setAgility(5);
    setStamina(5);
    setAwareness(5);
    setConfidence(5);
    setTrait1('');
    setTrait2('');
    setTrait3('');
    filterAndSortSkills();
  }, [selectedPosition]);

  useEffect(() => {
    if (!filteredData.skills || !filteredData.traits) return;
    const skillDist: any = {};
    for (const sk of Object.keys(filteredData.skills)) {
      const baseLevel = FindBaseLevel(sk);
      const maxLevel = FindMaxLevel(sk);
      skillDist[sk] = { baseLevel: baseLevel, currentLevel: baseLevel, maxLevel: maxLevel, currentMaxLevel: maxLevel, capBoostsSpent: 0 };
    }
    setSkillDistribution(skillDist);
  }, [filteredData, remAttributes, heightInput, weightInput, trait1, trait2, trait3]);

  useEffect(() => {
    if (!filteredData.traits) return;
    setRemTrait1Options(
      Object.fromEntries(
        Object.entries(filteredData.traits).filter(
          ([key, value]) => key !== trait2 && key !== trait3 && !(value as any).conflicts.includes(trait2) && !(value as any).conflicts.includes(trait3)
        )
      )
    );
    setRemTrait2Options(
      Object.fromEntries(
        Object.entries(filteredData.traits).filter(
          ([key, value]) => key !== trait1 && key !== trait3 && !(value as any).conflicts.includes(trait1) && !(value as any).conflicts.includes(trait3)
        )
      )
    );
    setRemTrait3Options(
      Object.fromEntries(
        Object.entries(filteredData.traits).filter(
          ([key, value]) => key !== trait1 && key !== trait2 && !(value as any).conflicts.includes(trait1) && !(value as any).conflicts.includes(trait2)
        )
      )
    );
    setRemSkillPoints(
      trait1.includes('superstar') || trait2.includes('superstar') || trait3.includes('superstar')
        ? 220000
        : trait1.includes('prodigy') || trait2.includes('prodigy') || trait3.includes('prodigy')
          ? 216000
          : 210000
    );
  }, [trait1, trait2, trait3]);

  useEffect(() => {
    if (!selectedPosition) return;
    setWeightInputMin(
      positionData[selectedPosition].min_weight +
        positionData[selectedPosition].height_weight_modifier * (heightInput - positionData[selectedPosition].min_height)
    );
    setWeightInputMax(
      positionData[selectedPosition].max_weight +
        positionData[selectedPosition].height_weight_modifier * (heightInput - positionData[selectedPosition].min_height)
    );
  }, [heightInput]);

  useEffect(() => {
    if (weightInput < weightInputMin) setWeightInput(weightInputMin);
    else if (weightInput > weightInputMax) setWeightInput(weightInputMax);
  }, [weightInput, weightInputMin, weightInputMax]);

  useEffect(() => {
    setRemAttributes(35 - (strength + speed + agility + stamina + awareness + confidence));
  }, [strength, speed, agility, stamina, awareness, confidence]);

  return (
    <Container maxWidth={false}>
      <Grid container sx={{ mb: 1 }}>
        {data.skills && data.traits && (
          <>
            <Grid size={{ xs: 12, xl: 3 }}>
              <Box width={350} mt={1}>
                <Stack direction='row' sx={{ justifyContent: 'space-between', mb: 1 }}>
                  <FormControl fullWidth sx={{ minWidth: 150, mr: { xs: 0, lg: 4 } }} size='small'>
                    <InputLabel id='position-select-label'>Position</InputLabel>
                    <Select labelId='position-select-label' id='position-select' value={selectedPosition} label='Position' onChange={handlePositionChange}>
                      <MenuItem value={'QB'}>QB</MenuItem>
                      <MenuItem value={'HB'}>HB</MenuItem>
                      <MenuItem value={'FB'}>FB</MenuItem>
                      <MenuItem value={'TE'}>TE</MenuItem>
                      <MenuItem value={'WR'}>WR</MenuItem>
                      <MenuItem value={'DT'}>DT</MenuItem>
                      <MenuItem value={'DE'}>DE</MenuItem>
                      <MenuItem value={'LB'}>LB</MenuItem>
                      <MenuItem value={'CB'}>CB</MenuItem>
                      <MenuItem value={'SS'}>SS</MenuItem>
                      <MenuItem value={'FS'}>FS</MenuItem>
                      <MenuItem value={'C'}>C</MenuItem>
                      <MenuItem value={'G'}>G</MenuItem>
                      <MenuItem value={'OT'}>OT</MenuItem>
                      <MenuItem value={'K'}>K</MenuItem>
                      <MenuItem value={'P'}>P</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Box>

              {selectedPosition && filteredData.traits && (
                <>
                  <Box sx={{ width: 350, mb: 2 }}>
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      <Grid size={3}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Height:</Typography>
                      </Grid>
                      <Grid size={6}>
                        <Slider
                          step={1}
                          marks
                          min={positionData[selectedPosition].min_height}
                          max={positionData[selectedPosition].max_height}
                          value={heightInput}
                          onChange={(e, value) => setHeightInput(typeof value === 'number' ? value : value[0])}
                          sx={{ width: '150px' }}
                        />
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{`${Math.floor(heightInput / 12)}' ${heightInput % 12}''`}</Typography>
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Weight:</Typography>
                      </Grid>
                      <Grid size={6}>
                        <Slider
                          step={positionData[selectedPosition].height_weight_modifier}
                          marks
                          min={weightInputMin}
                          max={weightInputMax}
                          value={weightInput}
                          onChange={(e, value) => setWeightInput(typeof value === 'number' ? value : value[0])}
                          sx={{ width: '150px' }}
                        />
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{`${weightInput} lbs.`}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1} sx={{ mb: 2, mr: { xs: 0, lg: 4 }, alignItems: 'center' }}>
                      <Grid size={12}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Attribute Points: {remAttributes}</Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Strength:</Typography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <IconButton
                          size='small'
                          color='warning'
                          aria-label='subtract'
                          onClick={() => handleAttributeChange('strength', -1)}
                          disabled={strength <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <Typography>{strength}</Typography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <IconButton
                          size='small'
                          color='primary'
                          aria-label='add'
                          onClick={() => handleAttributeChange('strength', 1)}
                          disabled={strength >= 10}
                        >
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid size={6}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Speed:</Typography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <IconButton size='small' color='warning' aria-label='subtract' onClick={() => handleAttributeChange('speed', -1)} disabled={speed <= 1}>
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <Typography>{speed}</Typography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <IconButton size='small' color='primary' aria-label='add' onClick={() => handleAttributeChange('speed', 1)} disabled={speed >= 10}>
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid size={6}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Agility:</Typography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <IconButton
                          size='small'
                          color='warning'
                          aria-label='subtract'
                          onClick={() => handleAttributeChange('agility', -1)}
                          disabled={agility <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <Typography>{agility}</Typography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <IconButton size='small' color='primary' aria-label='add' onClick={() => handleAttributeChange('agility', 1)} disabled={agility >= 10}>
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid size={6}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Stamina:</Typography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <IconButton
                          size='small'
                          color='warning'
                          aria-label='subtract'
                          onClick={() => handleAttributeChange('stamina', -1)}
                          disabled={stamina <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <Typography>{stamina}</Typography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <IconButton size='small' color='primary' aria-label='add' onClick={() => handleAttributeChange('stamina', 1)} disabled={stamina >= 10}>
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid size={6}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Awareness:</Typography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <IconButton
                          size='small'
                          color='warning'
                          aria-label='subtract'
                          onClick={() => handleAttributeChange('awareness', -1)}
                          disabled={awareness <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <Typography>{awareness}</Typography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <IconButton
                          size='small'
                          color='primary'
                          aria-label='add'
                          onClick={() => handleAttributeChange('awareness', 1)}
                          disabled={awareness >= 10}
                        >
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid size={6}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Confidence:</Typography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <IconButton
                          size='small'
                          color='warning'
                          aria-label='subtract'
                          onClick={() => handleAttributeChange('confidence', -1)}
                          disabled={confidence <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <Typography>{confidence}</Typography>
                      </Grid>
                      <Grid size={2} sx={{ textAlign: 'center' }}>
                        <IconButton
                          size='small'
                          color='primary'
                          aria-label='add'
                          onClick={() => handleAttributeChange('confidence', 1)}
                          disabled={confidence >= 10}
                        >
                          <AddIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1} sx={{ mr: { xs: 0, lg: 4 }, mb: 1, alignItems: 'center' }}>
                      <Grid size={4}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Trait 1:</Typography>
                      </Grid>
                      <Grid size={8}>
                        <FormControl fullWidth>
                          <Select size='small' id='trait-one-select' value={trait1} onChange={handleTrait1Change}>
                            {Object.entries(remTrait1Options).map(([key, value]) => (
                              <MenuItem key={key} value={key}>
                                {(value as any).name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={4}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Trait 2:</Typography>
                      </Grid>
                      <Grid size={8}>
                        <FormControl fullWidth>
                          <Select size='small' id='trait-one-select' value={trait2} onChange={handleTrait2Change}>
                            {Object.entries(remTrait2Options).map(([key, value]) => (
                              <MenuItem key={key} value={key}>
                                {(value as any).name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={4}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Trait 3:</Typography>
                      </Grid>
                      <Grid size={8}>
                        <FormControl fullWidth>
                          <Select size='small' id='trait-one-select' value={trait3} onChange={handleTrait3Change}>
                            {Object.entries(remTrait3Options).map(([key, value]) => (
                              <MenuItem key={key} value={key}>
                                {(value as any).name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </Grid>
            {selectedPosition && filteredData.skills && filteredData.traits && Object.keys(skillDistribution).length > 0 && (
              <Grid container size={{ xs: 12, xl: 9 }} spacing={1} sx={{ alignItems: 'center' }}>
                <Grid size={6} sx={{ mt: 1 }}>
                  <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Skill Points: {remSkillPoints}</Typography>
                </Grid>
                <Grid size={6} sx={{ mt: 1 }}>
                  <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Cap Boosts: {remCapBoosts}</Typography>
                </Grid>
                {groupOrder[selectedPosition].map((group) => (
                  <Fragment key={group}>
                    <Grid size={12}>
                      <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>
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
                          <Grid size={{ xs: 8, lg: 2 }}>
                            <Typography sx={{ typography: { xs: 'caption', lg: 'body2' } }}>{SKILL_LOOKUP[key]}</Typography>
                          </Grid>
                          <Grid size={{ xs: 4, lg: 2 }} sx={{ height: '24px', textAlign: 'center' }}>
                            <IconButton
                              size='small'
                              color='warning'
                              aria-label='subtract five'
                              sx={{ p: 0 }}
                              onClick={() => handleSkillChange(key, -5)}
                              disabled={(skillDistribution[key]?.currentLevel ?? 0) <= (skillDistribution[key]?.baseLevel ?? 0)}
                            >
                              <KeyboardDoubleArrowLeftIcon />
                            </IconButton>
                            <IconButton
                              size='small'
                              color='warning'
                              aria-label='subtract one'
                              sx={{ p: 0, mx: 1 }}
                              onClick={() => handleSkillChange(key, -1)}
                              disabled={(skillDistribution[key]?.currentLevel ?? 0) <= (skillDistribution[key]?.baseLevel ?? 0)}
                            >
                              <KeyboardArrowLeftIcon />
                            </IconButton>
                            <IconButton
                              size='small'
                              color='primary'
                              aria-label='add one'
                              sx={{ p: 0, mx: 1 }}
                              onClick={() => handleSkillChange(key, 1)}
                              disabled={
                                ((skillDistribution[key]?.currentLevel ?? 0) >= (skillDistribution[key]?.currentMaxLevel ?? 0) && remCapBoosts <= 0) ||
                                (skillDistribution[key]?.currentLevel ?? 0) >= 100 ||
                                remSkillPoints < CalcCostSP(key, 1, skillDistribution[key]?.currentLevel ?? 0)
                              }
                            >
                              <KeyboardArrowRightIcon />
                            </IconButton>
                            <IconButton
                              size='small'
                              color='primary'
                              aria-label='add five'
                              sx={{ p: 0 }}
                              onClick={() => handleSkillChange(key, 5)}
                              disabled={
                                ((skillDistribution[key]?.currentLevel ?? 0) >= (skillDistribution[key]?.currentMaxLevel ?? 0) && remCapBoosts <= 0) ||
                                (skillDistribution[key]?.currentLevel ?? 0) >= 100 ||
                                remSkillPoints < CalcCostSP(key, 1, skillDistribution[key]?.currentLevel ?? 0)
                              }
                            >
                              <KeyboardDoubleArrowRightIcon />
                            </IconButton>
                          </Grid>
                          <Grid size={{ xs: 12, lg: 2 }} sx={{ px: { xs: 0, lg: 1 }, mb: { xs: 1, lg: 0 } }}>
                            <SkillBar
                              skillLevel={skillDistribution[key]?.currentLevel ?? 0}
                              maxSkillLevel={skillDistribution[key]?.currentMaxLevel ?? 0}
                              skillCost={CalcCostSP(key, 1, skillDistribution[key]?.currentLevel ?? 0)}
                              capBoostsSpent={skillDistribution[key]?.capBoostsSpent ?? 0}
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
      </Grid>
    </Container>
  );
}
