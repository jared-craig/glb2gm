'use client';

import { Container, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import ForumIcon from '@mui/icons-material/Forum';

export default function Home() {
  return (
    <Container maxWidth='xl'>
      <Stack spacing={0.5}>
        <Typography variant='body2'>Data is updated nightly (usually)</Typography>
        <Stack spacing={-1}>
          <Typography variant='body2'>Current Features:</Typography>
          <List>
            <ListItem disablePadding>
              <ListItemText
                primary='All Stars'
                secondary='1st and 2nd team All Stars according to the GM Rating system.'
                slotProps={{
                  primary: { sx: { fontSize: 14 } },
                  secondary: { sx: { fontSize: 12 } },
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Player Builder'
                secondary='Build your dream player from scratch.'
                slotProps={{
                  primary: { sx: { fontSize: 14 } },
                  secondary: { sx: { fontSize: 12 } },
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Player Optimizer'
                secondary='Optimize height/weight, attributes, and traits for a build.'
                slotProps={{
                  primary: { sx: { fontSize: 14 } },
                  secondary: { sx: { fontSize: 12 } },
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Player Templates'
                secondary='Looking for inspiration or are you a new player?'
                slotProps={{
                  primary: { sx: { fontSize: 14 } },
                  secondary: { sx: { fontSize: 12 } },
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Player Statistics'
                secondary="By tier and category. Filter and sort to your heart's content."
                slotProps={{
                  primary: { sx: { fontSize: 14 } },
                  secondary: { sx: { fontSize: 12 } },
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Team Rankings'
                secondary='See how your team is stacking up against the competition.'
                slotProps={{
                  primary: { sx: { fontSize: 14 } },
                  secondary: { sx: { fontSize: 12 } },
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Top Teams Report'
                secondary='View the top teams by various metrics.'
                slotProps={{
                  primary: { sx: { fontSize: 14 } },
                  secondary: { sx: { fontSize: 12 } },
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Matchup'
                secondary='Compare your team to another.'
                slotProps={{
                  primary: { sx: { fontSize: 14 } },
                  secondary: { sx: { fontSize: 12 } },
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='Team Builder'
                secondary='Construct the team of your dreams.'
                slotProps={{
                  primary: { sx: { fontSize: 14 } },
                  secondary: { sx: { fontSize: 12 } },
                }}
              />
            </ListItem>
          </List>
        </Stack>
        <Typography variant='body2'>
          Join the GLB2 Academy Discord{' '}
          <Link href='https://discord.gg/3dNcAhxmrx' target='_blank' style={{ color: 'inherit', textDecoration: 'inherit', padding: 0 }}>
            <ForumIcon />
          </Link>
        </Typography>
      </Stack>
      <Typography variant='caption' sx={{ position: 'fixed', bottom: '50px', right: '20px' }}>
        Developed by <strong>MadKingCraig</strong>
      </Typography>
      <Typography variant='caption' sx={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <Link href={'https://www.patreon.com/MadKingCraig'} target='_blank' style={{ color: 'inherit', textDecoration: 'inherit' }}>
          Support Me Through <strong>Patreon</strong>
        </Link>
      </Typography>
    </Container>
  );
}
