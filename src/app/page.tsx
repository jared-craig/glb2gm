'use client';

import { List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

export default function Home() {
  return (
    <Stack spacing={2}>
      <Stack spacing={3}>
        <Typography variant='h6'>Welcome to GLB2GM!</Typography>
        <Typography variant='body1'>
          App is currently in <i>development</i>
        </Typography>
        <Stack spacing={-1}>
          <Typography variant='body1'>Current Features:</Typography>
          <List>
            <ListItem disablePadding>
              <ListItemText primary='All Stars' secondary='1st and 2nd team All Stars according to the GM Rating system.'></ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary='Player Builder' secondary="Select a position, template, and what's important to you."></ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary='Player Statistics' secondary="By tier and category. Filter and sort to your heart's content."></ListItemText>
            </ListItem>
          </List>
        </Stack>
        <Typography variant='caption'>
          Developed by <strong>MadKingCraig</strong>
        </Typography>
      </Stack>
    </Stack>
  );
}
