import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AllStarTeamPlayer from './AllStarTeamPlayer';

interface DefensiveAllStarTeamProps {
  tier: string;
  defenderData: any;
  fetching: boolean;
  gamesPlayed: number;
  team: number;
}

export default function DefensiveAllStarTeam({ tier, defenderData, fetching, gamesPlayed, team }: DefensiveAllStarTeamProps) {
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
        <AllStarTeamPlayer player={defenderData[team === 1 ? 0 : 2]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={defenderData[team === 1 ? 1 : 3]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={defenderData[team === 1 ? 4 : 6]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={defenderData[team === 1 ? 5 : 7]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={defenderData[team === 1 ? 8 : 11]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={defenderData[team === 1 ? 9 : 12]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={defenderData[team === 1 ? 10 : 13]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={defenderData[team === 1 ? 14 : 16]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={defenderData[team === 1 ? 15 : 17]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={defenderData[team === 1 ? 18 : 20]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={defenderData[team === 1 ? 19 : 21]} fetching={fetching} gamesPlayed={gamesPlayed} />
      </Stack>
    </Grid>
  );
}
