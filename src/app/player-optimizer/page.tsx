'use client';

import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Fragment, useEffect, useState } from 'react';
import { getSkillMins } from '../player-optimizer/skillMins';
import { SKILL_LOOKUP, TRAIT_LOOKUP } from '../players/lookups';
import { Player } from '../players/player';
import { getPossibleAttributes, getPossibleHeightsWeights, getPossibleTraits } from '../players/possibilities';
import { SALARIES } from '../team-builder/salaries';
import { getBasePlayers } from '../players/basePlayers';
import LinearProgressWithLabel from '../components/LinearProgressWithLabel';

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
  const [player, setPlayer] = useState<Player>();
  const [remSkillPoints, setRemSkillPoints] = useState<number>(0);
  const [remCapBoosts, setRemCapBoosts] = useState<number>(0);
  const [capBoostsSpent, setCapBoostsSpent] = useState<{ [key: string]: number }>({});
  const [skillMins, setSkillMins] = useState<{ [key: string]: number }>();
  const [attCombos, setAttCombos] = useState<any>();
  const [traitCombos, setTraitCombos] = useState<any>();
  const [heightWeightCombos, setHeightWeightCombos] = useState<any>();
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizeProgress, setOptimizeProgress] = useState(0);
  const [optimizeBuffer, setOptimizeBuffer] = useState(10);
  const [isPossibleCombo, setIsPossibleCombo] = useState<boolean>(true);
  const [isSuperstar, setIsSuperstar] = useState(true);
  const [isProdigy, setIsProdigy] = useState(false);
  const [build, setBuild] = useState<any>();

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

    const traitsEntries = Object.entries(data.traits).filter(([key, value]) => !(value as any).position_exclusions.includes(selectedPosition));

    const newTraits = Object.fromEntries(traitsEntries);

    setFilteredData({ skills: newSkills, traits: newTraits });
  };

  const buildPlayer = async (optimize: string, updatedPlayer: Player): Promise<Player> => {
    if (!filteredData.skills || !player || !skillMins || !attCombos || !traitCombos || !heightWeightCombos)
      return {
        position: selectedPosition,
        trait1: '',
        trait2: '',
        trait3: '',
        height: 0,
        weight: 0,
        strength: 0,
        speed: 0,
        agility: 0,
        stamina: 0,
        awareness: 0,
        confidence: 0,
      };

    let hw: any[] = [];
    let at: any[] = [];
    let tr: any[] = [];

    switch (optimize) {
      case 'hw':
        hw = heightWeightCombos;
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
        hw = [{ height: updatedPlayer.height, weight: updatedPlayer.weight }];
        at = attCombos;
        tr = [[updatedPlayer.trait1, updatedPlayer.trait2, updatedPlayer.trait3]];
        break;
      case 'tr':
        hw = [{ height: updatedPlayer.height, weight: updatedPlayer.weight }];
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
        tr = isSuperstar
          ? traitCombos.filter((x: any) => x.every((y: string) => !y.includes('prodigy')))
          : isProdigy
            ? traitCombos.filter((x: any) => x.every((y: string) => !y.includes('superstar')))
            : traitCombos.filter((x: any) => x.every((y: string) => !y.includes('superstar') && !y.includes('prodigy')));
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
    let newPlayer = {
      position: selectedPosition,
      trait1: '',
      trait2: '',
      trait3: '',
      height: 0,
      weight: 0,
      strength: 0,
      speed: 0,
      agility: 0,
      stamina: 0,
      awareness: 0,
      confidence: 0,
    };
    if (!res.ok || res.status === 500) {
      console.error('failed to optimize player');
    } else {
      const result = await res.json();
      if (result.success) {
        newPlayer = {
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
        setBuild(result.best.build);
        setPlayer(newPlayer);
        setIsPossibleCombo(true);
        setRemSkillPoints(result.best.sp);
        setRemCapBoosts(result.best.cbr);
        setCapBoostsSpent(result.best.cbs);
      } else {
        newPlayer = {
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
        setBuild(result.bestFailing.build);
        setPlayer(newPlayer);
        setIsPossibleCombo(false);
        setRemSkillPoints(result.bestFailing.sp);
        setRemCapBoosts(result.bestFailing.cbr);
        setCapBoostsSpent(result.bestFailing.cbs);
      }
    }

    return newPlayer;
  };

  const getSalary = (player: any): number => {
    if (!filteredData.traits || !player.trait1 || !player.trait2 || !player.trait3) return 0;
    let salary = SALARIES[player.position] * 0.52 * ((2 + Math.pow(25, 1.135)) / 2);
    let modifier = 0;
    let contractModifier = 1;

    const t1 = filteredData.traits[player.trait1].salary_modifier;
    const t2 = filteredData.traits[player.trait2].salary_modifier;
    const t3 = filteredData.traits[player.trait3].salary_modifier;
    modifier = +t1! + +t2! + +t3!;

    salary *= 1 + modifier;

    if (salary > 5000000) {
      salary = 25000 * Math.ceil(salary / 25000);
    } else if (salary > 1000000) {
      salary = 10000 * Math.ceil(salary / 10000);
    } else {
      salary = 5000 * Math.ceil(salary / 5000);
    }

    return (salary *= contractModifier);
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

  const handlePositionChange = (event: SelectChangeEvent) => {
    setSelectedPosition(event.target.value as string);
    setIsPossibleCombo(true);
  };

  const handleOptimizeClick = async () => {
    if (!skillMins || !player) return;

    setIsOptimizing(true);
    setIsPossibleCombo(true);
    setBuild(undefined);

    let newPlayer = { ...player };

    if (!isSuperstar && newPlayer.trait1.includes('superstar')) {
      if (isProdigy) newPlayer.trait1 = 'prodigy';
      else newPlayer.trait1 = 'scholar';
    } else if (!isSuperstar && newPlayer.trait2.includes('superstar')) {
      if (isProdigy) newPlayer.trait2 = 'prodigy';
      else newPlayer.trait2 = 'scholar';
    } else if (!isSuperstar && newPlayer.trait3.includes('superstar')) {
      if (isProdigy) newPlayer.trait3 = 'prodigy';
      else newPlayer.trait3 = 'scholar';
    }

    setOptimizeBuffer(10);
    newPlayer = await buildPlayer('at', newPlayer);
    setOptimizeBuffer(13);
    setOptimizeProgress(10);
    newPlayer = await buildPlayer('tr', newPlayer);
    setOptimizeBuffer(15);
    setOptimizeProgress(13);
    newPlayer = await buildPlayer('hw', newPlayer);
    setOptimizeBuffer(25);
    setOptimizeProgress(15);

    newPlayer = await buildPlayer('at', newPlayer);
    setOptimizeBuffer(27);
    setOptimizeProgress(25);
    newPlayer = await buildPlayer('hw', newPlayer);
    setOptimizeBuffer(30);
    setOptimizeProgress(27);
    newPlayer = await buildPlayer('tr', newPlayer);
    setOptimizeBuffer(32);
    setOptimizeProgress(30);

    newPlayer = await buildPlayer('hw', newPlayer);
    setOptimizeBuffer(42);
    setOptimizeProgress(32);
    newPlayer = await buildPlayer('at', newPlayer);
    setOptimizeBuffer(45);
    setOptimizeProgress(42);
    newPlayer = await buildPlayer('tr', newPlayer);
    setOptimizeBuffer(47);
    setOptimizeProgress(45);

    newPlayer = await buildPlayer('hw', newPlayer);
    setOptimizeBuffer(50);
    setOptimizeProgress(47);
    newPlayer = await buildPlayer('tr', newPlayer);
    setOptimizeBuffer(60);
    setOptimizeProgress(50);
    newPlayer = await buildPlayer('at', newPlayer);
    setOptimizeBuffer(63);
    setOptimizeProgress(60);

    newPlayer = await buildPlayer('tr', newPlayer);
    setOptimizeBuffer(65);
    setOptimizeProgress(63);
    newPlayer = await buildPlayer('hw', newPlayer);
    setOptimizeBuffer(75);
    setOptimizeProgress(65);
    newPlayer = await buildPlayer('at', newPlayer);
    setOptimizeBuffer(78);
    setOptimizeProgress(75);

    newPlayer = await buildPlayer('tr', newPlayer);
    setOptimizeBuffer(95);
    setOptimizeProgress(78);
    newPlayer = await buildPlayer('at', newPlayer);
    setOptimizeBuffer(100);
    setOptimizeProgress(95);
    newPlayer = await buildPlayer('hw', newPlayer);
    setOptimizeProgress(100);

    setIsOptimizing(false);
    setOptimizeProgress(0);
    setOptimizeBuffer(10);
  };

  const handleSkillMinChange = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setSkillMins((prev) => ({
      ...prev,
      [key]: +event.target.value,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortSkills();
    setPlayer(getBasePlayers(selectedPosition));
    setRemSkillPoints(0);
    setRemCapBoosts(0);
    setBuild(undefined);
  }, [selectedPosition]);

  useEffect(() => {
    if (!selectedPosition || !filteredData) return;

    setSkillMins(getSkillMins(selectedPosition));
    setTraitCombos(getPossibleTraits(filteredData.traits));
    setHeightWeightCombos(getPossibleHeightsWeights(selectedPosition));
  }, [filteredData]);

  return (
    <Container maxWidth='xl' sx={{ mb: 2 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ typography: { xs: 'body1', lg: 'h6' } }}>Player Optimizer is a work in progress...</Typography>
      </Box>
      {isOptimizing ? (
        <LinearProgressWithLabel variant='buffer' value={optimizeProgress} valueBuffer={optimizeBuffer} />
      ) : (
        <>
          <Grid container rowGap={1} sx={{ mb: 2 }}>
            {(!data.skills || !data.traits) && <LinearProgress />}
            {data.skills && data.traits && (
              <Box width={350} mt={1}>
                <Stack direction='row' sx={{ justifyContent: 'space-between', mb: 1 }}>
                  <FormControl sx={{ minWidth: { xs: '100%', sm: 350 } }} size='small'>
                    <InputLabel id='position-select-label'>Position</InputLabel>
                    <Select labelId='position-select-label' id='position-select' value={selectedPosition} label='Position' onChange={handlePositionChange}>
                      <MenuItem value={'QB'}>QB</MenuItem>
                      <MenuItem value={'HB'}>HB</MenuItem>
                      <MenuItem value={'FB'}>FB</MenuItem>
                      <MenuItem value={'TE'}>TE</MenuItem>
                      <MenuItem value={'WR'}>WR</MenuItem>
                      <MenuItem value={'DT'}>DT</MenuItem>
                      <MenuItem value={'LB'}>LB</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Box>
            )}
          </Grid>
          {selectedPosition && skillMins && player && (
            <>
              <Box sx={{ width: 350 }}>
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
                <Stack sx={{ mb: 1 }}>
                  <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Trait 1: {TRAIT_LOOKUP[player.trait1]}</Typography>
                  <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Trait 2: {TRAIT_LOOKUP[player.trait2]}</Typography>
                  <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Trait 3: {TRAIT_LOOKUP[player.trait3]}</Typography>
                </Stack>
                <Stack sx={{ mb: 1 }}>
                  <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Medium Salary: {getSalary(player).toLocaleString()}</Typography>
                </Stack>
                <Stack>
                  <Typography sx={{ color: remSkillPoints < 0 ? 'red' : '', typography: { xs: 'body2', lg: 'body1' } }}>
                    Skill Points Remaining: {remSkillPoints.toLocaleString()}
                  </Typography>
                  <Typography sx={{ color: remCapBoosts < 0 ? 'red' : '', typography: { xs: 'body2', lg: 'body1' } }}>
                    Cap Boosts Remaining: {remCapBoosts}
                  </Typography>
                </Stack>
              </Box>
            </>
          )}
          {!isPossibleCombo && skillMins && <Typography sx={{ color: 'red' }}>No possible combinations to achieve skills</Typography>}
          {selectedPosition && skillMins && player && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Stack>
                  <FormGroup sx={{ flexDirection: 'row' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSuperstar && !isProdigy}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsSuperstar(event.target.checked)}
                          disabled={isProdigy}
                        />
                      }
                      label='Superstar'
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isProdigy && !isSuperstar}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsProdigy(event.target.checked)}
                          disabled={isSuperstar}
                        />
                      }
                      label='Prodigy'
                    />
                  </FormGroup>
                  <Button variant='contained' size='small' onClick={() => handleOptimizeClick()} disabled={isOptimizing}>
                    Optimize
                  </Button>
                </Stack>
              </Box>
              <Grid container rowGap={{ xs: 0.5 }} columnSpacing={2}>
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
                            <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{SKILL_LOOKUP[key]}</Typography>
                            {build && (
                              <>
                                {capBoostsSpent[key] ? (
                                  <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>
                                    {build[key]} - {FindMaxLevel(key, player, capBoostsSpent)} ({capBoostsSpent[key]})
                                  </Typography>
                                ) : (
                                  <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>
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
                              type='number'
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSkillMinChange(key, event)}
                              sx={{ maxWidth: { xs: '100px', sm: '100%' } }}
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
