'use client';

import { Container, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import ForumIcon from '@mui/icons-material/Forum';

export default function Home() {
  return (
    <Container maxWidth='xl'>
      <Stack spacing={1}>
        <Typography variant='body1'>
          App is currently in <i>development</i>
        </Typography>
        <Typography variant='body1'>Data is updated nightly (usually)</Typography>
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
              <ListItemText primary='Player Optimizer' secondary='Optimize height/weight, attributes, and traits for a build.'></ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary='Player Statistics' secondary="By tier and category. Filter and sort to your heart's content."></ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary='Team Rankings' secondary='See how your team is stacking up against the competition.'></ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary='Matchup' secondary='Compare your team to another.'></ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary='Team Builder' secondary='Construct the team of your dreams.'></ListItemText>
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
