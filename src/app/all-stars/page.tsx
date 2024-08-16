'use client';

import { useState, useEffect } from 'react';
import { PlayerReceivingData } from '../stats/receiving/playerReceivingData';
import { PlayerPassingData } from '../stats/passing/playerPassingData';
import { PlayerRushingData } from '../stats/rushing/playerRushingData';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { getPassingGmRating, getReceivingGmRating, getRushingGmRating } from '../stats/statCalculations';
import { Divider, Stack, Typography } from '@mui/material';
import AllStarTeamPlayer from './AllStarTeamPlayer';

interface AllData {
  passData: PlayerPassingData[];
  rushData: PlayerRushingData[];
  recData: PlayerReceivingData[];
}

export default function TopTeam() {
  const [allData, setAllData] = useState<AllData>();
  const [passerRookieData, setPasserRookieData] = useState<(PlayerPassingData | undefined)[]>([]);
  const [passerSophData, setPasserSophData] = useState<(PlayerPassingData | undefined)[]>([]);
  const [passerProData, setPasserProData] = useState<(PlayerPassingData | undefined)[]>([]);
  const [passerVetData, setPasserVetData] = useState<(PlayerPassingData | undefined)[]>([]);
  const [rusherRookieData, setRusherRookieData] = useState<(PlayerRushingData | undefined)[]>([]);
  const [rusherSophData, setRusherSophData] = useState<(PlayerRushingData | undefined)[]>([]);
  const [rusherProData, setRusherProData] = useState<(PlayerRushingData | undefined)[]>([]);
  const [rusherVetData, setRusherVetData] = useState<(PlayerRushingData | undefined)[]>([]);
  const [receiverRookieData, setReceiverRookieData] = useState<(PlayerReceivingData | undefined)[]>([]);
  const [receiverSophData, setReceiverSophData] = useState<(PlayerReceivingData | undefined)[]>([]);
  const [receiverProData, setReceiverProData] = useState<(PlayerReceivingData | undefined)[]>([]);
  const [receiverVetData, setReceiverVetData] = useState<(PlayerReceivingData | undefined)[]>([]);
  const [passersFetching, setPassersFetching] = useState<boolean>(true);
  const [rushersFetching, setRushersFetching] = useState<boolean>(true);
  const [receiversFetching, setReceiversFetching] = useState<boolean>(true);

  const matchById = (array1: any[], array2: any[], statToPull: string, propToAdd: string) => {
    let baseArray = JSON.parse(JSON.stringify(array1));
    let addArray = JSON.parse(JSON.stringify(array2));
    for (const item1 of baseArray) {
      for (const item2 of addArray) {
        if (item1.id === item2.id) {
          item1[propToAdd] = +item2[statToPull];
        }
      }
    }
    return baseArray;
  };

  const fetchData = async () => {
    const passRes = await fetch('/api/passing');
    const passData: PlayerPassingData[] = await passRes.json();
    const rushRes = await fetch('/api/rushing');
    const rushData: PlayerRushingData[] = await rushRes.json();
    const recRes = await fetch('/api/receiving');
    const recData: PlayerReceivingData[] = await recRes.json();

    setAllData({ passData, rushData, recData });
  };

  const fetchPasserData = async () => {
    if (!allData) return;

    const allDataWithRushYards = matchById(allData.passData, allData.rushData, 'yards', 'rush_yards');
    const allDataWithRushYardsAndTd = matchById(allDataWithRushYards, allData.rushData, 'touchdowns', 'rush_touchdowns');

    const tops: PlayerPassingData[] = allDataWithRushYardsAndTd.sort((a: PlayerPassingData, b: PlayerPassingData) =>
      getPassingGmRating(a) > getPassingGmRating(b) ? -1 : 1
    );

    const rookieQBs = tops.filter((x) => x.tier === 'Rookie').slice(0, 2);
    setPasserRookieData(rookieQBs);
    const sophQBs = tops.filter((x) => x.tier === 'Sophomore').slice(0, 2);
    setPasserSophData(sophQBs);
    const proQBs = tops.filter((x) => x.tier === 'Professional').slice(0, 2);
    setPasserProData(proQBs);
    const vetQBs = tops.filter((x) => x.tier === 'Veteran').slice(0, 2);
    setPasserVetData(vetQBs);

    setTimeout(() => setPassersFetching(false), 1000);
  };

  const fetchRusherData = async () => {
    if (!allData) return;

    const allDataWithRecYards = matchById(allData.rushData, allData.recData, 'yards', 'rec_yards');
    const allDataWithRecYardsAndTd = matchById(allDataWithRecYards, allData.recData, 'touchdowns', 'rec_touchdowns');

    const tops: PlayerRushingData[] = allDataWithRecYardsAndTd.sort((a: PlayerRushingData, b: PlayerRushingData) =>
      getRushingGmRating(a) > getRushingGmRating(b) ? -1 : 1
    );

    let rookies: (PlayerRushingData | undefined)[] = [];
    let sophs: (PlayerRushingData | undefined)[] = [];
    let pros: (PlayerRushingData | undefined)[] = [];
    let vets: (PlayerRushingData | undefined)[] = [];

    console.log(tops.filter((x) => x.tier === 'Rookie' && x.position === 'FB'));

    const rookieFBs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'FB').slice(0, 2);
    rookies = [...rookies, ...rookieFBs];
    const rookieHBs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'HB').slice(0, 2);
    rookies = [...rookies, ...rookieHBs];
    setRusherRookieData(rookies);

    const sophFBs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'FB').slice(0, 2);
    sophs = [...sophs, ...sophFBs];
    const sophHBs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'HB').slice(0, 2);
    sophs = [...sophs, ...sophHBs];
    setRusherSophData(sophs);

    const proFBs = tops.filter((x) => x.tier === 'Professional' && x.position === 'FB').slice(0, 2);
    pros = [...pros, ...proFBs];
    const proHBs = tops.filter((x) => x.tier === 'Professional' && x.position === 'HB').slice(0, 2);
    pros = [...pros, ...proHBs];
    setRusherProData(pros);

    const vetFBs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'FB').slice(0, 2);
    vets = [...vets, ...vetFBs];
    const vetHBs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'HB').slice(0, 2);
    vets = [...vets, ...vetHBs];
    setRusherVetData(vets);

    setTimeout(() => setRushersFetching(false), 1000);
  };

  const fetchReceiverData = async () => {
    if (!allData) return;

    const tops = allData.recData.sort((a: PlayerReceivingData, b: PlayerReceivingData) => (getReceivingGmRating(a) > getReceivingGmRating(b) ? -1 : 1));

    let rookies: (PlayerReceivingData | undefined)[] = [];
    let sophs: (PlayerReceivingData | undefined)[] = [];
    let pros: (PlayerReceivingData | undefined)[] = [];
    let vets: (PlayerReceivingData | undefined)[] = [];

    const rookieTEs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'TE').slice(0, 2);
    rookies = [...rookies, ...rookieTEs];
    const rookieWRs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'WR').slice(0, 4);
    rookies = [...rookies, ...rookieWRs];
    setReceiverRookieData(rookies);

    const sophTEs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'TE').slice(0, 2);
    sophs = [...sophs, ...sophTEs];
    const sophWRs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'WR').slice(0, 4);
    sophs = [...sophs, ...sophWRs];
    setReceiverSophData(sophs);

    const proTEs = tops.filter((x) => x.tier === 'Professional' && x.position === 'TE').slice(0, 2);
    pros = [...pros, ...proTEs];
    const proWRs = tops.filter((x) => x.tier === 'Professional' && x.position === 'WR').slice(0, 4);
    pros = [...pros, ...proWRs];
    setReceiverProData(pros);

    const vetTEs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'TE').slice(0, 2);
    vets = [...vets, ...vetTEs];
    const vetWRs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'WR').slice(0, 4);
    vets = [...vets, ...vetWRs];
    setReceiverVetData(vets);

    setTimeout(() => setReceiversFetching(false), 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchPasserData();
    fetchRusherData();
    fetchReceiverData();
  }, [allData]);

  return (
    <Grid container rowSpacing={2} disableEqualOverflow>
      <Grid xs={12} sx={{ pb: 0 }}>
        <Divider variant='middle'>
          <Typography variant='h5'>1st Team All Stars</Typography>
        </Divider>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography variant='h6'>Rookie</Typography>
          <AllStarTeamPlayer player={passerRookieData[0]} fetching={passersFetching} />
          <AllStarTeamPlayer player={rusherRookieData[0]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={rusherRookieData[2]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={receiverRookieData[0]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverRookieData[2]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverRookieData[3]} fetching={receiversFetching} />
        </Stack>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography variant='h6'>Sophomore</Typography>
          <AllStarTeamPlayer player={passerSophData[0]} fetching={passersFetching} />
          <AllStarTeamPlayer player={rusherSophData[0]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={rusherSophData[2]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={receiverSophData[0]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverSophData[2]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverSophData[3]} fetching={receiversFetching} />
        </Stack>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography variant='h6'>Professional</Typography>
          <AllStarTeamPlayer player={passerProData[0]} fetching={passersFetching} />
          <AllStarTeamPlayer player={rusherProData[0]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={rusherProData[2]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={receiverProData[0]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverProData[2]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverProData[3]} fetching={receiversFetching} />
        </Stack>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography variant='h6'>Veteran</Typography>
          <AllStarTeamPlayer player={passerVetData[0]} fetching={passersFetching} />
          <AllStarTeamPlayer player={rusherVetData[0]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={rusherVetData[2]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={receiverVetData[0]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverVetData[2]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverVetData[3]} fetching={receiversFetching} />
        </Stack>
      </Grid>
      <Grid xs={12} sx={{ pb: 0 }}>
        <Divider variant='middle'>
          <Typography variant='h5'>2nd Team All Stars</Typography>
        </Divider>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography variant='h6'>Rookie</Typography>
          <AllStarTeamPlayer player={passerRookieData[1]} fetching={passersFetching} />
          <AllStarTeamPlayer player={rusherRookieData[1]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={rusherRookieData[3]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={receiverRookieData[1]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverRookieData[4]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverRookieData[5]} fetching={receiversFetching} />
        </Stack>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography variant='h6'>Sophomore</Typography>
          <AllStarTeamPlayer player={passerSophData[1]} fetching={passersFetching} />
          <AllStarTeamPlayer player={rusherSophData[1]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={rusherSophData[3]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={receiverSophData[1]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverSophData[4]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverSophData[5]} fetching={receiversFetching} />
        </Stack>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography variant='h6'>Professional</Typography>
          <AllStarTeamPlayer player={passerProData[1]} fetching={passersFetching} />
          <AllStarTeamPlayer player={rusherProData[1]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={rusherProData[3]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={receiverProData[1]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverProData[4]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverProData[5]} fetching={receiversFetching} />
        </Stack>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography variant='h6'>Veteran</Typography>
          <AllStarTeamPlayer player={passerVetData[1]} fetching={passersFetching} />
          <AllStarTeamPlayer player={rusherVetData[1]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={rusherVetData[3]} fetching={rushersFetching} />
          <AllStarTeamPlayer player={receiverVetData[1]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverVetData[4]} fetching={receiversFetching} />
          <AllStarTeamPlayer player={receiverVetData[5]} fetching={receiversFetching} />
        </Stack>
      </Grid>
    </Grid>
  );
}
