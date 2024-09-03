'use client';

import { useState, useEffect } from 'react';
import { PlayerReceivingData } from '../stats/receiving/playerReceivingData';
import { PlayerPassingData } from '../stats/passing/playerPassingData';
import { PlayerRushingData } from '../stats/rushing/playerRushingData';
import Grid from '@mui/material/Grid2';
import {
  GAMES_PLAYED,
  getBlockingGmRating,
  getDefensiveGmRating,
  getPassingGmRating,
  getReceivingGmRating,
  getRushingGmRating,
} from '../stats/statCalculations';
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

const THRESHOLDS = {
  PASS_ATTEMPTS: 10 * GAMES_PLAYED,
  CARRIES: 10 * GAMES_PLAYED,
  RECEPTIONS: 1 * GAMES_PLAYED,
  BLOCKER_PLAYS: 30 * GAMES_PLAYED,
};

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

    let rookies: (PlayerPassingData | undefined)[] = [];
    let sophs: (PlayerPassingData | undefined)[] = [];
    let pros: (PlayerPassingData | undefined)[] = [];
    let vets: (PlayerPassingData | undefined)[] = [];

    const rookieQBs = tops.filter((x) => x.tier === 'Rookie' && x.attempts >= THRESHOLDS.PASS_ATTEMPTS).slice(0, 2);
    rookies = rookieQBs.length > 0 ? [...rookies, ...rookieQBs] : [...rookies, ...[undefined, undefined]];
    setPasserRookieData(rookies);
    const sophQBs = tops.filter((x) => x.tier === 'Sophomore' && x.attempts >= THRESHOLDS.PASS_ATTEMPTS).slice(0, 2);
    sophs = sophQBs.length > 0 ? [...sophs, ...sophQBs] : [...sophs, ...[undefined, undefined]];
    setPasserSophData(sophs);
    const proQBs = tops.filter((x) => x.tier === 'Professional' && x.attempts >= THRESHOLDS.PASS_ATTEMPTS).slice(0, 2);
    pros = proQBs.length > 0 ? [...pros, ...proQBs] : [...pros, ...[undefined, undefined]];
    setPasserProData(pros);
    const vetQBs = tops.filter((x) => x.tier === 'Veteran' && x.attempts >= THRESHOLDS.PASS_ATTEMPTS).slice(0, 2);
    vets = vetQBs.length > 0 ? [...vets, ...vetQBs] : [...vets, ...[undefined, undefined]];
    setPasserVetData(vets);

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

    const rookieFBs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'FB' && x.rushes >= THRESHOLDS.CARRIES / 2.0).slice(0, 2);
    rookies = rookieFBs.length > 0 ? [...rookies, ...rookieFBs] : [...rookies, ...[undefined, undefined]];
    const rookieHBs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'HB' && x.rushes >= THRESHOLDS.CARRIES).slice(0, 2);
    rookies = rookieHBs.length > 0 ? [...rookies, ...rookieHBs] : [...rookies, ...[undefined, undefined]];
    setRusherRookieData(rookies);

    const sophFBs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'FB' && x.rushes >= THRESHOLDS.CARRIES / 2.0).slice(0, 2);
    sophs = sophFBs.length > 0 ? [...sophs, ...sophFBs] : [...sophs, ...[undefined, undefined]];
    const sophHBs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'HB' && x.rushes >= THRESHOLDS.CARRIES).slice(0, 2);
    sophs = sophHBs.length > 0 ? [...sophs, ...sophHBs] : [...sophs, ...[undefined, undefined]];
    setRusherSophData(sophs);

    const proFBs = tops.filter((x) => x.tier === 'Professional' && x.position === 'FB' && x.rushes >= THRESHOLDS.CARRIES / 2.0).slice(0, 2);
    pros = proFBs.length > 0 ? [...pros, ...proFBs] : [...pros, ...[undefined, undefined]];
    const proHBs = tops.filter((x) => x.tier === 'Professional' && x.position === 'HB' && x.rushes >= THRESHOLDS.CARRIES).slice(0, 2);
    pros = proHBs.length > 0 ? [...pros, ...proHBs] : [...pros, ...[undefined, undefined]];
    setRusherProData(pros);

    const vetFBs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'FB' && x.rushes >= THRESHOLDS.CARRIES / 2.0).slice(0, 2);
    vets = vetFBs.length > 0 ? [...vets, ...vetFBs] : [...vets, ...[undefined, undefined]];
    const vetHBs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'HB' && x.rushes >= THRESHOLDS.CARRIES).slice(0, 2);
    vets = vetHBs.length > 0 ? [...vets, ...vetHBs] : [...vets, ...[undefined, undefined]];
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

    const rookieTEs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'TE' && x.receptions >= THRESHOLDS.RECEPTIONS).slice(0, 2);
    rookies = rookieTEs.length > 0 ? [...rookies, ...rookieTEs] : [...rookies, ...[undefined, undefined]];
    const rookieWRs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'WR' && x.receptions >= THRESHOLDS.RECEPTIONS).slice(0, 4);
    rookies = rookieWRs.length > 0 ? [...rookies, ...rookieWRs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    setReceiverRookieData(rookies);

    const sophTEs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'TE' && x.receptions >= THRESHOLDS.RECEPTIONS).slice(0, 2);
    sophs = sophTEs.length > 0 ? [...sophs, ...sophTEs] : [...sophs, ...[undefined, undefined]];
    const sophWRs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'WR' && x.receptions >= THRESHOLDS.RECEPTIONS).slice(0, 4);
    sophs = sophWRs.length > 0 ? [...sophs, ...sophWRs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    setReceiverSophData(sophs);

    const proTEs = tops.filter((x) => x.tier === 'Professional' && x.position === 'TE' && x.receptions >= THRESHOLDS.RECEPTIONS).slice(0, 2);
    pros = proTEs.length > 0 ? [...pros, ...proTEs] : [...pros, ...[undefined, undefined]];
    const proWRs = tops.filter((x) => x.tier === 'Professional' && x.position === 'WR' && x.receptions >= THRESHOLDS.RECEPTIONS).slice(0, 4);
    pros = proWRs.length > 0 ? [...pros, ...proWRs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    setReceiverProData(pros);

    const vetTEs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'TE' && x.receptions >= THRESHOLDS.RECEPTIONS).slice(0, 2);
    vets = vetTEs.length > 0 ? [...vets, ...vetTEs] : [...vets, ...[undefined, undefined]];
    const vetWRs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'WR' && x.receptions >= THRESHOLDS.RECEPTIONS).slice(0, 4);
    vets = vetWRs.length > 0 ? [...vets, ...vetWRs] : [...vets, ...[undefined, undefined, undefined, undefined]];
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

    const rookieDTs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'DT' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    rookies = rookieDTs.length > 0 ? [...rookies, ...rookieDTs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    const rookieDEs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'DE' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    rookies = rookieDEs.length > 0 ? [...rookies, ...rookieDEs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    const rookieLBs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'LB' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 6);
    rookies = rookieLBs.length > 0 ? [...rookies, ...rookieLBs] : [...rookies, ...[undefined, undefined, undefined, undefined, undefined, undefined]];
    const rookieCBs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'CB' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    rookies = rookieCBs.length > 0 ? [...rookies, ...rookieCBs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    const rookieSs = tops
      .filter((x) => x.tier === 'Rookie' && (x.position === 'SS' || x.position === 'FS') && x.games_played / GAMES_PLAYED > 0.75)
      .slice(0, 4);
    rookies = rookieSs.length > 0 ? [...rookies, ...rookieSs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    setDefenderRookieData(rookies);

    const sophDTs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'DT' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    sophs = sophDTs.length > 0 ? [...sophs, ...sophDTs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    const sophDEs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'DE' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    sophs = sophDEs.length > 0 ? [...sophs, ...sophDEs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    const sophLBs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'LB' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 6);
    sophs = sophLBs.length > 0 ? [...sophs, ...sophLBs] : [...sophs, ...[undefined, undefined, undefined, undefined, undefined, undefined]];
    const sophCBs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'CB' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    sophs = sophCBs.length > 0 ? [...sophs, ...sophCBs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    const sophSs = tops
      .filter((x) => x.tier === 'Sophomore' && (x.position === 'SS' || x.position === 'FS') && x.games_played / GAMES_PLAYED > 0.75)
      .slice(0, 4);
    sophs = sophSs.length > 0 ? [...sophs, ...sophSs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    setDefenderSophData(sophs);

    const proDTs = tops.filter((x) => x.tier === 'Professional' && x.position === 'DT' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    pros = proDTs.length > 0 ? [...pros, ...proDTs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    const proDEs = tops.filter((x) => x.tier === 'Professional' && x.position === 'DE' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    pros = proDEs.length > 0 ? [...pros, ...proDEs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    const proLBs = tops.filter((x) => x.tier === 'Professional' && x.position === 'LB' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 6);
    pros = proLBs.length > 0 ? [...pros, ...proLBs] : [...pros, ...[undefined, undefined, undefined, undefined, undefined, undefined]];
    const proCBs = tops.filter((x) => x.tier === 'Professional' && x.position === 'CB' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    pros = proCBs.length > 0 ? [...pros, ...proCBs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    const proSs = tops
      .filter((x) => x.tier === 'Professional' && (x.position === 'SS' || x.position === 'FS') && x.games_played / GAMES_PLAYED > 0.75)
      .slice(0, 4);
    pros = proSs.length > 0 ? [...pros, ...proSs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    setDefenderProData(pros);

    const vetDTs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'DT' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    vets = vetDTs.length > 0 ? [...vets, ...vetDTs] : [...vets, ...[undefined, undefined, undefined, undefined]];
    const vetDEs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'DE' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    vets = vetDEs.length > 0 ? [...vets, ...vetDEs] : [...vets, ...[undefined, undefined, undefined, undefined]];
    const vetLBs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'LB' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 6);
    vets = vetLBs.length > 0 ? [...vets, ...vetLBs] : [...vets, ...[undefined, undefined, undefined, undefined, undefined, undefined]];
    const vetCBs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'CB' && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    vets = vetCBs.length > 0 ? [...vets, ...vetCBs] : [...vets, ...[undefined, undefined, undefined, undefined]];
    const vetSs = tops.filter((x) => x.tier === 'Veteran' && (x.position === 'SS' || x.position === 'FS') && x.games_played / GAMES_PLAYED > 0.75).slice(0, 4);
    vets = vetSs.length > 0 ? [...vets, ...vetSs] : [...vets, ...[undefined, undefined, undefined, undefined]];
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

    const rookieCs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'C' && x.plays >= THRESHOLDS.BLOCKER_PLAYS).slice(0, 2);
    rookies = rookieCs.length > 0 ? [...rookies, ...rookieCs] : [...rookies, ...[undefined, undefined]];
    const rookieGs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'G' && x.plays >= THRESHOLDS.BLOCKER_PLAYS).slice(0, 4);
    rookies = rookieGs.length > 0 ? [...rookies, ...rookieGs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    const rookieOTs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'OT' && x.plays >= THRESHOLDS.BLOCKER_PLAYS).slice(0, 4);
    rookies = rookieOTs.length > 0 ? [...rookies, ...rookieOTs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    setBlockerRookieData(rookies);

    const sophCs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'C' && x.plays >= THRESHOLDS.BLOCKER_PLAYS).slice(0, 2);
    sophs = sophCs.length > 0 ? [...sophs, ...sophCs] : [...sophs, ...[undefined, undefined]];
    const sophGs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'G' && x.plays >= THRESHOLDS.BLOCKER_PLAYS).slice(0, 4);
    sophs = sophGs.length > 0 ? [...sophs, ...sophGs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    const sophOTs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'OT' && x.plays >= THRESHOLDS.BLOCKER_PLAYS).slice(0, 4);
    sophs = sophOTs.length > 0 ? [...sophs, ...sophOTs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    setBlockerSophData(sophs);

    const proCs = tops.filter((x) => x.tier === 'Professional' && x.position === 'C' && x.plays >= THRESHOLDS.BLOCKER_PLAYS).slice(0, 2);
    pros = proCs.length > 0 ? [...pros, ...proCs] : [...pros, ...[undefined, undefined]];
    const proGs = tops.filter((x) => x.tier === 'Professional' && x.position === 'G' && x.plays >= THRESHOLDS.BLOCKER_PLAYS).slice(0, 4);
    pros = proGs.length > 0 ? [...pros, ...proGs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    const proOTs = tops.filter((x) => x.tier === 'Professional' && x.position === 'OT' && x.plays >= THRESHOLDS.BLOCKER_PLAYS).slice(0, 4);
    pros = proOTs.length > 0 ? [...pros, ...proOTs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    setBlockerProData(pros);

    const vetCs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'C' && x.plays >= THRESHOLDS.BLOCKER_PLAYS).slice(0, 2);
    vets = vetCs.length > 0 ? [...vets, ...vetCs] : [...vets, ...[undefined, undefined]];
    const vetGs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'G' && x.plays >= THRESHOLDS.BLOCKER_PLAYS).slice(0, 4);
    vets = vetGs.length > 0 ? [...vets, ...vetGs] : [...vets, ...[undefined, undefined, undefined, undefined]];
    const vetOTs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'OT' && x.plays >= THRESHOLDS.BLOCKER_PLAYS).slice(0, 4);
    vets = vetOTs.length > 0 ? [...vets, ...vetOTs] : [...vets, ...[undefined, undefined, undefined, undefined]];
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
