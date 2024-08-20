import { Skeleton, Stack, Typography } from '@mui/material';
import Link from 'next/link';

interface AllStarTeamPlayerProps {
  player: any;
  fetching: boolean;
}

export default function AllStarTeamPlayer({ player, fetching }: AllStarTeamPlayerProps) {
  if (fetching)
    return (
      <Stack>
        <Typography variant='body2'>
          <Skeleton width={'80%'} />
        </Typography>
        <Typography variant='caption'>
          <Skeleton width={'80%'} />
        </Typography>
        <Typography variant='caption'>
          <Skeleton width={'80%'} />
        </Typography>
      </Stack>
    );

  if (!player)
    return (
      <Stack>
        <Typography variant='body2'>
          <strong>N/A</strong>
        </Typography>
        <Typography variant='caption'>N/A</Typography>
        <Typography variant='caption'>N/A</Typography>
      </Stack>
    );

  let stats: any = {};
  switch (player?.position) {
    case 'QB':
      stats = { YD: player.yards, TD: player.touchdowns, INT: player.interceptions };
      if (+player.rush_yards / +player.yards >= 0.1) stats.RUSHYD = player.rush_yards;
      if (player.rush_touchdowns > 5) stats.RUSHTD = player.rush_touchdowns;
      break;
    case 'FB':
    case 'HB':
      stats = {
        YD: +player.yards + +(player.rec_yards ?? 0),
        YPC: player.average,
        TD: +player.touchdowns + +(player.rec_touchdowns ?? 0),
        BTK: player.broken_tackles,
      };
      break;
    case 'TE':
    case 'WR':
      stats = { YD: player.yards, TD: player.touchdowns };
      break;
    case 'C':
    case 'G':
    case 'OT':
      stats = { CAKE: player.pancakes, RCAKED: player.reverse_pancaked, HALW: player.hurries_allowed, SALW: player.sacks_allowed };
      break;
    case 'DT':
    case 'DE':
    case 'LB':
    case 'CB':
    case 'SS':
    case 'FS':
      if (player.sacks >= 10) stats.SACK = player.sacks;
      if (player.hurries >= 10) stats.HRY = player.hurries;
      if (player.interceptions >= 5) stats.INT = player.interceptions;
      if (player.passes_defended >= 10) stats.PD = player.passes_defended;
      if (player.passes_knocked_loose >= 10) stats.KL = player.passes_knocked_loose;
      if (player.tackles >= 100) stats.TK = player.tackles;
      if (player.tackles >= 100 && +player.sticks / +player.tackles >= 0.75) stats.STICK = player.sticks;
      break;
  }

  return (
    <Stack>
      <Typography variant='body2'>
        <Link href={`https://glb2.warriorgeneral.com/game/player/${player.id}`} target='_blank' style={{ color: 'inherit', textDecoration: 'inherit' }}>
          <strong>
            {player.position ?? 'QB'} {player.player_name}
          </strong>
        </Link>
      </Typography>
      <Stack direction='row' spacing={1}>
        {stats ? (
          Object.entries(stats).map(([key, value]: any) => (
            <Typography variant='caption' key={key}>
              {key}: {value}
            </Typography>
          ))
        ) : (
          <Typography variant='caption'>N/A</Typography>
        )}
      </Stack>
      <Typography variant='caption'>{player.team_name}</Typography>
    </Stack>
  );
}
