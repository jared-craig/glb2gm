'use client';

import { useState, useEffect } from 'react';
import { PlayerReceivingData } from '../stats/receiving/playerReceivingData';
import { PlayerPassingData } from '../stats/passing/playerPassingData';
import { PlayerRushingData } from '../stats/rushing/playerRushingData';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { getPassingGmRating, getReceivingGmRating, getRushingGmRating } from '../stats/statCalculations';
import { Stack, Typography } from '@mui/material';
import AllStarTeamPlayer from './AllStarTeamPlayer';

interface AllData {
  passData: PlayerPassingData[];
  rushData: PlayerRushingData[];
  recData: PlayerReceivingData[];
}

export default function TopTeam() {
  const [allData, setAllData] = useState<AllData>();
  const [passerData, setPasserData] = useState<(PlayerPassingData | undefined)[]>([]);
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

    let qbs: (PlayerPassingData | undefined)[] = [];

    const rookieQb = tops.find((x) => x.tier === 'Rookie');
    qbs[0] = rookieQb;
    const sophQb = tops.find((x) => x.tier === 'Sophomore');
    qbs[1] = sophQb;
    const proQb = tops.find((x) => x.tier === 'Professional');
    qbs[2] = proQb;
    const vetQb = tops.find((x) => x.tier === 'Veteran');
    qbs[3] = vetQb;
    setPasserData(qbs);

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

    const rookieFB = tops.find((x) => x.tier === 'Rookie' && x.position === 'FB');
    rookies = [...rookies, rookieFB];
    const rookieHB = tops.find((x) => x.tier === 'Rookie' && x.position === 'HB');
    rookies = [...rookies, rookieHB];
    setRusherRookieData(rookies);

    const sophFB = tops.find((x) => x.tier === 'Sophomore' && x.position === 'FB');
    sophs = [...sophs, sophFB];
    const sophHB = tops.find((x) => x.tier === 'Sophomore' && x.position === 'HB');
    sophs = [...sophs, sophHB];
    setRusherSophData(sophs);

    const proFB = tops.find((x) => x.tier === 'Professional' && x.position === 'FB');
    pros = [...pros, proFB];
    const proHB = tops.find((x) => x.tier === 'Professional' && x.position === 'HB');
    pros = [...pros, proHB];
    setRusherProData(pros);

    const vetFB = tops.find((x) => x.tier === 'Veteran' && x.position === 'FB');
    vets = [...vets, vetFB];
    const vetHB = tops.find((x) => x.tier === 'Veteran' && x.position === 'HB');
    vets = [...vets, vetHB];
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

    const rookieTE = tops.find((x) => x.tier === 'Rookie' && x.position === 'TE');
    rookies = [...rookies, rookieTE];
    const rookieWRs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'WR').slice(0, 2);
    rookies = [...rookies, ...rookieWRs];
    setReceiverRookieData(rookies);

    const sophTE = tops.find((x) => x.tier === 'Sophomore' && x.position === 'TE');
    sophs = [...sophs, sophTE];
    const sophWRs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'WR').slice(0, 2);
    sophs = [...sophs, ...sophWRs];
    setReceiverSophData(sophs);

    const proTE = tops.find((x) => x.tier === 'Professional' && x.position === 'TE');
    pros = [...pros, proTE];
    const proWRs = tops.filter((x) => x.tier === 'Professional' && x.position === 'WR').slice(0, 2);
    pros = [...pros, ...proWRs];
    setReceiverProData(pros);

    const vetTE = tops.find((x) => x.tier === 'Veteran' && x.position === 'TE');
    vets = [...vets, vetTE];
    const vetWRs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'WR').slice(0, 2);
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
        <Typography variant='h5'>All Stars</Typography>
      </Grid>
      <Grid xs={12} md={6} lg={3}>
        <Stack spacing={1}>
          <Typography variant='h6'>Rookie</Typography>
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
          <Typography variant='h6'>Sophomore</Typography>
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
          <Typography variant='h6'>Professional</Typography>
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
          <Typography variant='h6'>Veteran</Typography>
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
