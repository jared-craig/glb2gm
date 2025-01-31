import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AllStarTeamPlayer from './AllStarTeamPlayer';

interface OffensiveAllStarTeamProps {
  tier: string;
  passerData: any;
  rusherData: any;
  receiverData: any;
  blockerData: any;
  fetching: boolean;
  gamesPlayed: number;
  team: number;
}

export default function OffensiveAllStarTeam({
  tier,
  passerData,
  rusherData,
  receiverData,
  blockerData,
  fetching,
  gamesPlayed,
  team,
}: OffensiveAllStarTeamProps) {
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
        <AllStarTeamPlayer player={passerData[team === 1 ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={rusherData[team === 1 ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={rusherData[team === 1 ? 2 : 3]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={receiverData[team === 1 ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={receiverData[team === 1 ? 2 : 4]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={receiverData[team === 1 ? 3 : 5]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={blockerData[team === 1 ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={blockerData[team === 1 ? 2 : 4]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={blockerData[team === 1 ? 3 : 5]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={blockerData[team === 1 ? 6 : 8]} fetching={fetching} gamesPlayed={gamesPlayed} />
        <AllStarTeamPlayer player={blockerData[team === 1 ? 7 : 9]} fetching={fetching} gamesPlayed={gamesPlayed} />
      </Stack>
    </Grid>
  );
}
