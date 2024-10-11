'use client';

import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
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
import { SKILL_LOOKUP, TRAIT_LOOKUP } from '../player-builder/lookups';
import { Player } from '../player-builder/player';
import { getPossibleAttributes, getPossibleTraits } from '../player-builder/possibilities';
import { Template, getTemplates } from '../player-builder/templates';
import { SALARIES } from '../team-builder/salaries';

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
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [player, setPlayer] = useState<Player>();
  const [remSkillPoints, setRemSkillPoints] = useState<number>(210000);
  const [remCapBoosts, setRemCapBoosts] = useState<number>(7);
  const [skillMins, setSkillMins] = useState<{ [key: string]: number }>();
  const [attCombos, setAttCombos] = useState<any>();
  const [traitCombos, setTraitCombos] = useState<any>();
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [possibleCombosCount, setPossibleCombosCount] = useState<number>(0);

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

  const buildPlayer = async () => {
    if (!filteredData.skills || !player || !skillMins || !attCombos || !traitCombos) return;

    const reqBody: any = {
      attCombos,
      traitCombos,
      player,
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
    if (!res.ok || res.status === 500) {
      console.error('failed to optimize player');
    } else {
      const result = await res.json();
      if (result.best) {
        console.log(result.best);
        setPlayer((old: any) => ({
          ...old,
          trait1: result.best[0],
          trait2: result.best[1],
          trait3: result.best[2],
          strength: result.best.strength,
          speed: result.best.speed,
          agility: result.best.agility,
          stamina: result.best.stamina,
          awareness: result.best.awareness,
          confidence: result.best.confidence,
        }));
        setPossibleCombosCount(result.possibleCombos);
        setRemSkillPoints(result.best.sp);
        setRemCapBoosts(result.best.cbr);
      } else {
        setPlayer(undefined);
      }
    }

    setIsOptimizing(false);
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
    setSkillMins(getSkillMins(selectedPosition, selectedTemplate));
    setTraitCombos(getPossibleTraits(filteredData.traits, true, true));
  }, [selectedTemplate]);

  useEffect(() => {
    if (!skillMins) return;
    setIsOptimizing(true);
    buildPlayer();
  }, [skillMins]);

  return (
    <Container maxWidth='xl'>
      <Grid container rowGap={1} sx={{ mb: 2 }}>
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
                  <MenuItem value={'OT'}>OT</MenuItem>
                  <MenuItem value={'DT'}>DT</MenuItem>
                  <MenuItem value={'DE'}>DE</MenuItem>
                  <MenuItem value={'K'}>K</MenuItem>
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
      {isOptimizing && <LinearProgress />}
      {!isOptimizing && selectedPosition && selectedTemplate && skillMins && !player && <Typography>No possible combinations to achieve skills</Typography>}
      {!isOptimizing && selectedPosition && selectedTemplate && skillMins && player && (
        <>
          <Box sx={{ width: 350, mb: 2 }}>
            <Typography sx={{ mb: 1 }}>
              Working Combos: {possibleCombosCount} out of {attCombos.length * traitCombos.length}
            </Typography>
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
            <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>Medium Salary: {getSalary(player).toLocaleString()}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained'>Optimize</Button>
          </Box>
          <Grid container rowGap={{ xs: 0.5 }} columnSpacing={2}>
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
                      <Grid size={{ xs: 6, lg: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>{SKILL_LOOKUP[key]}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, lg: 3 }}>
                        <Stack direction='row' spacing={1} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                          <TextField size='small' defaultValue={skillMins[key]} />
                        </Stack>
                      </Grid>
                    </Fragment>
                  ))}
              </Fragment>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}
