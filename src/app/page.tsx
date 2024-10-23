'use client';

import { Container, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import ForumIcon from '@mui/icons-material/Forum';
import PaidIcon from '@mui/icons-material/Paid';

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
              <ListItemText
                primary='All Stars'
                secondary='1st and 2nd team All Stars according to the GM Rating system.'
                secondaryTypographyProps={{
                  fontSize: 12,
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Player Builder'
                secondary='Build your dream player from scratch.'
                secondaryTypographyProps={{
                  fontSize: 12,
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Player Optimizer'
                secondary='Optimize height/weight, attributes, and traits for a build.'
                secondaryTypographyProps={{
                  fontSize: 12,
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Player Statistics'
                secondary="By tier and category. Filter and sort to your heart's content."
                secondaryTypographyProps={{
                  fontSize: 12,
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Team Rankings'
                secondary='See how your team is stacking up against the competition.'
                secondaryTypographyProps={{
                  fontSize: 12,
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Matchup'
                secondary='Compare your team to another.'
                secondaryTypographyProps={{
                  fontSize: 12,
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Team Builder'
                secondary='Construct the team of your dreams.'
                secondaryTypographyProps={{
                  fontSize: 12,
                }}
              />
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
      <Typography variant='caption' sx={{ position: 'fixed', bottom: '50px', right: '20px' }}>
        Developed by <strong>MadKingCraig</strong>
      </Typography>
    </Container>
  );
}
