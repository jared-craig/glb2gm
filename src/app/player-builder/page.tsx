'use client';

import { Stack, Typography } from '@mui/material';
import AttributeWeight from './AttributeWeight';

export default function PlayerBuilder() {
  return (
    <Stack sx={{ alignItems: 'center' }}>
      <Typography variant='h4'>Player Builder</Typography>
      <Typography variant='h6'>Position: WR</Typography>
      <AttributeWeight />
      {/* <BestCombo /> */}
    </Stack>
  );
}
