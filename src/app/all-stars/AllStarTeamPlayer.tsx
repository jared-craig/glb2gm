import { Skeleton, Stack, Typography } from '@mui/material';
import Link from 'next/link';

interface AllStarTeamPlayerProps {
  player: any;
  fetching: boolean;
}

const THRESHOLDS = {
  QB_RUSH_YARDS_RATIO: 0.1,
  QB_RUSH_TDS: 1,
  SACKS: 2,
  HURRIES: 2,
  INTS: 1,
  PDS: 5,
  KLS: 5,
  TACKLES: 10,
  STICK_RATIO: 0.75,
};

export default function AllStarTeamPlayer({ player, fetching }: AllStarTeamPlayerProps) {
  if (fetching)
    return (
      <Stack>
        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>
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
        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>
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
      if (+player.rush_yards / +player.yards >= THRESHOLDS.QB_RUSH_YARDS_RATIO) stats.RUSHYD = player.rush_yards;
      if (player.rush_touchdowns >= THRESHOLDS.QB_RUSH_TDS) stats.RUSHTD = player.rush_touchdowns;
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
      if (player.sacks >= THRESHOLDS.SACKS) stats.SACK = player.sacks;
      if (player.hurries >= THRESHOLDS.HURRIES) stats.HRY = player.hurries;
      if (player.interceptions >= THRESHOLDS.INTS) stats.INT = player.interceptions;
      if (player.passes_defended >= THRESHOLDS.PDS) stats.PD = player.passes_defended;
      if (player.passes_knocked_loose >= THRESHOLDS.KLS) stats.KL = player.passes_knocked_loose;
      if (player.tackles >= THRESHOLDS.TACKLES) stats.TK = player.tackles;
      if (player.tackles >= THRESHOLDS.TACKLES && +player.sticks / +player.tackles >= THRESHOLDS.STICK_RATIO) stats.STICK = player.sticks;
      break;
  }

  return (
    <Stack>
      <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
        <Typography sx={{ typography: { xs: 'body2', lg: 'body1' } }}>
          <Link href={`https://glb2.warriorgeneral.com/game/player/${player.id}`} target='_blank' style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <strong>{player.position}</strong> {player.player_name}
          </Link>
        </Typography>
      </Stack>
      <Typography variant='caption' sx={{ pl: 1 }}>
        {player.team_name}
      </Typography>
      <Stack direction='row' spacing={1} sx={{ pl: 2 }}>
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
    </Stack>
  );
}
