'use client';

import { Box, Container, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Fragment, useState } from 'react';
import { SKILL_LOOKUP, TRAIT_LOOKUP } from '../players/lookups';
import { getTemplates, Template } from './templates';

export default function PlayerTemplates() {
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [templates, setTemplates] = useState<Template[]>();

  const handlePositionChange = (event: SelectChangeEvent) => {
    setSelectedPosition(event.target.value);
    setTemplates(getTemplates(event.target.value));
  };

  return (
    <Container maxWidth={false}>
      <Grid container sx={{ mb: 1 }} spacing={1} columnSpacing={4}>
        <Grid size={12}>
          <Box width={350} my={1}>
            <FormControl fullWidth sx={{ minWidth: 150, mr: { xs: 0, lg: 4 } }} size='small'>
              <InputLabel id='position-select-label'>Position</InputLabel>
              <Select labelId='position-select-label' id='position-select' value={selectedPosition} label='Position' onChange={handlePositionChange}>
                {/* <MenuItem value={'QB'}>QB</MenuItem> */}
                <MenuItem value={'HB'}>HB</MenuItem>
                {/* <MenuItem value={'FB'}>FB</MenuItem>
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
                <MenuItem value={'P'}>P</MenuItem> */}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        {templates &&
          templates.map((temp) => (
            <Fragment key={temp.templateName}>
              <Grid size={12}>
                <Typography sx={{ typography: { xs: 'body1', xl: 'h6' } }}>{temp.templateName}</Typography>
              </Grid>
              <Grid size={{ xs: 12, xl: 3 }}>
                <Box width={350}>
                  <Stack direction='row' sx={{ width: '100%', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ typography: { xs: 'body2', xl: 'body1' } }}>
                      Height: {Math.floor(temp.height / 12)}&apos; {temp.height % 12}&apos;&apos;
                    </Typography>
                    <Typography sx={{ typography: { xs: 'body2', xl: 'body1' } }}>Weight: {temp.weight} lbs.</Typography>
                  </Stack>
                  <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
                    <Typography sx={{ typography: { xs: 'body2', xl: 'body1' } }}>Strength: {temp.strength}</Typography>
                    <Typography sx={{ typography: { xs: 'body2', xl: 'body1' } }}>Speed: {temp.speed}</Typography>
                  </Stack>
                  <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
                    <Typography sx={{ typography: { xs: 'body2', xl: 'body1' } }}>Agility: {temp.agility}</Typography>
                    <Typography sx={{ typography: { xs: 'body2', xl: 'body1' } }}>Stamina: {temp.stamina}</Typography>
                  </Stack>
                  <Stack direction='row' sx={{ justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ typography: { xs: 'body2', xl: 'body1' } }}>Awareness: {temp.awareness}</Typography>
                    <Typography sx={{ typography: { xs: 'body2', xl: 'body1' } }}>Confidence: {temp.confidence}</Typography>
                  </Stack>
                  <Stack sx={{ mb: 1 }}>
                    <Typography sx={{ typography: { xs: 'body2', xl: 'body1' } }}>Trait 1: {TRAIT_LOOKUP[temp.trait1]}</Typography>
                    <Typography sx={{ typography: { xs: 'body2', xl: 'body1' } }}>Trait 2: {TRAIT_LOOKUP[temp.trait2]}</Typography>
                    <Typography sx={{ typography: { xs: 'body2', xl: 'body1' } }}>Trait 3: {TRAIT_LOOKUP[temp.trait3]}</Typography>
                  </Stack>
                </Box>
              </Grid>
              <Grid container size={{ xs: 12, xl: 9 }} columnSpacing={4} sx={{ mb: 1 }}>
                {Object.entries(temp.skills).map(([key, value]) => (
                  <Grid key={key} size={{ xs: 8, sm: 4, lg: 3 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ typography: { xs: 'body2' } }}>{SKILL_LOOKUP[key]}</Typography>
                    <Typography sx={{ typography: { xs: 'body2', xl: 'body1' } }}>{value <= 0 ? '-' : value}</Typography>
                  </Grid>
                ))}
              </Grid>
              <Divider />
            </Fragment>
          ))}
      </Grid>
    </Container>
  );
}