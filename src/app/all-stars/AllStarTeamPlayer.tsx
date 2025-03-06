import { Skeleton, Stack, Typography } from '@mui/material';
import Link from 'next/link';

interface AllStarTeamPlayerProps {
  player: any;
  fetching: boolean;
  gamesPlayed: number;
  season: string;
}

const THRESHOLDS = {
  QB_RUSH_YARDS_RATIO: 0.1,
  QB_RUSH_TDS: 1,
  SACKS: 1,
  HURRIES: 1,
  INTS: 0.25,
  PDS: 0.5,
  KLS: 0.5,
  TACKLES: 2,
  STICK_RATIO: 0.66,
  BTK_RATIO: 0.66,
  FIFTY_PLUS: 1,
  TB_RATIO: 0.33,
};

export default function AllStarTeamPlayer({ player, fetching, gamesPlayed, season }: AllStarTeamPlayerProps) {
  if (fetching)
    return (
      <Stack>
        <Typography sx={{ typography: { xs: 'body2' } }}>
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
        <Typography sx={{ typography: { xs: 'body2' } }}>
          <strong>N/A</strong>
        </Typography>
        <Typography variant='caption'>N/A</Typography>
        <Typography variant='caption'>N/A</Typography>
      </Stack>
    );

  let stats: any = {};
  switch (player?.position) {
    case 'QB':
      stats = { YD: player.yards, YPG: (+player.yards / +player.games_played).toFixed(1), TD: player.touchdowns, INT: player.interceptions };
      if (+player.rush_yards / +player.yards >= THRESHOLDS.QB_RUSH_YARDS_RATIO) stats.RUSHYD = player.rush_yards;
      if (player.rush_touchdowns >= THRESHOLDS.QB_RUSH_TDS) stats.RUSHTD = player.rush_touchdowns;
      break;
    case 'FB':
    case 'HB':
      stats = {
        YD: +player.yards + +(player.rec_yards ?? 0),
        YPG: +((+player.yards + +(player.rec_yards ?? 0)) / +player.games_played).toFixed(1),
        YPC: player.average,
        TD: +player.touchdowns + +(player.rec_touchdowns ?? 0),
      };
      if (+player.broken_tackles / +player.rushes >= THRESHOLDS.BTK_RATIO) stats.BTK = player.broken_tackles;
      break;
    case 'TE':
    case 'WR':
      stats = { YD: player.yards, YPG: (+player.yards / +player.games_played).toFixed(1), TD: player.touchdowns };
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
      if (player.sacks >= THRESHOLDS.SACKS * gamesPlayed) stats.SACK = player.sacks;
      if (player.hurries >= THRESHOLDS.HURRIES * gamesPlayed) stats.HRY = player.hurries;
      if (player.interceptions >= THRESHOLDS.INTS * gamesPlayed) stats.INT = player.interceptions;
      if (player.passes_defended >= THRESHOLDS.PDS * gamesPlayed) stats.PD = player.passes_defended;
      if (player.passes_knocked_loose >= THRESHOLDS.KLS * gamesPlayed) stats.KL = player.passes_knocked_loose;
      if (player.tackles >= THRESHOLDS.TACKLES * gamesPlayed) stats.TK = player.tackles;
      if (player.tackles >= THRESHOLDS.TACKLES * gamesPlayed && +player.sticks / +player.tackles >= THRESHOLDS.STICK_RATIO) stats.STICK = player.sticks;
      break;
    case 'K':
      stats = {
        FGM: player.fg_made,
        FGA: player.fg_attempts,
        'FG%': ((+player.fg_made / +player.fg_attempts) * 100.0).toFixed(1),
      };
      if (player.fifty_plus_made >= THRESHOLDS.FIFTY_PLUS) stats['50+'] = player.fifty_plus_made;
      const touchbackPercent = +player.touchbacks / +player.kickoffs;
      if (touchbackPercent >= THRESHOLDS.TB_RATIO) stats['TB%'] = (touchbackPercent * 100.0).toFixed(1);
      break;
    case 'P':
      stats.AVG = player.average;
      stats.HANG = player.hangtime;
      stats['INS 5'] = +player.inside_five + +player.coffins;
      stats['INS 10'] = player.inside_ten;
      break;
    case 'RET':
      stats['KR AVG'] = player.kr_average;
      stats['KR TD'] = player.kr_touchdowns;
      stats['PR AVG'] = player.pr_average;
      stats['PR TD'] = player.pr_touchdowns;
      break;
  }

  return (
    <Stack>
      <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
        <Typography color='secondary' sx={{ typography: { xs: 'body2' } }}>
          <Link href={`/player-details/${player.player_id}/${season}`} target='_blank' rel='noopener' style={{ color: 'inherit', textDecoration: 'inherit' }}>
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
