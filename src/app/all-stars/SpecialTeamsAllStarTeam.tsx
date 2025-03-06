import { FormControlLabel, FormGroup, Stack, Switch, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AllStarTeamPlayer from './AllStarTeamPlayer';
import { useState, ChangeEvent } from 'react';

interface SpecialTeamsAllStarTeamProps {
  tier: string;
  kickerData: any;
  punterData: any;
  returnerData: any;
  fetching: boolean;
  gamesPlayed: number;
  season: string;
}

export default function SpecialTeamsAllStarTeam({ tier, kickerData, punterData, returnerData, fetching, gamesPlayed, season }: SpecialTeamsAllStarTeamProps) {
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
        <AllStarTeamPlayer player={kickerData[!secondTeamChecked ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={punterData[!secondTeamChecked ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={returnerData[!secondTeamChecked ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
      </Stack>
    </Grid>
  );
}
