'use client';

import { Container, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import ForumIcon from '@mui/icons-material/Forum';

export default function Home() {
  return (
    <Container maxWidth='xl'>
      <Stack spacing={3}>
        <Typography variant='h5'>Welcome to GLB2GM!</Typography>
        <Typography variant='body1'>
          App is currently in <i>development</i>
        </Typography>
        <Typography variant='body1'>Data is updated nightly</Typography>
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
        <Typography variant='body1'>
          Join the GLB2 Academy Discord{' '}
          <Link href='https://discord.gg/3dNcAhxmrx' target='_blank' style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <ForumIcon />
          </Link>
        </Typography>
      </Stack>
      <Typography variant='caption' sx={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        Developed by <strong>MadKingCraig</strong>
      </Typography>
    </Container>
  );
}
