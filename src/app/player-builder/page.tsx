'use client';

import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { SKILL_LOOKUP } from '../players/lookups';
import SkillBar from '../components/SkillBar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { SALARIES } from '../players/salaries';
import { POSITION_DATA } from '../players/positionData';

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
  const [isMaxLevelPlayer, setIsMaxLevelPlayer] = useState(true);
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
    const spmax = trait1 === 'natural' || trait2 === 'natural' || trait3 === 'natural' ? 1000 : 500;
    while (spspent < spmax) {
      level += 1;
      spspent += CalcCostSP(skill, 1, level);
    }
    return level;
  };

  const FindMaxLevel = (skill: string): number => {
    if (!filteredData.skills[skill]) return 100;

    let maxlevel = 33;
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

    const skillsEntries: [string, any][] = Object.entries(data.skills).filter(([, value]) => (value as any).positions.includes(selectedPosition));

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

    const traitsEntries: [string, any][] = Object.entries(data.traits).filter(([, value]) => !(value as any).position_exclusions.includes(selectedPosition));

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

  const getSalary = (): number => {
    if (!filteredData) return 0;
    let salary = SALARIES[selectedPosition] * 0.52 * ((2 + Math.pow(25, 1.135)) / 2);
    let modifier = 0;

    const t1 = filteredData.traits[trait1]?.salary_modifier ?? 0;
    const t2 = filteredData.traits[trait2]?.salary_modifier ?? 0;
    const t3 = filteredData.traits[trait3]?.salary_modifier ?? 0;
    modifier = +t1! + +t2! + +t3!;

    salary *= 1 + modifier;

    if (salary > 5000000) {
      salary = 25000 * Math.ceil(salary / 25000);
    } else if (salary > 1000000) {
      salary = 10000 * Math.ceil(salary / 10000);
    } else {
      salary = 5000 * Math.ceil(salary / 5000);
    }

    return salary;
  };

  const handlePositionChange = (event: SelectChangeEvent) => {
    setSelectedPosition(event.target.value);
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
        const cost = CalcCostSP(skill, 1, sd.currentLevel);
        if (rsp - cost < 0) break;
        if (sd.currentLevel < sd.currentMaxLevel && sd.currentLevel < 100) {
          rsp -= cost;
          sd = { ...sd, currentLevel: sd.currentLevel + 1 };
        } else if (rcb > 0 && sd.currentLevel < 100) {
          rsp -= cost;
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
        const cost = CalcCostSP(skill, 1, sd.currentLevel - 1);
        if (sd.capBoostsSpent > 0 && sd.currentLevel === sd.maxLevel + (5.0 * sd.capBoostsSpent - 5.0) + 1.0) {
          rsp += cost;
          sd = { ...sd, currentLevel: sd.currentLevel - 1, currentMaxLevel: sd.currentMaxLevel - 5.0, capBoostsSpent: sd.capBoostsSpent - 1 };
          rcb += 1;
        } else if (sd.currentLevel > sd.baseLevel) {
          rsp += cost;
          sd = { ...sd, currentLevel: sd.currentLevel - 1 };
        }
      }
      setRemSkillPoints(rsp);
      setSkillDistribution((prev) => ({ ...prev, [skill]: sd }));
      setRemCapBoosts(rcb);
    }
  };

  const handleMaxLevelSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsMaxLevelPlayer(event.target.checked);
  };

  const handleCopyClick = async () => {
    const skills: any = {};
    Object.keys(skillDistribution).forEach((x) => (skills[x] = skillDistribution[x].currentLevel));

    const player = {
      Position: selectedPosition,
      Height: `${Math.floor(heightInput / 12)}' ${heightInput % 12}''`,
      Weight: `${weightInput} lbs.`,
      Strength: strength,
      Speed: speed,
      Agility: agility,
      Stamina: stamina,
      Awareness: awareness,
      Confidence: confidence,
      Trait1: trait1,
      Trait2: trait2,
      Trait3: trait3,
      Salary: getSalary().toLocaleString(),
      Build: isMaxLevelPlayer ? 'End' : 'Start',
      'Remaining SP': remSkillPoints,
      'Remaining Caps': remCapBoosts,
      ...skills,
    };

    await navigator.clipboard.writeText(JSON.stringify(player, null, 2));
    alert('Build copied to your clipboard.');
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedPosition) return;

    setHeightInput(POSITION_DATA[selectedPosition].min_height);
    setWeightInput(POSITION_DATA[selectedPosition].min_weight);
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
    setRemCapBoosts(isMaxLevelPlayer ? 7 : 4);
    setRemSkillPoints(
      trait1.includes('superstar') || trait2.includes('superstar') || trait3.includes('superstar')
        ? isMaxLevelPlayer
          ? 220000
          : 90500
        : trait1.includes('prodigy') || trait2.includes('prodigy') || trait3.includes('prodigy')
        ? isMaxLevelPlayer
          ? 216000
          : 88000
        : isMaxLevelPlayer
        ? 210000
        : 85000
    );
  }, [filteredData, remAttributes, heightInput, weightInput, trait1, trait2, trait3, isMaxLevelPlayer]);

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
  }, [trait1, trait2, trait3]);

  useEffect(() => {
    if (!selectedPosition) return;
    setWeightInputMin(
      POSITION_DATA[selectedPosition].min_weight +
        POSITION_DATA[selectedPosition].height_weight_modifier * (heightInput - POSITION_DATA[selectedPosition].min_height)
    );
    setWeightInputMax(
      POSITION_DATA[selectedPosition].max_weight +
        POSITION_DATA[selectedPosition].height_weight_modifier * (heightInput - POSITION_DATA[selectedPosition].min_height)
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
              <Box width={350} my={1}>
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
              </Box>

              {selectedPosition && filteredData.traits && (
                <>
                  <Box sx={{ width: 350 }}>
                    <Grid container spacing={{ xs: 0, sm: 1 }} sx={{ alignItems: 'center' }}>
                      <Grid size={3}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Height:</Typography>
                      </Grid>
                      <Grid size={6}>
                        <Slider
                          size='small'
                          step={1}
                          marks
                          min={POSITION_DATA[selectedPosition].min_height}
                          max={POSITION_DATA[selectedPosition].max_height}
                          value={heightInput}
                          onChange={(e, value) => setHeightInput(typeof value === 'number' ? value : value[0])}
                          sx={{ width: '95%' }}
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
                          size='small'
                          step={1}
                          marks
                          min={weightInputMin}
                          max={weightInputMax}
                          value={weightInput}
                          onChange={(e, value) => setWeightInput(typeof value === 'number' ? value : value[0])}
                          sx={{ width: '95%' }}
                        />
                      </Grid>
                      <Grid size={3}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{`${weightInput} lbs.`}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={{ xs: 0, sm: 1 }} sx={{ mb: 2, mr: { xs: 0, lg: 4 }, alignItems: 'center' }}>
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
                          disabled={strength >= 10 || remAttributes <= 0}
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
                        <IconButton
                          size='small'
                          color='primary'
                          aria-label='add'
                          onClick={() => handleAttributeChange('speed', 1)}
                          disabled={speed >= 10 || remAttributes <= 0}
                        >
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
                        <IconButton
                          size='small'
                          color='primary'
                          aria-label='add'
                          onClick={() => handleAttributeChange('agility', 1)}
                          disabled={agility >= 10 || remAttributes <= 0}
                        >
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
                        <IconButton
                          size='small'
                          color='primary'
                          aria-label='add'
                          onClick={() => handleAttributeChange('stamina', 1)}
                          disabled={stamina >= 10 || remAttributes <= 0}
                        >
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
                          disabled={awareness >= 10 || remAttributes <= 0}
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
                          disabled={confidence >= 10 || remAttributes <= 0}
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
                      <Grid size={12} sx={{ mt: 1 }}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Medium Salary: {getSalary().toLocaleString()}</Typography>
                      </Grid>
                      <Grid size={12}>
                        <Button variant='contained' size='small' onClick={() => handleCopyClick()} sx={{ minWidth: '350px' }}>
                          Copy Build to Clipboard
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </Grid>
            {selectedPosition && filteredData.skills && filteredData.traits && Object.keys(skillDistribution).length > 0 && (
              <Grid container size={{ xs: 12, xl: 9 }} spacing={{ xs: 0, sm: 1 }} sx={{ alignItems: 'center' }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Starter Build</Typography>
                    <Switch checked={isMaxLevelPlayer} onChange={handleMaxLevelSwitchChange} size='small' color='default' />
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>End Build</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }} sx={{ my: 1 }}>
                  <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Skill Points: {remSkillPoints}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }} sx={{ my: 1 }}>
                  <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Cap Boosts: {remCapBoosts}</Typography>
                </Grid>
                {groupOrder[selectedPosition].map((group) => (
                  <Fragment key={group}>
                    <Grid size={12}>
                      <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>
                        <strong>{group}</strong>
                      </Typography>
                      <Divider sx={{ my: { xs: 0.5, sm: 1 } }} />
                    </Grid>
                    {Object.entries(data.skills)
                      .filter(([, value]) => (value as any).group === group && (value as any).positions.includes(selectedPosition))
                      .sort((a: any, b: any) => {
                        const groupIndexA = groupOrder[selectedPosition].indexOf(a[1].group);
                        const groupIndexB = groupOrder[selectedPosition].indexOf(b[1].group);

                        if (groupIndexA !== groupIndexB) {
                          return groupIndexA - groupIndexB;
                        } else {
                          return a[1].priority - b[1].priority;
                        }
                      })
                      .map(([key]) => (
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
                              sx={{ p: 0, mx: 0.5 }}
                              onClick={() => handleSkillChange(key, -1)}
                              disabled={(skillDistribution[key]?.currentLevel ?? 0) <= (skillDistribution[key]?.baseLevel ?? 0)}
                            >
                              <KeyboardArrowLeftIcon />
                            </IconButton>
                            <IconButton
                              size='small'
                              color='primary'
                              aria-label='add one'
                              sx={{ p: 0, mx: 0.5 }}
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
