'use client';

import { useState, useEffect } from 'react';
import { PlayerReceivingData } from '../stats/receiving/playerReceivingData';
import { PlayerPassingData } from '../stats/passing/playerPassingData';
import { PlayerRushingData } from '../stats/rushing/playerRushingData';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { getPassingGmRating, getReceivingGmRating, getRushingGmRating } from '../stats/statCalculations';
import { Stack, Typography } from '@mui/material';
import AllStarTeamPlayer from './AllStarTeamPlayer';

export default function TopTeam() {
  const [passerData, setPasserData] = useState<PlayerPassingData[]>([]);
  const [rusherRookieData, setRusherRookieData] = useState<PlayerRushingData[]>([]);
  const [rusherSophData, setRusherSophData] = useState<PlayerRushingData[]>([]);
  const [rusherProData, setRusherProData] = useState<PlayerRushingData[]>([]);
  const [rusherVetData, setRusherVetData] = useState<PlayerRushingData[]>([]);
  const [receiverRookieData, setReceiverRookieData] = useState<PlayerReceivingData[]>([]);
  const [receiverSophData, setReceiverSophData] = useState<PlayerReceivingData[]>([]);
  const [receiverProData, setReceiverProData] = useState<PlayerReceivingData[]>([]);
  const [receiverVetData, setReceiverVetData] = useState<PlayerReceivingData[]>([]);
  const [passersFetching, setPassersFetching] = useState<boolean>(true);
  const [rushersFetching, setRushersFetching] = useState<boolean>(true);
  const [receiversFetching, setReceiversFetching] = useState<boolean>(true);

  const fetchPasserData = async () => {
    const res = await fetch('/api/passing');
    const data: PlayerPassingData[] = await res.json();
    const tops = data.sort((a: PlayerPassingData, b: PlayerPassingData) => (getPassingGmRating(a) > getPassingGmRating(b) ? -1 : 1));
    let qbs: PlayerPassingData[] = [];
    const rookieQb = tops.find((x) => x.tier === 'Rookie');
    if (rookieQb) qbs[0] = rookieQb;
    const sophQb = tops.find((x) => x.tier === 'Sophomore');
    if (sophQb) qbs[1] = sophQb;
    const proQb = tops.find((x) => x.tier === 'Professional');
    if (proQb) qbs[2] = proQb;
    const vetQb = tops.find((x) => x.tier === 'Veteran');
    if (vetQb) qbs[3] = vetQb;
    setPasserData(qbs);

    setPassersFetching(false);
  };

  const fetchRusherData = async () => {
    const res = await fetch('/api/rushing?positions=HB,FB');
    const data: PlayerRushingData[] = await res.json();

    const tops = data.sort((a: PlayerRushingData, b: PlayerRushingData) => (getRushingGmRating(a) > getRushingGmRating(b) ? -1 : 1));

    let rookies: PlayerRushingData[] = [];
    let sophs: PlayerRushingData[] = [];
    let pros: PlayerRushingData[] = [];
    let vets: PlayerRushingData[] = [];

    const rookieFB = tops.find((x) => x.tier === 'Rookie' && x.position === 'FB');
    if (rookieFB) rookies = [...rookies, rookieFB];
    const rookieHB = tops.find((x) => x.tier === 'Rookie' && x.position === 'HB');
    if (rookieHB) rookies = [...rookies, rookieHB];
    setRusherRookieData(rookies);

    const sophFB = tops.find((x) => x.tier === 'Sophomore' && x.position === 'FB');
    if (sophFB) sophs = [...sophs, sophFB];
    const sophHB = tops.find((x) => x.tier === 'Sophomore' && x.position === 'HB');
    if (sophHB) sophs = [...sophs, sophHB];
    setRusherSophData(sophs);

    const proFB = tops.find((x) => x.tier === 'Professional' && x.position === 'FB');
    if (proFB) pros = [...pros, proFB];
    const proHB = tops.find((x) => x.tier === 'Professional' && x.position === 'HB');
    if (proHB) pros = [...pros, proHB];
    setRusherProData(pros);

    const vetFB = tops.find((x) => x.tier === 'Veteran' && x.position === 'FB');
    if (vetFB) vets = [...vets, vetFB];
    const vetHB = tops.find((x) => x.tier === 'Veteran' && x.position === 'HB');
    if (vetHB) vets = [...vets, vetHB];
    setRusherVetData(vets);

    setRushersFetching(false);
  };

  const fetchReceiverData = async () => {
    const res = await fetch('/api/receiving?positions=WR,TE');
    const data: PlayerReceivingData[] = await res.json();
    const tops = data.sort((a: PlayerReceivingData, b: PlayerReceivingData) => (getReceivingGmRating(a) > getReceivingGmRating(b) ? -1 : 1));

    let rookies: PlayerReceivingData[] = [];
    let sophs: PlayerReceivingData[] = [];
    let pros: PlayerReceivingData[] = [];
    let vets: PlayerReceivingData[] = [];

    const rookieTE = tops.find((x) => x.tier === 'Rookie' && x.position === 'TE');
    if (rookieTE) rookies = [...rookies, rookieTE];
    const rookieWRs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'WR').slice(0, 2);
    if (rookieWRs) rookies = [...rookies, ...rookieWRs];
    setReceiverRookieData(rookies);

    const sophTE = tops.find((x) => x.tier === 'Sophomore' && x.position === 'TE');
    if (sophTE) sophs = [...sophs, sophTE];
    const sophWRs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'WR').slice(0, 2);
    if (sophWRs) sophs = [...sophs, ...sophWRs];
    setReceiverSophData(sophs);

    const proTE = tops.find((x) => x.tier === 'Professional' && x.position === 'TE');
    if (proTE) pros = [...pros, proTE];
    const proWRs = tops.filter((x) => x.tier === 'Professional' && x.position === 'WR').slice(0, 2);
    if (proWRs) pros = [...pros, ...proWRs];
    setReceiverProData(pros);

    const vetTE = tops.find((x) => x.tier === 'Veteran' && x.position === 'TE');
    if (vetTE) vets = [...vets, vetTE];
    const vetWRs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'WR').slice(0, 2);
    if (vetWRs) vets = [...vets, ...vetWRs];
    setReceiverVetData(vets);

    setReceiversFetching(false);
  };

  useEffect(() => {
    fetchPasserData();
    fetchRusherData();
    fetchReceiverData();
  }, []);

  return (
    <Grid container rowSpacing={2} disableEqualOverflow>
      <Grid xs={12} sx={{ pb: 0 }}>
        <Typography variant='h6'>All Stars</Typography>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography>Rookie</Typography>
          <AllStarTeamPlayer player={passerData[0]} fetching={passersFetching} />
          <AllStarTeamPlayer player={rusherRookieData[0]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={rusherRookieData[1]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={receiverRookieData[0]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverRookieData[1]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverRookieData[2]} fetching={receiversFetching} />
        </Stack>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography>Sophomore</Typography>
          <AllStarTeamPlayer player={passerData[1]} fetching={passersFetching} />
          <AllStarTeamPlayer player={rusherSophData[0]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={rusherSophData[1]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={receiverSophData[0]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverSophData[1]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverSophData[2]} fetching={receiversFetching} />
        </Stack>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography>Professional</Typography>
          <AllStarTeamPlayer player={passerData[2]} fetching={passersFetching} />
          <AllStarTeamPlayer player={rusherProData[0]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={rusherProData[1]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={receiverProData[0]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverProData[1]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverProData[2]} fetching={receiversFetching} />
        </Stack>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography>Veteran</Typography>
          <AllStarTeamPlayer player={passerData[3]} fetching={passersFetching} />
          <AllStarTeamPlayer player={rusherVetData[0]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={rusherVetData[1]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={receiverVetData[0]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverVetData[1]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverVetData[2]} fetching={receiversFetching} />
        </Stack>
      </Grid>
    </Grid>
  );
}
