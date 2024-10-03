'use client';

import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import PlayerPassingStats from './passing/PlayerPassingStats';
import PlayerRushingStats from './rushing/PlayerRushingStats';
import PlayerReceivingStats from './receiving/PlayerReceivingStats';
import PlayerDefensiveStats from './defensive/PlayerDefensiveStats';
import PlayerBlockingStats from './blocking/PlayerBlockingStats';
import PlayerKickingStats from './kicking/PlayerKickingStats';
import PlayerPuntingStats from './punting/PlayerPuntingStats';
import PlayerReturningStats from './returning/PlayerReturningStats';

export default function Stats() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ mt: 0 }}>
      <Tabs value={value} onChange={handleChange} variant='scrollable' scrollButtons={true} aria-label='stats tabs' allowScrollButtonsMobile>
        <Tab label='Passing' />
        <Tab label='Rushing' />
        <Tab label='Receiving' />
        <Tab label='Defensive' />
        <Tab label='Blocking' />
        <Tab label='Kicking' />
        <Tab label='Punting' />
        <Tab label='Returning' />
      </Tabs>
      {value === 0 && <PlayerPassingStats />}
      {value === 1 && <PlayerRushingStats />}
      {value === 2 && <PlayerReceivingStats />}
      {value === 3 && <PlayerDefensiveStats />}
      {value === 4 && <PlayerBlockingStats />}
      {value === 5 && <PlayerKickingStats />}
      {value === 6 && <PlayerPuntingStats />}
      {value === 7 && <PlayerReturningStats />}
    </Box>
  );
}
