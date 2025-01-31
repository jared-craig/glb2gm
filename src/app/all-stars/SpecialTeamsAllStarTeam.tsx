import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AllStarTeamPlayer from './AllStarTeamPlayer';

interface SpecialTeamsAllStarTeamProps {
  tier: string;
  kickerData: any;
  punterData: any;
  returnerData: any;
  fetching: boolean;
  gamesPlayed: number;
  team: number;
}

export default function SpecialTeamsAllStarTeam({ tier, kickerData, punterData, returnerData, fetching, gamesPlayed, team }: SpecialTeamsAllStarTeamProps) {
  return (
    <Grid
      size={{
        xs: 12,
        md: 6,
        xl: 3,
      }}
      sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}
    >
      <Stack spacing={{ xs: 0.5 }}>
        <Typography variant='h6' sx={{ textAlign: 'center' }}>
          {tier}
        </Typography>
        <AllStarTeamPlayer player={kickerData[team === 1 ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={punterData[team === 1 ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={returnerData[team === 1 ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} />
      </Stack>
    </Grid>
  );
}
