'use client';

import {
  Box,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { ABILITY_LOOKUP, ABILITY_MEDAL_LOOKUP, SKILL_LOOKUP, TRAIT_LOOKUP } from '../players/lookups';
import { getTemplates, Template } from './templates';
import { SALARIES } from '../players/salaries';
import StarIcon from '@mui/icons-material/Star';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function PlayerTemplates() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryPosition = searchParams.get('position');

  const [allTraits, setAllTraits] = useState<Record<string, any>>();
  const [selectedPosition, setSelectedPosition] = useState<string>(queryPosition || '');
  const [templates, setTemplates] = useState<Template[]>();
  const [endGamesChecked, setEndGamesChecked] = useState<Record<string, boolean>>({});

  const handlePositionChange = (event: SelectChangeEvent<string>) => {
    const position = event.target.value;
    setSelectedPosition(position);
    setTemplates(getTemplates(position));
    const params = new URLSearchParams();
    params.set('position', position);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEndGameSwitchChange = (templateName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setEndGamesChecked((prev) => ({ ...prev, [templateName]: event.target.checked }));
  };

  const fetchData = async () => {
    const traitsRes = await fetch('/api/glb2-data/traits');
    const traitsData = await traitsRes.json();
    setAllTraits(traitsData);
  };

  const getSalary = (player: any): number => {
    if (!allTraits) return 0;
    let salary = SALARIES[player.position] * 0.52 * ((2 + Math.pow(25, 1.135)) / 2);
    let modifier = 0;

    const t1 = allTraits[player.trait1].salary_modifier;
    const t2 = allTraits[player.trait2].salary_modifier;
    const t3 = allTraits[player.trait3].salary_modifier;
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (queryPosition) {
      setTemplates(getTemplates(queryPosition));
    }
  }, [queryPosition]);

  return (
    <Container maxWidth={false}>
      {allTraits && (
        <Grid container sx={{ mb: 1 }} spacing={1} columnSpacing={4}>
          <Grid size={12}>
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
                  {/*<MenuItem value={'SS'}>SS</MenuItem> */}
                  <MenuItem value={'FS'}>FS</MenuItem>
                  <MenuItem value={'C'}>C</MenuItem>
                  <MenuItem value={'G'}>G</MenuItem>
                  <MenuItem value={'OT'}>OT</MenuItem>
                  <MenuItem value={'K'}>K</MenuItem>
                  <MenuItem value={'P'}>P</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          {templates &&
            templates.map((temp) => (
              <Grid key={temp.templateName} container size={{ xs: 12, md: 6, lg: 4, xl: 3 }} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Grid size={12}>
                  <Stack direction='row' sx={{ justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ typography: { xs: 'body1' }, display: 'flex', alignItems: 'center' }}>
                      {(temp.trait1.includes('superstar') || temp.trait1.includes('prodigy')) && (
                        <StarIcon fontSize='small' sx={{ mr: 0.5, color: temp.trait1.includes('superstar') ? 'gold' : 'silver' }} />
                      )}
                      {temp.templateName}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={endGamesChecked[temp.templateName] ?? true}
                          onChange={handleEndGameSwitchChange(temp.templateName)}
                          size='small'
                          color='default'
                        />
                      }
                      label='End Build'
                      sx={{ mr: 0 }}
                    />
                  </Stack>
                  <Grid size={12}>
                    <Stack direction='row' sx={{ width: '100%', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ typography: { xs: 'body2' } }}>
                        Height: {Math.floor(temp.height / 12)}&apos; {temp.height % 12}&apos;&apos;
                      </Typography>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Weight: {temp.weight} lbs.</Typography>
                    </Stack>
                    <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Strength: {temp.strength}</Typography>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Speed: {temp.speed}</Typography>
                    </Stack>
                    <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Agility: {temp.agility}</Typography>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Stamina: {temp.stamina}</Typography>
                    </Stack>
                    <Stack direction='row' sx={{ justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Awareness: {temp.awareness}</Typography>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Confidence: {temp.confidence}</Typography>
                    </Stack>
                    <Stack sx={{ mb: 1 }}>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Medium Salary: {getSalary(temp).toLocaleString()}</Typography>
                    </Stack>
                    <Stack sx={{ mb: 1 }}>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Trait 1: {TRAIT_LOOKUP[temp.trait1]}</Typography>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Trait 2: {TRAIT_LOOKUP[temp.trait2]}</Typography>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Trait 3: {TRAIT_LOOKUP[temp.trait3]}</Typography>
                    </Stack>
                    <Grid container sx={{ mb: 1 }}>
                      {Object.entries(temp.abilities).map(([build, buildValue]) => (
                        <Fragment key={build}>
                          {Object.entries(buildValue)
                            .filter(() => (temp.templateName in endGamesChecked && !endGamesChecked[temp.templateName] ? build === 'start' : build === 'end'))
                            .map(([ability, abilityValue]) => (
                              <Grid key={`${build}-${ability}-${abilityValue}`} size={12}>
                                <Typography color={ABILITY_MEDAL_LOOKUP[abilityValue].color} sx={{ typography: { xs: 'body2' } }}>
                                  {ABILITY_LOOKUP[ability]}
                                </Typography>
                              </Grid>
                            ))}
                        </Fragment>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    {Object.entries(temp.skills).map(([build, buildValue]) => (
                      <Fragment key={build}>
                        {Object.entries(buildValue)
                          .filter(
                            ([, skillValue]) =>
                              (temp.templateName in endGamesChecked && !endGamesChecked[temp.templateName] ? build === 'start' : build === 'end') &&
                              skillValue > 0
                          )
                          .map(([skill, skillValue]) => (
                            <Fragment key={`${build}-${skill}-${skillValue}`}>
                              <Grid size={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.25 }}>
                                <Typography sx={{ typography: { xs: 'body2' } }}>{SKILL_LOOKUP[skill]}</Typography>
                                <Typography sx={{ typography: { xs: 'body2' } }}>{skillValue}</Typography>
                              </Grid>
                              <Divider />
                            </Fragment>
                          ))}
                      </Fragment>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            ))}
        </Grid>
      )}
    </Container>
  );
}
