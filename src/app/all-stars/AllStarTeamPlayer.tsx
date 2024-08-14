import { Skeleton, Typography } from '@mui/material';
import Link from 'next/link';

interface AllStarTeamPlayerProps {
  player: any;
  fetching: boolean;
}

export default function AllStarTeamPlayer({ player, fetching }: AllStarTeamPlayerProps) {
  if (fetching)
    return (
      <Typography variant='body2'>
        <Skeleton width={'80%'} />
      </Typography>
    );
  else if (!player) return <Typography variant='body2'>N/A</Typography>;

  return (
    <Typography variant='body2'>
      <Link href={`https://glb2.warriorgeneral.com/game/player/${player.id}`} target='_blank' style={{ color: 'inherit', textDecoration: 'inherit' }}>
        {player.position ?? 'QB'} {player.player_name}
      </Link>
    </Typography>
  );
}
