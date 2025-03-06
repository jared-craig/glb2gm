import { FormControlLabel, FormGroup, Stack, Switch, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AllStarTeamPlayer from './AllStarTeamPlayer';
import { useState, ChangeEvent } from 'react';

interface DefensiveAllStarTeamProps {
  tier: string;
  defenderData: any;
  fetching: boolean;
  gamesPlayed: number;
  season: string;
}

export default function DefensiveAllStarTeam({ tier, defenderData, fetching, gamesPlayed, season }: DefensiveAllStarTeamProps) {
  const [secondTeamChecked, setSecondTeamChecked] = useState<boolean>(false);

  const handleSecondTeamSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSecondTeamChecked(event.target.checked);
  };

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
        <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6'>{tier}</Typography>
          <FormGroup>
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant='body2'>1st Team</Typography>
              <FormControlLabel
                control={<Switch checked={secondTeamChecked} onChange={handleSecondTeamSwitchChange} size='small' color='default' />}
                label=''
              />
              <Typography variant='body2'>2nd Team</Typography>
            </Stack>
          </FormGroup>
        </Stack>
        <AllStarTeamPlayer player={defenderData[!secondTeamChecked ? 0 : 2]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={defenderData[!secondTeamChecked ? 1 : 3]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={defenderData[!secondTeamChecked ? 4 : 6]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={defenderData[!secondTeamChecked ? 5 : 7]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={defenderData[!secondTeamChecked ? 8 : 11]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={defenderData[!secondTeamChecked ? 9 : 12]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={defenderData[!secondTeamChecked ? 10 : 13]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={defenderData[!secondTeamChecked ? 14 : 16]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={defenderData[!secondTeamChecked ? 15 : 17]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={defenderData[!secondTeamChecked ? 18 : 20]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={defenderData[!secondTeamChecked ? 19 : 21]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
      </Stack>
    </Grid>
  );
}
