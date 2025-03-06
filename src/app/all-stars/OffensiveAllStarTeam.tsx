import { FormControlLabel, FormGroup, Stack, Switch, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AllStarTeamPlayer from './AllStarTeamPlayer';
import { ChangeEvent, useState } from 'react';

interface OffensiveAllStarTeamProps {
  tier: string;
  passerData: any;
  rusherData: any;
  receiverData: any;
  blockerData: any;
  fetching: boolean;
  gamesPlayed: number;
  season: string;
}

export default function OffensiveAllStarTeam({
  tier,
  passerData,
  rusherData,
  receiverData,
  blockerData,
  fetching,
  gamesPlayed,
  season,
}: OffensiveAllStarTeamProps) {
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
        <AllStarTeamPlayer player={passerData[!secondTeamChecked ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={rusherData[!secondTeamChecked ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={rusherData[!secondTeamChecked ? 2 : 3]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={receiverData[!secondTeamChecked ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={receiverData[!secondTeamChecked ? 2 : 4]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={receiverData[!secondTeamChecked ? 3 : 5]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={blockerData[!secondTeamChecked ? 0 : 1]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={blockerData[!secondTeamChecked ? 2 : 4]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={blockerData[!secondTeamChecked ? 3 : 5]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={blockerData[!secondTeamChecked ? 6 : 8]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
        <AllStarTeamPlayer player={blockerData[!secondTeamChecked ? 7 : 9]} fetching={fetching} gamesPlayed={gamesPlayed} season={season} />
      </Stack>
    </Grid>
  );
}
