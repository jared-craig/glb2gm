'use client';

import { useState, useEffect } from 'react';
import { PlayerReceivingData } from '../stats/receiving/playerReceivingData';
import { PlayerPassingData } from '../stats/passing/playerPassingData';
import { PlayerRushingData } from '../stats/rushing/playerRushingData';
import Grid from '@mui/material/Grid2';
import { getBlockingGmRating, getDefensiveGmRating, getPassingGmRating, getReceivingGmRating, getRushingGmRating } from '../stats/statCalculations';
import { Divider, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import AllStarTeamPlayer from './AllStarTeamPlayer';
import { PlayerDefensiveData } from '../stats/defensive/playerDefensiveData';
import { PlayerBlockingData } from '../stats/blocking/playerBlockingData';

interface AllData {
  passData: PlayerPassingData[];
  rushData: PlayerRushingData[];
  recData: PlayerReceivingData[];
  defData: PlayerDefensiveData[];
  blockData: PlayerBlockingData[];
}

export default function TopTeam() {
  const [teamChoice, setTeamChoice] = useState<string>('offense');
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
  const [defenderRookieData, setDefenderRookieData] = useState<(PlayerDefensiveData | undefined)[]>([]);
  const [defenderSophData, setDefenderSophData] = useState<(PlayerDefensiveData | undefined)[]>([]);
  const [defenderProData, setDefenderProData] = useState<(PlayerDefensiveData | undefined)[]>([]);
  const [defenderVetData, setDefenderVetData] = useState<(PlayerDefensiveData | undefined)[]>([]);
  const [blockerRookieData, setBlockerRookieData] = useState<(PlayerBlockingData | undefined)[]>([]);
  const [blockerSophData, setBlockerSophData] = useState<(PlayerBlockingData | undefined)[]>([]);
  const [blockerProData, setBlockerProData] = useState<(PlayerBlockingData | undefined)[]>([]);
  const [blockerVetData, setBlockerVetData] = useState<(PlayerBlockingData | undefined)[]>([]);
  const [passersFetching, setPassersFetching] = useState<boolean>(true);
  const [rushersFetching, setRushersFetching] = useState<boolean>(true);
  const [receiversFetching, setReceiversFetching] = useState<boolean>(true);
  const [defendersFetching, setDefendersFetching] = useState<boolean>(true);
  const [blockersFetching, setBlockersFetching] = useState<boolean>(true);

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
    const defRes = await fetch('/api/defensive');
    const defData: PlayerDefensiveData[] = await defRes.json();
    const blockRes = await fetch('/api/blocking');
    const blockData: PlayerBlockingData[] = await blockRes.json();

    setAllData({ passData, rushData, recData, defData, blockData });
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

  const fetchDefensiveData = async () => {
    if (!allData) return;

    const tops = allData.defData.sort((a: PlayerDefensiveData, b: PlayerDefensiveData) => (getDefensiveGmRating(a) > getDefensiveGmRating(b) ? -1 : 1));

    let rookies: (PlayerDefensiveData | undefined)[] = [];
    let sophs: (PlayerDefensiveData | undefined)[] = [];
    let pros: (PlayerDefensiveData | undefined)[] = [];
    let vets: (PlayerDefensiveData | undefined)[] = [];

    const rookieDTs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'DT').slice(0, 4);
    rookies = [...rookies, ...rookieDTs];
    const rookieDEs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'DE').slice(0, 4);
    rookies = [...rookies, ...rookieDEs];
    const rookieLBs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'LB').slice(0, 6);
    rookies = [...rookies, ...rookieLBs];
    const rookieCBs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'CB').slice(0, 4);
    rookies = [...rookies, ...rookieCBs];
    const rookieSs = tops.filter((x) => x.tier === 'Rookie' && (x.position === 'SS' || x.position === 'FS')).slice(0, 4);
    rookies = [...rookies, ...rookieSs];
    setDefenderRookieData(rookies);

    const sophDTs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'DT').slice(0, 4);
    sophs = [...sophs, ...sophDTs];
    const sophDEs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'DE').slice(0, 4);
    sophs = [...sophs, ...sophDEs];
    const sophLBs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'LB').slice(0, 6);
    sophs = [...sophs, ...sophLBs];
    const sophCBs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'CB').slice(0, 4);
    sophs = [...sophs, ...sophCBs];
    const sophSs = tops.filter((x) => x.tier === 'Sophomore' && (x.position === 'SS' || x.position === 'FS')).slice(0, 4);
    sophs = [...sophs, ...sophSs];
    setDefenderSophData(sophs);

    const proDTs = tops.filter((x) => x.tier === 'Professional' && x.position === 'DT').slice(0, 4);
    pros = [...pros, ...proDTs];
    const proDEs = tops.filter((x) => x.tier === 'Professional' && x.position === 'DE').slice(0, 4);
    pros = [...pros, ...proDEs];
    const proLBs = tops.filter((x) => x.tier === 'Professional' && x.position === 'LB').slice(0, 6);
    pros = [...pros, ...proLBs];
    const proCBs = tops.filter((x) => x.tier === 'Professional' && x.position === 'CB').slice(0, 4);
    pros = [...pros, ...proCBs];
    const proSs = tops.filter((x) => x.tier === 'Professional' && (x.position === 'SS' || x.position === 'FS')).slice(0, 4);
    pros = [...pros, ...proSs];
    setDefenderProData(pros);

    const vetDTs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'DT').slice(0, 4);
    vets = [...vets, ...vetDTs];
    const vetDEs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'DE').slice(0, 4);
    vets = [...vets, ...vetDEs];
    const vetLBs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'LB').slice(0, 6);
    vets = [...vets, ...vetLBs];
    const vetCBs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'CB').slice(0, 4);
    vets = [...vets, ...vetCBs];
    const vetSs = tops.filter((x) => x.tier === 'Veteran' && (x.position === 'SS' || x.position === 'FS')).slice(0, 4);
    vets = [...vets, ...vetSs];
    setDefenderVetData(vets);

    setTimeout(() => setDefendersFetching(false), 1000);
  };

  const fetchBlockingData = async () => {
    if (!allData) return;

    const tops = allData.blockData.sort((a: PlayerBlockingData, b: PlayerBlockingData) => (getBlockingGmRating(a) > getBlockingGmRating(b) ? -1 : 1));

    let rookies: (PlayerBlockingData | undefined)[] = [];
    let sophs: (PlayerBlockingData | undefined)[] = [];
    let pros: (PlayerBlockingData | undefined)[] = [];
    let vets: (PlayerBlockingData | undefined)[] = [];

    const rookieCs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'C').slice(0, 2);
    rookies = [...rookies, ...rookieCs];
    const rookieGs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'G').slice(0, 4);
    rookies = [...rookies, ...rookieGs];
    const rookieOTs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'OT').slice(0, 4);
    rookies = [...rookies, ...rookieOTs];
    setBlockerRookieData(rookies);

    const sophCs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'C').slice(0, 2);
    sophs = [...sophs, ...sophCs];
    const sophGs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'G').slice(0, 4);
    sophs = [...sophs, ...sophGs];
    const sophOTs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'OT').slice(0, 4);
    sophs = [...sophs, ...sophOTs];
    setBlockerSophData(sophs);

    const proCs = tops.filter((x) => x.tier === 'Professional' && x.position === 'C').slice(0, 2);
    pros = [...pros, ...proCs];
    const proGs = tops.filter((x) => x.tier === 'Professional' && x.position === 'G').slice(0, 4);
    pros = [...pros, ...proGs];
    const proOTs = tops.filter((x) => x.tier === 'Professional' && x.position === 'OT').slice(0, 4);
    pros = [...pros, ...proOTs];
    setBlockerProData(pros);

    const vetCs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'C').slice(0, 2);
    vets = [...vets, ...vetCs];
    const vetGs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'G').slice(0, 4);
    vets = [...vets, ...vetGs];
    const vetOTs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'OT').slice(0, 4);
    vets = [...vets, ...vetOTs];
    setBlockerVetData(vets);

    setTimeout(() => setBlockersFetching(false), 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchPasserData();
    fetchRusherData();
    fetchReceiverData();
    fetchDefensiveData();
    fetchBlockingData();
  }, [allData]);

  return (
    <Grid container rowGap={2}>
      <Grid sx={{ display: 'flex', justifyContent: 'center' }} size={12}>
        <FormControl>
          <RadioGroup row name='offense-or-defense-radio-buttons-group' value={teamChoice} onChange={(x) => setTeamChoice(x.target.value)}>
            <FormControlLabel value='offense' control={<Radio />} label='Offense' />
            <FormControlLabel value='defense' control={<Radio />} label='Defense' />
          </RadioGroup>
        </FormControl>
      </Grid>
      {teamChoice === 'offense' ? (
        <>
          <Grid sx={{ pb: 0 }} size={12}>
            <Divider variant='middle'>
              <Typography variant='h5'>1st Team All Stars</Typography>
            </Divider>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Rookie</Typography>
              <AllStarTeamPlayer player={passerRookieData[0]} fetching={passersFetching} />
              <AllStarTeamPlayer player={rusherRookieData[0]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={rusherRookieData[2]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={receiverRookieData[0]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverRookieData[2]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverRookieData[3]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={blockerRookieData[0]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerRookieData[2]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerRookieData[3]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerRookieData[6]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerRookieData[7]} fetching={blockersFetching} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Sophomore</Typography>
              <AllStarTeamPlayer player={passerSophData[0]} fetching={passersFetching} />
              <AllStarTeamPlayer player={rusherSophData[0]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={rusherSophData[2]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={receiverSophData[0]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverSophData[2]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverSophData[3]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={blockerSophData[0]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerSophData[2]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerSophData[3]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerSophData[6]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerSophData[7]} fetching={blockersFetching} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Professional</Typography>
              <AllStarTeamPlayer player={passerProData[0]} fetching={passersFetching} />
              <AllStarTeamPlayer player={rusherProData[0]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={rusherProData[2]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={receiverProData[0]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverProData[2]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverProData[3]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={blockerProData[0]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerProData[2]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerProData[3]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerProData[6]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerProData[7]} fetching={blockersFetching} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Veteran</Typography>
              <AllStarTeamPlayer player={passerVetData[0]} fetching={passersFetching} />
              <AllStarTeamPlayer player={rusherVetData[0]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={rusherVetData[2]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={receiverVetData[0]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverVetData[2]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverVetData[3]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={blockerVetData[0]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerVetData[2]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerVetData[3]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerVetData[6]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerVetData[7]} fetching={blockersFetching} />
            </Stack>
          </Grid>
          <Grid sx={{ pb: 0 }} size={12}>
            <Divider variant='middle'>
              <Typography variant='h5'>2nd Team All Stars</Typography>
            </Divider>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Rookie</Typography>
              <AllStarTeamPlayer player={passerRookieData[1]} fetching={passersFetching} />
              <AllStarTeamPlayer player={rusherRookieData[1]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={rusherRookieData[3]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={receiverRookieData[1]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverRookieData[4]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverRookieData[5]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={blockerRookieData[1]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerRookieData[4]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerRookieData[5]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerRookieData[8]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerRookieData[9]} fetching={blockersFetching} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Sophomore</Typography>
              <AllStarTeamPlayer player={passerSophData[1]} fetching={passersFetching} />
              <AllStarTeamPlayer player={rusherSophData[1]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={rusherSophData[3]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={receiverSophData[1]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverSophData[4]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverSophData[5]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={blockerSophData[1]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerSophData[4]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerSophData[5]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerSophData[8]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerSophData[9]} fetching={blockersFetching} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Professional</Typography>
              <AllStarTeamPlayer player={passerProData[1]} fetching={passersFetching} />
              <AllStarTeamPlayer player={rusherProData[1]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={rusherProData[3]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={receiverProData[1]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverProData[4]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverProData[5]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={blockerProData[1]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerProData[4]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerProData[5]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerProData[8]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerProData[9]} fetching={blockersFetching} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Veteran</Typography>
              <AllStarTeamPlayer player={passerVetData[1]} fetching={passersFetching} />
              <AllStarTeamPlayer player={rusherVetData[1]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={rusherVetData[3]} fetching={rushersFetching} />
              <AllStarTeamPlayer player={receiverVetData[1]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverVetData[4]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={receiverVetData[5]} fetching={receiversFetching} />
              <AllStarTeamPlayer player={blockerVetData[1]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerVetData[4]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerVetData[5]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerVetData[8]} fetching={blockersFetching} />
              <AllStarTeamPlayer player={blockerVetData[9]} fetching={blockersFetching} />
            </Stack>
          </Grid>
        </>
      ) : (
        <>
          <Grid sx={{ pb: 0 }} size={12}>
            <Divider variant='middle'>
              <Typography variant='h5'>1st Team All Stars</Typography>
            </Divider>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Rookie</Typography>
              <AllStarTeamPlayer player={defenderRookieData[0]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[1]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[4]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[5]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[8]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[9]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[10]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[14]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[15]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[18]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[19]} fetching={defendersFetching} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Sophomore</Typography>
              <AllStarTeamPlayer player={defenderSophData[0]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[1]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[4]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[5]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[8]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[9]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[10]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[14]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[15]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[18]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[19]} fetching={defendersFetching} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Professional</Typography>
              <AllStarTeamPlayer player={defenderProData[0]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[1]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[4]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[5]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[8]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[9]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[10]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[14]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[15]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[18]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[19]} fetching={defendersFetching} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Veteran</Typography>
              <AllStarTeamPlayer player={defenderVetData[0]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[1]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[4]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[5]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[8]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[9]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[10]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[14]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[15]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[18]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[19]} fetching={defendersFetching} />
            </Stack>
          </Grid>
          <Grid sx={{ pb: 0 }} size={12}>
            <Divider variant='middle'>
              <Typography variant='h5'>2nd Team All Stars</Typography>
            </Divider>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Rookie</Typography>
              <AllStarTeamPlayer player={defenderRookieData[2]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[3]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[6]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[7]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[11]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[12]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[13]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[16]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[17]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[20]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderRookieData[21]} fetching={defendersFetching} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Sophomore</Typography>
              <AllStarTeamPlayer player={defenderSophData[2]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[3]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[6]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[7]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[11]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[12]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[13]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[16]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[17]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[20]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderSophData[21]} fetching={defendersFetching} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Professional</Typography>
              <AllStarTeamPlayer player={defenderProData[2]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[3]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[6]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[7]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[11]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[12]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[13]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[16]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[17]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[20]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderProData[21]} fetching={defendersFetching} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Stack spacing={1}>
              <Typography variant='h6'>Veteran</Typography>
              <AllStarTeamPlayer player={defenderVetData[2]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[3]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[6]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[7]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[11]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[12]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[13]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[16]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[17]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[20]} fetching={defendersFetching} />
              <AllStarTeamPlayer player={defenderVetData[21]} fetching={defendersFetching} />
            </Stack>
          </Grid>
        </>
      )}
    </Grid>
  );
}
