'use client';

import { Box, Container, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Fragment, useEffect, useState } from 'react';
import { ABILITY_LOOKUP, ABILITY_MEDAL_LOOKUP, SKILL_LOOKUP, TRAIT_LOOKUP } from '../players/lookups';
import { getTemplates, Template } from './templates';
import { SALARIES } from '../players/salaries';

export default function PlayerTemplates() {
  const [allTraits, setAllTraits] = useState<any>();
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [templates, setTemplates] = useState<Template[]>();

  const handlePositionChange = (event: SelectChangeEvent) => {
    setSelectedPosition(event.target.value);
    setTemplates(getTemplates(event.target.value));
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
                  {/* <MenuItem value={'FB'}>FB</MenuItem> */}
                  {/*<MenuItem value={'TE'}>TE</MenuItem> */}
                  {/*<MenuItem value={'WR'}>WR</MenuItem> */}
                  {/*<MenuItem value={'DT'}>DT</MenuItem> */}
                  {/*<MenuItem value={'DE'}>DE</MenuItem> */}
                  {/*<MenuItem value={'LB'}>LB</MenuItem> */}
                  {/*<MenuItem value={'CB'}>CB</MenuItem> */}
                  {/*<MenuItem value={'SS'}>SS</MenuItem> */}
                  {/*<MenuItem value={'FS'}>FS</MenuItem> */}
                  {/*<MenuItem value={'C'}>C</MenuItem> */}
                  {/*<MenuItem value={'G'}>G</MenuItem> */}
                  {/*<MenuItem value={'OT'}>OT</MenuItem> */}
                  {/*<MenuItem value={'K'}>K</MenuItem> */}
                  {/*<MenuItem value={'P'}>P</MenuItem> */}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          {templates &&
            templates.map((temp) => (
              <Fragment key={temp.templateName}>
                <Grid size={12}>
                  <Typography sx={{ typography: { xs: 'body1' } }}>{temp.templateName}</Typography>
                </Grid>
                <Grid size={{ xs: 12, xl: 3 }}>
                  <Box width={350}>
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
                      <Typography sx={{ typography: { xs: 'body2' } }}>Trait 1: {TRAIT_LOOKUP[temp.trait1]}</Typography>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Trait 2: {TRAIT_LOOKUP[temp.trait2]}</Typography>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Trait 3: {TRAIT_LOOKUP[temp.trait3]}</Typography>
                    </Stack>
                    <Stack sx={{ mb: 1 }}>
                      <Typography sx={{ typography: { xs: 'body2' } }}>Medium Salary: {getSalary(temp).toLocaleString()}</Typography>
                    </Stack>
                    <Grid container sx={{ mb: 1 }}>
                      {Object.entries(temp.abilities).map(([key, value]) => (
                        <Grid size={6}>
                          <Typography color={ABILITY_MEDAL_LOOKUP[value].color} sx={{ typography: { xs: 'body2' } }}>
                            {ABILITY_LOOKUP[key]}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
                <Grid container size={{ xs: 12, xl: 9 }} rowSpacing={1} columnSpacing={4} sx={{ alignContent: 'flex-start', mb: 1 }}>
                  {Object.entries(temp.skills)
                    .filter(([key, value]) => value > 0)
                    .map(([key, value]) => (
                      <Grid key={key} size={{ xs: 6, sm: 4, lg: 3 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ typography: { xs: 'body2' } }}>{SKILL_LOOKUP[key]}</Typography>
                        <Typography sx={{ typography: { xs: 'body2' } }}>{value}</Typography>
                      </Grid>
                    ))}
                </Grid>
                <Grid size={12}>
                  <Divider />
                </Grid>
              </Fragment>
            ))}
        </Grid>
      )}
    </Container>
  );
}
