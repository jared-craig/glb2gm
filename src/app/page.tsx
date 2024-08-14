'use client';

import { Stack, Typography } from '@mui/material';

export default function Home() {
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography variant='h6'>Welcome to GLB2GM!</Typography>
        <Typography variant='body1'>App is currently in development</Typography>
        <Typography variant='body1'>Use the menu to view stats</Typography>
        <Typography variant='caption'>
          Developed by <strong>MadKingCraig</strong>
        </Typography>
      </Stack>
    </Stack>
  );
}
