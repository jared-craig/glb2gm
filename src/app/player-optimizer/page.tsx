'use client';

import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Fragment, useEffect, useState } from 'react';
import { getSkillMins } from '../player-optimizer/skillMins';
import { SKILL_LOOKUP } from '../players/lookups';
import { Player } from '../players/player';
import { getPossibleAttributes, getPossibleHeightsWeights, getPossibleTraits } from '../players/possibilities';
import { SALARIES } from '../players/salaries';
import { getBasePlayers } from '../players/basePlayers';
import LinearProgressWithLabel from '../components/LinearProgressWithLabel';
import Link from 'next/link';
import { OptimizedPlayer } from './optimizedPlayer';
import { POSITION_DATA } from '../players/positionData';

export interface PlayerBuilderData {
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
  const [basePlayer, setBasePlayer] = useState<Player>();
  const [player, setPlayer] = useState<Player>();
  const [remSkillPoints, setRemSkillPoints] = useState<number>(0);
  const [remCapBoosts, setRemCapBoosts] = useState<number>(0);
  const [capBoostsSpent, setCapBoostsSpent] = useState<{ [key: string]: number }>({});
  const [skillMins, setSkillMins] = useState<{ [key: string]: number }>();
  const [attCombos, setAttCombos] = useState<any>();
  const [allPossibleTraits, setAllPossibleTraits] = useState<any>([]);
  const [traitCombos, setTraitCombos] = useState<any>();
  const [heightWeightCombos, setHeightWeightCombos] = useState<any>();
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizeProgress, setOptimizeProgress] = useState(0);
  const [optimizeBuffer, setOptimizeBuffer] = useState(10);
  const [isPossibleCombo, setIsPossibleCombo] = useState<boolean>(true);
  const [minSalary, setMinSalary] = useState<number>(0);
  const [maxSalary, setMaxSalary] = useState<number>(0);
  const [maxSalaryInput, setMaxSalaryInput] = useState<string>('15000000');
  const [build, setBuild] = useState<any>();
  const [optimizedBuild, setOptimizedBuild] = useState<any>();

  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [weightInputMin, setWeightInputMin] = useState<number>(0);
  const [weightInputMax, setWeightInputMax] = useState<number>(0);
  const [lockHeight, setLockHeight] = useState(false);
  const [lockWeight, setLockWeight] = useState(false);

  const [remTrait1Options, setRemTrait1Options] = useState({});
  const [remTrait2Options, setRemTrait2Options] = useState({});
  const [remTrait3Options, setRemTrait3Options] = useState({});
  const [trait1, setTrait1] = useState('');
  const [trait2, setTrait2] = useState('');
  const [trait3, setTrait3] = useState('');
  const [lockTrait1, setLockTrait1] = useState(false);
  const [lockTrait2, setLockTrait2] = useState(false);
  const [lockTrait3, setLockTrait3] = useState(false);

  const fetchData = async () => {
    setAttCombos(getPossibleAttributes());
    const skillsRes = await fetch('/api/glb2-data/skills');
    const skillsData = await skillsRes.json();

    const traitsRes = await fetch('/api/glb2-data/traits');
    const traitsData = await traitsRes.json();
    setData({ skills: skillsData, traits: traitsData });
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

    const traitsEntries = Object.entries(data.traits).filter(
      ([key, value]) =>
        !(value as any).position_exclusions.includes(selectedPosition) && (Object.keys((value as any).skill_modifiers).length > 0 || key === 'natural')
    );

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

  const buildPlayer = async (optimize: string, updatedPlayer: Player): Promise<OptimizedPlayer> => {
    let hw: any[] = [];
    let at: any[] = [];
    let tr: any[] = [];

    let filteredHW = heightWeightCombos.filter((x: any) => (!lockHeight || x.height === +height) && (!lockWeight || x.weight === +weight));

    switch (optimize) {
      case 'hw':
        hw = filteredHW;
        at = [
          {
            strength: updatedPlayer.strength,
            speed: updatedPlayer.speed,
            agility: updatedPlayer.agility,
            stamina: updatedPlayer.stamina,
            awareness: updatedPlayer.awareness,
            confidence: updatedPlayer.confidence,
          },
        ];
        tr = [[updatedPlayer.trait1, updatedPlayer.trait2, updatedPlayer.trait3]];
        break;
      case 'at':
        hw = [{ height: lockHeight ? +height : updatedPlayer.height, weight: lockWeight ? +weight : updatedPlayer.weight }];
        at = attCombos;
        tr = [[updatedPlayer.trait1, updatedPlayer.trait2, updatedPlayer.trait3]];
        break;
      case 'tr':
        hw = [{ height: lockHeight ? +height : updatedPlayer.height, weight: lockWeight ? +weight : updatedPlayer.weight }];
        at = [
          {
            strength: updatedPlayer.strength,
            speed: updatedPlayer.speed,
            agility: updatedPlayer.agility,
            stamina: updatedPlayer.stamina,
            awareness: updatedPlayer.awareness,
            confidence: updatedPlayer.confidence,
          },
        ];
        tr = traitCombos.filter((x: any) => getTraitsSalary(x) <= +maxSalaryInput);
        break;
    }

    const reqBody: any = {
      position: selectedPosition,
      attCombos: at,
      traitCombos: tr,
      heightWeightCombos: hw,
      data,
      filteredData,
      skillMins,
    };
    const res = await fetch('/api/player-optimizer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    });

    let optimizedPlayer: OptimizedPlayer = {
      newPlayer: undefined,
      build: undefined,
      isPossibleCombo: undefined,
      remSkillPoints: undefined,
      remCapBoosts: undefined,
      capBoostsSpent: undefined,
    };

    if (!res.ok || res.status === 500) {
      setIsPossibleCombo(false);
      setIsOptimizing(false);
      setOptimizeProgress(0);
      setOptimizeBuffer(13);
      console.error('failed to optimize player');
      return optimizedPlayer;
    } else {
      const result = await res.json();
      if (result.success) {
        optimizedPlayer.newPlayer = {
          position: selectedPosition,
          trait1: result.best[0],
          trait2: result.best[1],
          trait3: result.best[2],
          height: result.best.height,
          weight: result.best.weight,
          strength: result.best.strength,
          speed: result.best.speed,
          agility: result.best.agility,
          stamina: result.best.stamina,
          awareness: result.best.awareness,
          confidence: result.best.confidence,
        };
        optimizedPlayer.build = result.best.build;
        optimizedPlayer.isPossibleCombo = true;
        optimizedPlayer.remSkillPoints = result.best.sp;
        optimizedPlayer.remCapBoosts = result.best.cbr;
        optimizedPlayer.capBoostsSpent = result.best.cbs;
      } else {
        optimizedPlayer.newPlayer = {
          position: selectedPosition,
          trait1: result.bestFailing[0],
          trait2: result.bestFailing[1],
          trait3: result.bestFailing[2],
          height: result.bestFailing.height,
          weight: result.bestFailing.weight,
          strength: result.bestFailing.strength,
          speed: result.bestFailing.speed,
          agility: result.bestFailing.agility,
          stamina: result.bestFailing.stamina,
          awareness: result.bestFailing.awareness,
          confidence: result.bestFailing.confidence,
        };
        optimizedPlayer.build = result.bestFailing.build;
        optimizedPlayer.isPossibleCombo = false;
        optimizedPlayer.remSkillPoints = result.bestFailing.sp;
        optimizedPlayer.remCapBoosts = result.bestFailing.cbr;
        optimizedPlayer.capBoostsSpent = result.bestFailing.cbs;
      }
    }

    return optimizedPlayer;
  };

  const getSalary = (): number => {
    if (!filteredData.traits || !trait1 || !trait2 || !trait3) return 0;
    let salary = SALARIES[selectedPosition] * 0.52 * ((2 + Math.pow(25, 1.135)) / 2);
    let modifier = 0;

    const t1 = filteredData.traits[trait1]?.salary_modifier || 0;
    const t2 = filteredData.traits[trait2]?.salary_modifier || 0;
    const t3 = filteredData.traits[trait3]?.salary_modifier || 0;
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

  const getTraitsSalary = (traits: any[]): number => {
    if (!filteredData.traits) return 0;
    let salary = SALARIES[selectedPosition] * 0.52 * ((2 + Math.pow(25, 1.135)) / 2);
    let modifier = 0;

    const t1 = filteredData.traits[traits[0]].salary_modifier;
    const t2 = filteredData.traits[traits[1]].salary_modifier;
    const t3 = filteredData.traits[traits[2]].salary_modifier;
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

  const getMinSalary = (position: string): number => {
    let salary = SALARIES[position] * 0.52 * ((2 + Math.pow(25, 1.135)) / 2);

    if (salary > 5000000) {
      return 25000 * Math.ceil(salary / 25000);
    } else if (salary > 1000000) {
      return 10000 * Math.ceil(salary / 10000);
    } else {
      return 5000 * Math.ceil(salary / 5000);
    }
  };

  const filterConflicts = (sourceArray: any[], targetArray: any[]) => {
    let count = 0;
    for (const sourceItem of sourceArray) {
      if (count === 3) break;
      if (!targetArray.some((x) => x[1].conflicts.includes(sourceItem[0]))) {
        targetArray.push(sourceItem);
        count++;
      }
    }
  };

  const getMaxSalary = (): number => {
    if (!filteredData.traits) return 0;
    let salary = SALARIES[selectedPosition] * 0.52 * ((2 + Math.pow(25, 1.135)) / 2);
    let modifier = 0;

    let expensiveTraits: any[] = [];

    filterConflicts(
      Object.entries(filteredData.traits).sort(([, aValue]: any, [, bValue]: any) => bValue.salary_modifier - aValue.salary_modifier),
      expensiveTraits
    );

    const t1 = expensiveTraits[0][1].salary_modifier;
    const t2 = expensiveTraits[1][1].salary_modifier;
    const t3 = expensiveTraits[2][1].salary_modifier;
    modifier = +t1! + +t2! + +t3!;

    salary *= 1 + modifier;

    if (salary > 5000000) {
      return 25000 * Math.ceil(salary / 25000);
    } else if (salary > 1000000) {
      return 10000 * Math.ceil(salary / 10000);
    } else {
      return 5000 * Math.ceil(salary / 5000);
    }
  };

  const FindMaxLevel = (skill: string, playerData: Player, capBoostsSpent: any): number => {
    const skillData = filteredData.skills[skill];
    if (!skillData) return 100;

    const { strength, agility, awareness, speed, stamina, confidence, height: playerHeight, weight: playerWeight, position } = playerData;
    const { attributes, position_multiplier, height, weight } = skillData;

    const calculateReduction = (attributeValue: number, attributeMultiplier: number) => attributeValue ** 1.3 * (attributeMultiplier || 0);

    let maxlevel = 33;
    maxlevel -= calculateReduction(strength, attributes.strength);
    maxlevel -= calculateReduction(agility, attributes.agility);
    maxlevel -= calculateReduction(awareness, attributes.awareness);
    maxlevel -= calculateReduction(speed, attributes.speed);
    maxlevel -= calculateReduction(stamina, attributes.stamina);
    maxlevel -= calculateReduction(confidence, attributes.confidence);

    const addTraitModifier = (trait: string) => {
      const traitModifiers = data.traits[trait]?.skill_modifiers;
      if (traitModifiers && skill in traitModifiers) {
        maxlevel += traitModifiers[skill]?.max || 0;
      }
    };

    addTraitModifier(playerData.trait1);
    addTraitModifier(playerData.trait2);
    addTraitModifier(playerData.trait3);

    maxlevel += (100 - position_multiplier[position]) * 0.4;
    maxlevel -= height * (playerHeight - 66) * 0.5;
    maxlevel -= weight * playerWeight * 0.25;

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

  const handlePositionChange = (event: SelectChangeEvent) => {
    setSelectedPosition(event.target.value as string);
  };

  const handleOptimizeClick = async () => {
    if (!skillMins || !basePlayer) return;

    setIsOptimizing(true);
    setIsPossibleCombo(true);
    setBuild(undefined);
    setLockTrait1(false);
    setLockTrait2(false);
    setLockTrait3(false);

    let newPlayer = { ...basePlayer };

    setOptimizeBuffer(13);
    let buildResult = await buildPlayer('at', newPlayer);
    if (buildResult.newPlayer === undefined) {
      setIsOptimizing(false);
      setOptimizeProgress(0);
      setOptimizeBuffer(13);
      return;
    }
    setOptimizeBuffer(15);
    setOptimizeProgress(13);
    buildResult = await buildPlayer('tr', buildResult.newPlayer);
    setOptimizeBuffer(17);
    setOptimizeProgress(15);
    buildResult = await buildPlayer('hw', buildResult.newPlayer);
    setOptimizeBuffer(30);
    setOptimizeProgress(17);

    buildResult = await buildPlayer('at', buildResult.newPlayer);
    setOptimizeBuffer(32);
    setOptimizeProgress(30);
    buildResult = await buildPlayer('hw', buildResult.newPlayer);
    setOptimizeBuffer(34);
    setOptimizeProgress(32);
    buildResult = await buildPlayer('tr', buildResult.newPlayer);
    setOptimizeBuffer(36);
    setOptimizeProgress(34);

    buildResult = await buildPlayer('hw', buildResult.newPlayer);
    setOptimizeBuffer(49);
    setOptimizeProgress(36);
    buildResult = await buildPlayer('at', buildResult.newPlayer);
    setOptimizeBuffer(51);
    setOptimizeProgress(49);
    buildResult = await buildPlayer('tr', buildResult.newPlayer);
    setOptimizeBuffer(53);
    setOptimizeProgress(51);

    buildResult = await buildPlayer('hw', buildResult.newPlayer);
    setOptimizeBuffer(55);
    setOptimizeProgress(53);
    buildResult = await buildPlayer('tr', buildResult.newPlayer);
    setOptimizeBuffer(68);
    setOptimizeProgress(55);
    buildResult = await buildPlayer('at', buildResult.newPlayer);
    setOptimizeBuffer(70);
    setOptimizeProgress(68);

    buildResult = await buildPlayer('tr', buildResult.newPlayer);
    setOptimizeBuffer(72);
    setOptimizeProgress(70);
    buildResult = await buildPlayer('hw', buildResult.newPlayer);
    setOptimizeBuffer(84);
    setOptimizeProgress(72);
    buildResult = await buildPlayer('at', buildResult.newPlayer);
    setOptimizeBuffer(86);
    setOptimizeProgress(84);

    buildResult = await buildPlayer('tr', buildResult.newPlayer);
    setOptimizeBuffer(98);
    setOptimizeProgress(86);
    buildResult = await buildPlayer('at', buildResult.newPlayer);
    setOptimizeBuffer(100);
    setOptimizeProgress(98);
    buildResult = await buildPlayer('hw', buildResult.newPlayer);
    setOptimizeProgress(100);

    setOptimizedBuild({
      ...readifyPlayer(buildResult.newPlayer),
      Salary: getSalary().toLocaleString(),
      ...readifyBuild(buildResult.build),
    });
    setBuild(buildResult.build);
    setPlayer(buildResult.newPlayer);
    setIsPossibleCombo(buildResult.isPossibleCombo);
    setRemSkillPoints(buildResult.remSkillPoints);
    setRemCapBoosts(buildResult.remCapBoosts);
    setCapBoostsSpent(buildResult.capBoostsSpent);

    setIsOptimizing(false);
    setOptimizeProgress(0);
    setOptimizeBuffer(13);
  };

  const handleSkillMinChange = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const num = +event.target.value;
    if (Number.isNaN(num))
      setSkillMins((prev) => ({
        ...prev,
        [key]: 0,
      }));
    else
      setSkillMins((prev) => ({
        ...prev,
        [key]: num < 0 ? 0 : num > 100 ? 100 : num,
      }));
  };

  const handleMaxSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const num = +event.target.value;
    if (!Number.isNaN(num)) setMaxSalaryInput(num.toString());
  };

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(JSON.stringify(optimizedBuild, null, 2));
    alert('Build copied to your clipboard.');
  };

  const readifyPlayer = (playerObj: Player | undefined) => {
    if (!playerObj) return {};
    return {
      position: playerObj.position,
      height: `${Math.floor(playerObj.height / 12)}'${playerObj.height % 12}''`,
      weight: `${playerObj.weight} lbs.`,
      strength: playerObj.strength,
      speed: playerObj.speed,
      agility: playerObj.agility,
      stamina: playerObj.stamina,
      awareness: playerObj.awareness,
      confidence: playerObj.confidence,
      trait1: data.traits[playerObj.trait1].name,
      trait2: data.traits[playerObj.trait2].name,
      trait3: data.traits[playerObj.trait3].name,
    };
  };

  const readifyBuild = (buildObj: any) => {
    return Object.fromEntries(Object.entries(buildObj).map(([key, value]) => [SKILL_LOOKUP[key], value]));
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedPosition) return;
    setWeightInputMin(
      POSITION_DATA[selectedPosition].min_weight +
        POSITION_DATA[selectedPosition].height_weight_modifier * (height - POSITION_DATA[selectedPosition].min_height)
    );
    setWeightInputMax(
      POSITION_DATA[selectedPosition].max_weight +
        POSITION_DATA[selectedPosition].height_weight_modifier * (height - POSITION_DATA[selectedPosition].min_height)
    );
  }, [height]);

  useEffect(() => {
    if (!selectedPosition) return;
    setIsPossibleCombo(true);
    setRemSkillPoints(0);
    setRemCapBoosts(0);
    setBuild(undefined);
    filterAndSortSkills();
    const basePlayer = getBasePlayers(selectedPosition);
    setBasePlayer(basePlayer);
    setLockHeight(false);
    setLockWeight(false);
    setLockTrait1(false);
    setLockTrait2(false);
    setLockTrait3(false);
    setHeight(POSITION_DATA[selectedPosition].min_height);
    setWeight(POSITION_DATA[selectedPosition].min_weight);
    setTrait1(basePlayer.trait1);
    setTrait2(basePlayer.trait2);
    setTrait3(basePlayer.trait3);
    setMinSalary(getMinSalary(selectedPosition));
  }, [selectedPosition]);

  useEffect(() => {
    if (!selectedPosition || !filteredData) return;

    setSkillMins(getSkillMins(selectedPosition));
    const allPossibleTraits = getPossibleTraits(filteredData.traits);
    setAllPossibleTraits(allPossibleTraits);
    setTraitCombos(allPossibleTraits);
    setHeightWeightCombos(getPossibleHeightsWeights(selectedPosition));
    setMaxSalary(getMaxSalary());
  }, [filteredData]);

  useEffect(() => {
    setMaxSalaryInput(maxSalary.toString());
  }, [maxSalary]);

  useEffect(() => {
    if (!height || !selectedPosition) return;
    setWeightInputMin(
      POSITION_DATA[selectedPosition].min_weight +
        POSITION_DATA[selectedPosition].height_weight_modifier * (height - POSITION_DATA[selectedPosition].min_height)
    );
    setWeightInputMax(
      POSITION_DATA[selectedPosition].max_weight +
        POSITION_DATA[selectedPosition].height_weight_modifier * (height - POSITION_DATA[selectedPosition].min_height)
    );
  }, [height]);

  useEffect(() => {
    if (weight < weightInputMin) {
      setLockWeight(false);
      setWeight(weightInputMin);
    } else if (weight > weightInputMax) {
      setLockWeight(false);
      setWeight(weightInputMax);
    }
  }, [weight, weightInputMin, weightInputMax]);

  useEffect(() => {
    if (!player) return;
    setHeight(player.height);
    setWeight(player.weight);
    setTrait1(player.trait1);
    setTrait2(player.trait2);
    setTrait3(player.trait3);
  }, [player]);

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
    let possibleTraitCombos = allPossibleTraits;
    if (lockTrait1) {
      possibleTraitCombos = possibleTraitCombos.filter((x: any) => x.some((y: any) => y === trait1));
    }
    if (lockTrait2) {
      possibleTraitCombos = possibleTraitCombos.filter((x: any) => x.some((y: any) => y === trait2));
    }
    if (lockTrait3) {
      possibleTraitCombos = possibleTraitCombos.filter((x: any) => x.some((y: any) => y === trait3));
    }
    setTraitCombos(possibleTraitCombos);
  }, [lockTrait1, lockTrait2, lockTrait3]);

  return (
    <Container maxWidth='xl' sx={{ mb: 2 }}>
      {isOptimizing ? (
        <>
          <Stack sx={{ alignItems: 'center' }}>
            <Typography variant='caption'>Thanks for using GLB2GM!</Typography>
            <Typography variant='caption'>
              Consider supporting me through{' '}
              <Link href={'https://www.patreon.com/MadKingCraig'} target='_blank' style={{ color: 'inherit' }}>
                Patreon
              </Link>
            </Typography>
          </Stack>
          <LinearProgressWithLabel variant='buffer' value={optimizeProgress} valueBuffer={optimizeBuffer} />
        </>
      ) : (
        <>
          <Grid container sx={{ mb: 1 }}>
            {(!data.skills || !data.traits) && <LinearProgress />}
            {data.skills && data.traits && (
              <Box width={350} mt={1}>
                <Stack direction='row' sx={{ justifyContent: 'space-between', mb: 1 }}>
                  <FormControl sx={{ minWidth: { xs: '100%', sm: 350 } }} size='small'>
                    <InputLabel id='position-select-label'>Position</InputLabel>
                    <Select
                      labelId='position-select-label'
                      id='position-select'
                      label='Position'
                      value={selectedPosition}
                      defaultValue=''
                      onChange={handlePositionChange}
                    >
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
            )}
          </Grid>
          {selectedPosition && basePlayer && (
            <>
              <Box sx={{ width: 350 }}>
                <Grid container spacing={1} sx={{ mr: { xs: 0, lg: 2 }, mb: 1, alignItems: 'center' }}>
                  <Grid size={12} sx={{ textAlign: 'center' }}>
                    <Typography variant='body2'>Check to Lock Option</Typography>
                  </Grid>
                  <Grid size={11} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Slider
                      size='small'
                      step={1}
                      marks
                      min={POSITION_DATA[selectedPosition].min_height}
                      max={POSITION_DATA[selectedPosition].max_height}
                      value={height}
                      onChange={(e, value) => setHeight(typeof value === 'number' ? value : value[0])}
                      disabled={lockHeight}
                      sx={{ width: '220px', mr: 2 }}
                    />
                    <Typography sx={{ typography: { xs: 'body2' } }}>{`${Math.floor(height / 12)}' ${height % 12}''`}</Typography>
                  </Grid>
                  <Grid size={1}>
                    <Checkbox checked={lockHeight} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLockHeight(event.target.checked)} />
                  </Grid>
                  <Grid size={11} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Slider
                      size='small'
                      step={1}
                      marks
                      min={weightInputMin}
                      max={weightInputMax}
                      value={weight}
                      onChange={(e, value) => setWeight(typeof value === 'number' ? value : value[0])}
                      disabled={lockWeight}
                      sx={{ width: '220px', mr: 2 }}
                    />
                    <Typography sx={{ typography: { xs: 'body2' } }}>{`${weight} lbs.`}</Typography>
                  </Grid>
                  <Grid size={1}>
                    <Checkbox checked={lockWeight} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLockWeight(event.target.checked)} />
                  </Grid>
                  <Grid size={4}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Strength:</Typography>
                  </Grid>
                  <Grid size={2}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{player?.strength ?? basePlayer.strength}</Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Speed:</Typography>
                  </Grid>
                  <Grid size={2}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{player?.speed ?? basePlayer.speed}</Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Agility:</Typography>
                  </Grid>
                  <Grid size={2}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{player?.agility ?? basePlayer.agility}</Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Stamina:</Typography>
                  </Grid>
                  <Grid size={2}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{player?.stamina ?? basePlayer.stamina}</Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Awareness:</Typography>
                  </Grid>
                  <Grid size={2}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{player?.awareness ?? basePlayer.awareness}</Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Confidence:</Typography>
                  </Grid>
                  <Grid size={2}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{player?.confidence ?? basePlayer.confidence}</Typography>
                  </Grid>
                  <Grid size={11} sx={{ mt: 1 }}>
                    <FormControl fullWidth size='small'>
                      <InputLabel id='trait-one-label'>Trait 1</InputLabel>
                      <Select
                        labelId='trait-one-label'
                        id='trait-one-select'
                        value={trait1}
                        onChange={handleTrait1Change}
                        label='Trait 1'
                        disabled={lockTrait1}
                      >
                        {Object.entries(remTrait1Options).map(([key, value]) => (
                          <MenuItem key={key} value={key}>
                            {(value as any).name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={1}>
                    <Checkbox checked={lockTrait1} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLockTrait1(event.target.checked)} />
                  </Grid>
                  <Grid size={11} sx={{ mt: 1 }}>
                    <FormControl fullWidth size='small'>
                      <InputLabel id='trait-two-label'>Trait 2</InputLabel>
                      <Select
                        labelId='trait-two-label'
                        id='trait-two-select'
                        value={trait2}
                        onChange={handleTrait2Change}
                        label='Trait 2'
                        disabled={lockTrait2}
                      >
                        {Object.entries(remTrait2Options).map(([key, value]) => (
                          <MenuItem key={key} value={key}>
                            {(value as any).name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={1}>
                    <Checkbox checked={lockTrait2} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLockTrait2(event.target.checked)} />
                  </Grid>
                  <Grid size={11} sx={{ mt: 1 }}>
                    <FormControl fullWidth size='small'>
                      <InputLabel id='trait-three-label'>Trait 3</InputLabel>
                      <Select
                        labelId='trait-three-label'
                        id='trait-three-select'
                        value={trait3}
                        onChange={handleTrait3Change}
                        label='Trait 3'
                        disabled={lockTrait3}
                      >
                        {Object.entries(remTrait3Options).map(([key, value]) => (
                          <MenuItem key={key} value={key}>
                            {(value as any).name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={1}>
                    <Checkbox checked={lockTrait3} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLockTrait3(event.target.checked)} />
                  </Grid>
                  <Grid size={12} sx={{ my: 1 }}>
                    <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Medium Salary: {getSalary().toLocaleString()}</Typography>
                  </Grid>
                  <Grid size={11}>
                    <TextField
                      fullWidth
                      size='small'
                      label='Max Salary'
                      helperText={`${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()}`}
                      value={maxSalaryInput}
                      onChange={handleMaxSalaryChange}
                      slotProps={{
                        formHelperText: { sx: { textAlign: 'center' } },
                      }}
                    />
                  </Grid>
                </Grid>
                {build && (
                  <Stack sx={{ mb: 1 }}>
                    <Typography sx={{ color: remSkillPoints < 0 ? 'red' : '', typography: { xs: 'body2', lg: 'body1' } }}>
                      Skill Points Remaining: {remSkillPoints.toLocaleString()}
                    </Typography>
                    <Typography sx={{ color: remCapBoosts < 0 ? 'red' : '', typography: { xs: 'body2', lg: 'body1' } }}>
                      Cap Boosts Remaining: {remCapBoosts}
                    </Typography>
                  </Stack>
                )}
              </Box>
            </>
          )}
          {!isPossibleCombo && skillMins && <Typography sx={{ color: 'red', mb: 1 }}>No possible combos found</Typography>}
          {selectedPosition && skillMins && basePlayer && (
            <>
              <Stack spacing={1} sx={{ maxWidth: '350px' }}>
                <Button
                  variant='contained'
                  size='small'
                  onClick={() => handleOptimizeClick()}
                  disabled={
                    isOptimizing ||
                    +maxSalaryInput < minSalary ||
                    (!height && lockHeight) ||
                    (!weight && lockWeight) ||
                    (!trait1 && lockTrait1) ||
                    (!trait2 && lockTrait2) ||
                    (!trait3 && lockTrait3)
                  }
                  sx={{ minWidth: '350px' }}
                >
                  Optimize
                </Button>
                {build && (
                  <Button variant='contained' size='small' onClick={() => handleCopyClick()} sx={{ minWidth: '350px' }}>
                    Copy Optimized Build to Clipboard
                  </Button>
                )}
              </Stack>
              <Grid container columnSpacing={2}>
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
                          <Grid size={{ xs: 8, lg: 3 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography sx={{ typography: { xs: 'body2' } }}>{SKILL_LOOKUP[key]}</Typography>
                            {build && player && (
                              <>
                                {capBoostsSpent[key] ? (
                                  <Typography sx={{ typography: { xs: 'body2' } }}>
                                    {build[key]} - {FindMaxLevel(key, player, capBoostsSpent)} ({capBoostsSpent[key]})
                                  </Typography>
                                ) : (
                                  <Typography sx={{ typography: { xs: 'body2' } }}>
                                    {build[key]} - {FindMaxLevel(key, player, capBoostsSpent)}
                                  </Typography>
                                )}
                              </>
                            )}
                          </Grid>
                          <Grid size={{ xs: 4, lg: 3 }} sx={{ textAlign: 'flex-end' }}>
                            <TextField
                              variant='standard'
                              size='small'
                              value={skillMins[key]}
                              disabled={isOptimizing}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSkillMinChange(key, event)}
                              sx={{
                                maxWidth: { xs: '100px', sm: '100%' },
                                '& .MuiInputBase-input': {
                                  fontSize: '14px',
                                },
                              }}
                            />
                          </Grid>
                        </Fragment>
                      ))}
                  </Fragment>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </Container>
  );
}
