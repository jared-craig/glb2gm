'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { PlayerReceivingData } from './stats/receiving/playerReceivingData';
import { PlayerPassingData } from './stats/passing/playerPassingData';
import { PlayerRushingData } from './stats/rushing/playerRushingData';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { getPassingGmRating, getReceivingGmRating, getRushingGmRating } from './stats/statCalculations';
import Link from 'next/link';

export default function Home() {
  const [passerData, setPasserData] = useState<PlayerPassingData[] | undefined[]>();
  const [rusherData, setRusherData] = useState<PlayerRushingData[] | undefined[]>();
  const [receiverData, setReceiverData] = useState<PlayerReceivingData[] | undefined[]>();

  const fetchPasserData = async () => {
    const res = await fetch('/api/passing');
    const data: PlayerPassingData[] = await res.json();
    const tops = data.sort((a: PlayerPassingData, b: PlayerPassingData) => (getPassingGmRating(a) > getPassingGmRating(b) ? -1 : 1));
    let topsInTiers: PlayerPassingData[] | undefined[] = [];
    topsInTiers[0] = tops.find((x) => x.tier === 'Rookie');
    topsInTiers[1] = tops.find((x) => x.tier === 'Sophomore');
    topsInTiers[2] = tops.find((x) => x.tier === 'Professional');
    topsInTiers[3] = tops.find((x) => x.tier === 'Veteran');
    setPasserData(topsInTiers);
  };

  const fetchRusherData = async () => {
    const res = await fetch('/api/rushing?positions=HB,FB');
    const data: PlayerRushingData[] = await res.json();
    const tops = data.sort((a: PlayerRushingData, b: PlayerRushingData) => (getRushingGmRating(a) > getRushingGmRating(b) ? -1 : 1));
    let topsInTiers: PlayerRushingData[] | undefined[] = [];
    topsInTiers[0] = tops.find((x) => x.tier === 'Rookie');
    topsInTiers[1] = tops.find((x) => x.tier === 'Sophomore');
    topsInTiers[2] = tops.find((x) => x.tier === 'Professional');
    topsInTiers[3] = tops.find((x) => x.tier === 'Veteran');
    setRusherData(topsInTiers);
  };

  const fetchReceiverData = async () => {
    const res = await fetch('/api/receiving?positions=WR,TE');
    const data: PlayerReceivingData[] = await res.json();
    const tops = data.sort((a: PlayerReceivingData, b: PlayerReceivingData) => (getReceivingGmRating(a) > getReceivingGmRating(b) ? -1 : 1));
    let topsInTiers: PlayerReceivingData[] | undefined[] = [];
    topsInTiers[0] = tops.find((x) => x.tier === 'Rookie');
    topsInTiers[1] = tops.find((x) => x.tier === 'Sophomore');
    topsInTiers[2] = tops.find((x) => x.tier === 'Professional');
    topsInTiers[3] = tops.find((x) => x.tier === 'Veteran');
    setReceiverData(topsInTiers);
  };

  useEffect(() => {
    fetchPasserData();
    fetchRusherData();
    fetchReceiverData();
  }, []);

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography variant='h6'>Welcome to GLB2GM!</Typography>
        <Typography variant='body1'>App is currently in development</Typography>
        <Typography variant='body1'>Use the menu to view stats</Typography>
        <Typography variant='caption'>
          Developed by <strong>MadKingCraig</strong>
        </Typography>
      </Stack>
      {passerData && rusherData && receiverData && (
        <Grid container rowSpacing={2}>
          <Grid xs={12} sx={{ pb: 0 }}>
            <Typography variant='h6'>Top Players</Typography>
          </Grid>
          <Grid xs={12} md={6} lg={3}>
            <Stack spacing={1}>
              <Typography>Rookie</Typography>
              <Typography>
                {passerData ? (
                  <Link
                    href={`https://glb2.warriorgeneral.com/game/player/${passerData[0]?.id}`}
                    target='_blank'
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    QB {passerData[0]?.player_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
              <Typography>
                {rusherData ? (
                  <Link
                    href={`https://glb2.warriorgeneral.com/game/player/${rusherData[0]?.id}`}
                    target='_blank'
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    {rusherData[0]?.position} {rusherData[0]?.player_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
              <Typography>
                {receiverData ? (
                  <Link
                    href={`https://glb2.warriorgeneral.com/game/player/${receiverData[0]?.id}`}
                    target='_blank'
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    {receiverData[0]?.position} {receiverData[0]?.player_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={12} md={6} lg={3}>
            <Stack spacing={1}>
              <Typography>Sophomore</Typography>
              <Typography>
                {passerData ? (
                  <Link
                    href={`https://glb2.warriorgeneral.com/game/player/${passerData[1]?.id}`}
                    target='_blank'
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    QB ${passerData[1]?.player_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
              <Typography>
                {rusherData ? (
                  <Link
                    href={`https://glb2.warriorgeneral.com/game/player/${rusherData[1]?.id}`}
                    target='_blank'
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    {rusherData[1]?.position} {rusherData[1]?.player_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
              <Typography>
                {receiverData ? (
                  <Link
                    href={`https://glb2.warriorgeneral.com/game/player/${receiverData[1]?.id}`}
                    target='_blank'
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    {receiverData[1]?.position} {receiverData[1]?.player_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={12} md={6} lg={3}>
            <Stack spacing={1}>
              <Typography>Professional</Typography>
              <Typography>
                {passerData ? (
                  <Link
                    href={`https://glb2.warriorgeneral.com/game/player/${passerData[2]?.id}`}
                    target='_blank'
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    QB ${passerData[2]?.player_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
              <Typography>
                {rusherData ? (
                  <Link
                    href={`https://glb2.warriorgeneral.com/game/player/${rusherData[2]?.id}`}
                    target='_blank'
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    {rusherData[2]?.position} {rusherData[2]?.player_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
              <Typography>
                {receiverData ? (
                  <Link
                    href={`https://glb2.warriorgeneral.com/game/player/${receiverData[2]?.id}`}
                    target='_blank'
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    {receiverData[2]?.position} {receiverData[2]?.player_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={12} md={6} lg={3}>
            <Stack spacing={1}>
              <Typography>Veteran</Typography>
              <Typography>
                {passerData ? (
                  <Link
                    href={`https://glb2.warriorgeneral.com/game/player/${passerData[3]?.id}`}
                    target='_blank'
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    QB ${passerData[3]?.player_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
              <Typography>
                {rusherData ? (
                  <Link
                    href={`https://glb2.warriorgeneral.com/game/player/${rusherData[3]?.id}`}
                    target='_blank'
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    {rusherData[3]?.position} {rusherData[3]?.player_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
              <Typography>
                {receiverData ? (
                  <Link
                    href={`https://glb2.warriorgeneral.com/game/player/${receiverData[3]?.id}`}
                    target='_blank'
                    style={{ color: 'inherit', textDecoration: 'inherit' }}
                  >
                    {receiverData[3]?.position} {receiverData[3]?.player_name}
                  </Link>
                ) : (
                  'N/A'
                )}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}
