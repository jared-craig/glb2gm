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
      </Stack>
    );

  if (!player)
    return (
      <Stack>
        <Typography variant='body2'>N/A</Typography>
        <Typography variant='caption'>N/A</Typography>
      </Stack>
    );

  return (
    <Stack>
      <Typography variant='body2'>
        <Link href={`https://glb2.warriorgeneral.com/game/player/${player.id}`} target='_blank' style={{ color: 'inherit', textDecoration: 'inherit' }}>
          {player.position ?? 'QB'} {player.player_name}
        </Link>
      </Typography>
      <Typography variant='caption'>{player.team_name}</Typography>
    </Stack>
  );
}
