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
  const [tier, setTier] = useState<string>('Veteran');
  const tierOptions = ['Rookie', 'Sophomore', 'Professional', 'Veteran'];
  const [season, setSeason] = useState<string>(process.env.CURRENT_SEASON ?? '0');
  const seasonOptions = ['80', '81'];

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
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
      {value === 0 && (
        <PlayerPassingStats tier={tier} tierFilter={setTier} tierOptions={tierOptions} season={season} seasonFilter={setSeason} seasonOptions={seasonOptions} />
      )}
      {value === 1 && (
        <PlayerRushingStats tier={tier} tierFilter={setTier} tierOptions={tierOptions} season={season} seasonFilter={setSeason} seasonOptions={seasonOptions} />
      )}
      {value === 2 && (
        <PlayerReceivingStats
          tier={tier}
          tierFilter={setTier}
          tierOptions={tierOptions}
          season={season}
          seasonFilter={setSeason}
          seasonOptions={seasonOptions}
        />
      )}
      {value === 3 && (
        <PlayerDefensiveStats
          tier={tier}
          tierFilter={setTier}
          tierOptions={tierOptions}
          season={season}
          seasonFilter={setSeason}
          seasonOptions={seasonOptions}
        />
      )}
      {value === 4 && (
        <PlayerBlockingStats
          tier={tier}
          tierFilter={setTier}
          tierOptions={tierOptions}
          season={season}
          seasonFilter={setSeason}
          seasonOptions={seasonOptions}
        />
      )}
      {value === 5 && (
        <PlayerKickingStats tier={tier} tierFilter={setTier} tierOptions={tierOptions} season={season} seasonFilter={setSeason} seasonOptions={seasonOptions} />
      )}
      {value === 6 && (
        <PlayerPuntingStats tier={tier} tierFilter={setTier} tierOptions={tierOptions} season={season} seasonFilter={setSeason} seasonOptions={seasonOptions} />
      )}
      {value === 7 && (
        <PlayerReturningStats
          tier={tier}
          tierFilter={setTier}
          tierOptions={tierOptions}
          season={season}
          seasonFilter={setSeason}
          seasonOptions={seasonOptions}
        />
      )}
    </Box>
  );
}
