'use client';

import { useState, useEffect } from 'react';
import { PlayerReceivingData } from '../stats/receiving/playerReceivingData';
import { PlayerPassingData } from '../stats/passing/playerPassingData';
import { PlayerRushingData } from '../stats/rushing/playerRushingData';
import Grid from '@mui/material/Grid2';
import {
  getBlockingGmRating,
  getDefensiveGmRating,
  getKickingGmRating,
  getPassingGmRating,
  getPuntingGmRating,
  getReceivingGmRating,
  getReturningGmRating,
  getRushingGmRating,
} from '../stats/statCalculations';
import { Divider, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import AllStarTeamPlayer from './AllStarTeamPlayer';
import { PlayerDefensiveData } from '../stats/defensive/playerDefensiveData';
import { PlayerBlockingData } from '../stats/blocking/playerBlockingData';
import { PlayerKickingData } from '../stats/kicking/playerKickingData';
import { PlayerPuntingData } from '../stats/punting/playerPuntingData';
import { PlayerReturningData } from '../stats/returning/playerReturningData';

interface AllData {
  passData: PlayerPassingData[];
  rushData: PlayerRushingData[];
  recData: PlayerReceivingData[];
  defData: PlayerDefensiveData[];
  blockData: PlayerBlockingData[];
  kickData: PlayerKickingData[];
  puntData: PlayerPuntingData[];
  returnData: PlayerReturningData[];
}

interface Thresholds {
  PASS_ATTEMPTS: number;
  CARRIES: number;
  RECEPTIONS: number;
  BLOCKER_PLAYS: number;
  FG_ATTEMPTS: number;
  PUNTS: number;
  RETURNS: number;
}

export default function TopTeam() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [gamesPlayed, setGamesPlayed] = useState<number>();
  const [thresholds, setThresholds] = useState<Thresholds>();
  const [teamChoice, setTeamChoice] = useState<string>('first');
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
  const [kickerRookieData, setKickerRookieData] = useState<(PlayerKickingData | undefined)[]>([]);
  const [kickerSophData, setKickerSophData] = useState<(PlayerKickingData | undefined)[]>([]);
  const [kickerProData, setKickerProData] = useState<(PlayerKickingData | undefined)[]>([]);
  const [kickerVetData, setKickerVetData] = useState<(PlayerKickingData | undefined)[]>([]);
  const [punterRookieData, setPunterRookieData] = useState<(PlayerPuntingData | undefined)[]>([]);
  const [punterSophData, setPunterSophData] = useState<(PlayerPuntingData | undefined)[]>([]);
  const [punterProData, setPunterProData] = useState<(PlayerPuntingData | undefined)[]>([]);
  const [punterVetData, setPunterVetData] = useState<(PlayerPuntingData | undefined)[]>([]);
  const [returnerRookieData, setReturnerRookieData] = useState<(PlayerReturningData | undefined)[]>([]);
  const [returnerSophData, setReturnerSophData] = useState<(PlayerReturningData | undefined)[]>([]);
  const [returnerProData, setReturnerProData] = useState<(PlayerReturningData | undefined)[]>([]);
  const [returnerVetData, setReturnerVetData] = useState<(PlayerReturningData | undefined)[]>([]);
  const [passersFetching, setPassersFetching] = useState<boolean>(true);
  const [rushersFetching, setRushersFetching] = useState<boolean>(true);
  const [receiversFetching, setReceiversFetching] = useState<boolean>(true);
  const [defendersFetching, setDefendersFetching] = useState<boolean>(true);
  const [blockersFetching, setBlockersFetching] = useState<boolean>(true);
  const [kickersFetching, setKickersFetching] = useState<boolean>(true);
  const [puntersFetching, setPuntersFetching] = useState<boolean>(true);
  const [returnersFetching, setReturnersFetching] = useState<boolean>(true);

  const matchById = (array1: any[], array2: any[], statToPull: string, propToAdd: string) => {
    const map = new Map();
    for (const item2 of array2) {
      map.set(item2.id, item2[statToPull]);
    }

    return array1.map((item1) => ({
      ...item1,
      [propToAdd]: map.get(item1.id) || item1[propToAdd],
    }));
  };

  const comparePlayers = (a: any, b: any, getRatingFn: Function, tieBreakerFn: Function): number => {
    const ratingDiff = getRatingFn(b) - getRatingFn(a);
    if (ratingDiff === 0) return tieBreakerFn(a, b);
    return ratingDiff;
  };

  const tieBreakerFns: { [key: string]: (a: any, b: any) => number } = {
    passing: (a, b) => +b.yards - +a.yards,
    rushing: (a, b) => +b.yards - +a.yards,
    receiving: (a, b) => +b.yards - +a.yards,
    blocking: (a, b) => +b.pancakes - +a.pancakes,
    defensive: (a, b) => {
      switch (a.position) {
        case 'DT':
        case 'DE':
          return +b.sacks - +a.sacks;
        case 'LB':
          return +b.interceptions + +b.tackles - +b.missed_tackles - (+a.interceptions + +a.tackles - +a.missed_tackles);
        case 'CB':
        case 'FS':
        case 'SS':
          return +b.interceptions - +a.interceptions;
        default:
          return 0;
      }
    },
    kicking: (a, b) => +b.fg_made - +a.fg_made,
    punting: (a, b) => +b.average + +b.hangtime - (+a.average + +a.hangtime),
    returning: (a, b) => +b.kr_average + +b.pr_average - (+a.kr_average + +a.pr_average),
  };

  const sortByRating = (stat: string, a: any, b: any): number => {
    switch (stat) {
      case 'passing':
        return comparePlayers(a, b, getPassingGmRating, tieBreakerFns.passing);
      case 'rushing':
        return comparePlayers(a, b, getRushingGmRating, tieBreakerFns.rushing);
      case 'receiving':
        return comparePlayers(a, b, getReceivingGmRating, tieBreakerFns.receiving);
      case 'blocking':
        return comparePlayers(a, b, getBlockingGmRating, tieBreakerFns.blocking);
      case 'defensive':
        return comparePlayers(a, b, getDefensiveGmRating, tieBreakerFns.defensive);
      case 'kicking':
        return comparePlayers(a, b, getKickingGmRating, tieBreakerFns.kicking);
      case 'punting':
        return comparePlayers(a, b, getPuntingGmRating, tieBreakerFns.punting);
      case 'returning':
        return comparePlayers(a, b, getReturningGmRating, tieBreakerFns.returning);
      default:
        return 0;
    }
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
    const kickRes = await fetch('/api/kicking');
    const kickData: PlayerKickingData[] = await kickRes.json();
    const puntRes = await fetch('/api/punting');
    const puntData: PlayerPuntingData[] = await puntRes.json();
    const returnRes = await fetch('/api/returning');
    const returnData: PlayerReturningData[] = await returnRes.json();

    setGamesPlayed(Math.max(...passData.map((x) => x.games_played)));

    setAllData({ passData, rushData, recData, defData, blockData, kickData, puntData, returnData });
  };

  const fetchPasserData = async () => {
    if (!allData || !thresholds) return;

    const allDataWithRushYards = matchById(allData.passData, allData.rushData, 'yards', 'rush_yards');
    const allDataWithRushYardsAndTd = matchById(allDataWithRushYards, allData.rushData, 'touchdowns', 'rush_touchdowns');

    const tops: PlayerPassingData[] = allDataWithRushYardsAndTd.sort((a: PlayerPassingData, b: PlayerPassingData) => sortByRating('passing', a, b));

    let rookies: (PlayerPassingData | undefined)[] = [];
    let sophs: (PlayerPassingData | undefined)[] = [];
    let pros: (PlayerPassingData | undefined)[] = [];
    let vets: (PlayerPassingData | undefined)[] = [];

    const rookieQBs = tops.filter((x) => x.tier === 'Rookie' && x.attempts >= thresholds.PASS_ATTEMPTS).slice(0, 2);
    rookies = rookieQBs.length > 0 ? [...rookies, ...rookieQBs] : [...rookies, ...[undefined, undefined]];
    setPasserRookieData(rookies);

    const sophQBs = tops.filter((x) => x.tier === 'Sophomore' && x.attempts >= thresholds.PASS_ATTEMPTS).slice(0, 2);
    sophs = sophQBs.length > 0 ? [...sophs, ...sophQBs] : [...sophs, ...[undefined, undefined]];
    setPasserSophData(sophs);

    const proQBs = tops.filter((x) => x.tier === 'Professional' && x.attempts >= thresholds.PASS_ATTEMPTS).slice(0, 2);
    pros = proQBs.length > 0 ? [...pros, ...proQBs] : [...pros, ...[undefined, undefined]];
    setPasserProData(pros);

    const vetQBs = tops.filter((x) => x.tier === 'Veteran' && x.attempts >= thresholds.PASS_ATTEMPTS).slice(0, 2);
    vets = vetQBs.length > 0 ? [...vets, ...vetQBs] : [...vets, ...[undefined, undefined]];
    setPasserVetData(vets);

    setPassersFetching(false);
  };

  const fetchRusherData = async () => {
    if (!allData || !thresholds) return;

    const allDataWithRecYards = matchById(allData.rushData, allData.recData, 'yards', 'rec_yards');
    const allDataWithRecYardsAndTd = matchById(allDataWithRecYards, allData.recData, 'touchdowns', 'rec_touchdowns');

    const tops: PlayerRushingData[] = allDataWithRecYardsAndTd.sort((a: PlayerRushingData, b: PlayerRushingData) => sortByRating('rushing', a, b));

    let rookies: (PlayerRushingData | undefined)[] = [];
    let sophs: (PlayerRushingData | undefined)[] = [];
    let pros: (PlayerRushingData | undefined)[] = [];
    let vets: (PlayerRushingData | undefined)[] = [];

    const rookieFBs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'FB' && x.rushes >= thresholds.CARRIES / 5.0).slice(0, 2);
    rookies =
      rookieFBs.length > 1
        ? [...rookies, ...rookieFBs]
        : rookieFBs.length > 0
          ? [...rookies, ...rookieFBs, ...[undefined]]
          : [...rookies, ...[undefined, undefined]];
    const rookieHBs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'HB' && x.rushes >= thresholds.CARRIES).slice(0, 2);
    rookies = rookieHBs.length > 0 ? [...rookies, ...rookieHBs] : [...rookies, ...[undefined, undefined]];
    setRusherRookieData(rookies);

    const sophFBs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'FB' && x.rushes >= thresholds.CARRIES / 5.0).slice(0, 2);
    sophs = sophFBs.length > 1 ? [...sophs, ...sophFBs] : sophFBs.length > 0 ? [...sophs, ...sophFBs, ...[undefined]] : [...sophs, ...[undefined, undefined]];
    const sophHBs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'HB' && x.rushes >= thresholds.CARRIES).slice(0, 2);
    sophs = sophHBs.length > 0 ? [...sophs, ...sophHBs] : [...sophs, ...[undefined, undefined]];
    setRusherSophData(sophs);

    const proFBs = tops.filter((x) => x.tier === 'Professional' && x.position === 'FB' && x.rushes >= thresholds.CARRIES / 5.0).slice(0, 2);
    pros = proFBs.length > 1 ? [...pros, ...proFBs] : proFBs.length > 0 ? [...pros, ...proFBs, ...[undefined]] : [...pros, ...[undefined, undefined]];
    const proHBs = tops.filter((x) => x.tier === 'Professional' && x.position === 'HB' && x.rushes >= thresholds.CARRIES).slice(0, 2);
    pros = proHBs.length > 0 ? [...pros, ...proHBs] : [...pros, ...[undefined, undefined]];
    setRusherProData(pros);

    const vetFBs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'FB' && x.rushes >= thresholds.CARRIES / 5.0).slice(0, 2);
    vets = vetFBs.length > 1 ? [...vets, ...vetFBs] : vetFBs.length > 0 ? [...vets, ...vetFBs, ...[undefined]] : [...vets, ...[undefined, undefined]];
    const vetHBs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'HB' && x.rushes >= thresholds.CARRIES).slice(0, 2);
    vets = vetHBs.length > 0 ? [...vets, ...vetHBs] : [...vets, ...[undefined, undefined]];
    setRusherVetData(vets);

    setRushersFetching(false);
  };

  const fetchReceiverData = async () => {
    if (!allData || !thresholds) return;

    const tops = allData.recData.sort((a: PlayerReceivingData, b: PlayerReceivingData) => sortByRating('receiving', a, b));

    let rookies: (PlayerReceivingData | undefined)[] = [];
    let sophs: (PlayerReceivingData | undefined)[] = [];
    let pros: (PlayerReceivingData | undefined)[] = [];
    let vets: (PlayerReceivingData | undefined)[] = [];

    const rookieTEs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'TE' && x.receptions >= thresholds.RECEPTIONS).slice(0, 2);
    rookies = rookieTEs.length > 0 ? [...rookies, ...rookieTEs] : [...rookies, ...[undefined, undefined]];
    const rookieWRs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'WR' && x.receptions >= thresholds.RECEPTIONS).slice(0, 4);
    rookies = rookieWRs.length > 0 ? [...rookies, ...rookieWRs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    setReceiverRookieData(rookies);

    const sophTEs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'TE' && x.receptions >= thresholds.RECEPTIONS).slice(0, 2);
    sophs = sophTEs.length > 0 ? [...sophs, ...sophTEs] : [...sophs, ...[undefined, undefined]];
    const sophWRs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'WR' && x.receptions >= thresholds.RECEPTIONS).slice(0, 4);
    sophs = sophWRs.length > 0 ? [...sophs, ...sophWRs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    setReceiverSophData(sophs);

    const proTEs = tops.filter((x) => x.tier === 'Professional' && x.position === 'TE' && x.receptions >= thresholds.RECEPTIONS).slice(0, 2);
    pros = proTEs.length > 0 ? [...pros, ...proTEs] : [...pros, ...[undefined, undefined]];
    const proWRs = tops.filter((x) => x.tier === 'Professional' && x.position === 'WR' && x.receptions >= thresholds.RECEPTIONS).slice(0, 4);
    pros = proWRs.length > 0 ? [...pros, ...proWRs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    setReceiverProData(pros);

    const vetTEs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'TE' && x.receptions >= thresholds.RECEPTIONS).slice(0, 2);
    vets = vetTEs.length > 0 ? [...vets, ...vetTEs] : [...vets, ...[undefined, undefined]];
    const vetWRs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'WR' && x.receptions >= thresholds.RECEPTIONS).slice(0, 4);
    vets = vetWRs.length > 0 ? [...vets, ...vetWRs] : [...vets, ...[undefined, undefined, undefined, undefined]];
    setReceiverVetData(vets);

    setReceiversFetching(false);
  };

  const fetchDefensiveData = async () => {
    if (!allData || !gamesPlayed) return;

    const tops = allData.defData.sort((a: PlayerDefensiveData, b: PlayerDefensiveData) => sortByRating('defensive', a, b));

    let rookies: (PlayerDefensiveData | undefined)[] = [];
    let sophs: (PlayerDefensiveData | undefined)[] = [];
    let pros: (PlayerDefensiveData | undefined)[] = [];
    let vets: (PlayerDefensiveData | undefined)[] = [];

    const rookieDTs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'DT' && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    rookies = rookieDTs.length > 0 ? [...rookies, ...rookieDTs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    const rookieDEs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'DE' && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    rookies = rookieDEs.length > 0 ? [...rookies, ...rookieDEs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    const rookieLBs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'LB' && x.games_played / gamesPlayed >= 0.75).slice(0, 6);
    rookies = rookieLBs.length > 0 ? [...rookies, ...rookieLBs] : [...rookies, ...[undefined, undefined, undefined, undefined, undefined, undefined]];
    const rookieCBs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'CB' && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    rookies = rookieCBs.length > 0 ? [...rookies, ...rookieCBs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    const rookieSs = tops
      .filter((x) => x.tier === 'Rookie' && (x.position === 'SS' || x.position === 'FS') && x.games_played / gamesPlayed >= 0.75)
      .slice(0, 4);
    rookies = rookieSs.length > 0 ? [...rookies, ...rookieSs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    setDefenderRookieData(rookies);

    const sophDTs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'DT' && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    sophs = sophDTs.length > 0 ? [...sophs, ...sophDTs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    const sophDEs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'DE' && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    sophs = sophDEs.length > 0 ? [...sophs, ...sophDEs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    const sophLBs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'LB' && x.games_played / gamesPlayed >= 0.75).slice(0, 6);
    sophs = sophLBs.length > 0 ? [...sophs, ...sophLBs] : [...sophs, ...[undefined, undefined, undefined, undefined, undefined, undefined]];
    const sophCBs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'CB' && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    sophs = sophCBs.length > 0 ? [...sophs, ...sophCBs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    const sophSs = tops
      .filter((x) => x.tier === 'Sophomore' && (x.position === 'SS' || x.position === 'FS') && x.games_played / gamesPlayed >= 0.75)
      .slice(0, 4);
    sophs = sophSs.length > 0 ? [...sophs, ...sophSs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    setDefenderSophData(sophs);

    const proDTs = tops.filter((x) => x.tier === 'Professional' && x.position === 'DT' && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    pros = proDTs.length > 0 ? [...pros, ...proDTs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    const proDEs = tops.filter((x) => x.tier === 'Professional' && x.position === 'DE' && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    pros = proDEs.length > 0 ? [...pros, ...proDEs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    const proLBs = tops.filter((x) => x.tier === 'Professional' && x.position === 'LB' && x.games_played / gamesPlayed >= 0.75).slice(0, 6);
    pros = proLBs.length > 0 ? [...pros, ...proLBs] : [...pros, ...[undefined, undefined, undefined, undefined, undefined, undefined]];
    const proCBs = tops.filter((x) => x.tier === 'Professional' && x.position === 'CB' && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    pros = proCBs.length > 0 ? [...pros, ...proCBs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    const proSs = tops
      .filter((x) => x.tier === 'Professional' && (x.position === 'SS' || x.position === 'FS') && x.games_played / gamesPlayed >= 0.75)
      .slice(0, 4);
    pros = proSs.length > 0 ? [...pros, ...proSs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    setDefenderProData(pros);

    const vetDTs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'DT' && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    vets = vetDTs.length > 0 ? [...vets, ...vetDTs] : [...vets, ...[undefined, undefined, undefined, undefined]];
    const vetDEs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'DE' && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    vets = vetDEs.length > 0 ? [...vets, ...vetDEs] : [...vets, ...[undefined, undefined, undefined, undefined]];
    const vetLBs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'LB' && x.games_played / gamesPlayed >= 0.75).slice(0, 6);
    vets = vetLBs.length > 0 ? [...vets, ...vetLBs] : [...vets, ...[undefined, undefined, undefined, undefined, undefined, undefined]];
    const vetCBs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'CB' && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    vets = vetCBs.length > 0 ? [...vets, ...vetCBs] : [...vets, ...[undefined, undefined, undefined, undefined]];
    const vetSs = tops.filter((x) => x.tier === 'Veteran' && (x.position === 'SS' || x.position === 'FS') && x.games_played / gamesPlayed >= 0.75).slice(0, 4);
    vets = vetSs.length > 0 ? [...vets, ...vetSs] : [...vets, ...[undefined, undefined, undefined, undefined]];
    setDefenderVetData(vets);

    setDefendersFetching(false);
  };

  const fetchBlockingData = async () => {
    if (!allData || !thresholds) return;

    const tops = allData.blockData.sort((a: PlayerBlockingData, b: PlayerBlockingData) => sortByRating('blocking', a, b));

    let rookies: (PlayerBlockingData | undefined)[] = [];
    let sophs: (PlayerBlockingData | undefined)[] = [];
    let pros: (PlayerBlockingData | undefined)[] = [];
    let vets: (PlayerBlockingData | undefined)[] = [];

    const rookieCs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'C' && x.plays >= thresholds.BLOCKER_PLAYS).slice(0, 2);
    rookies = rookieCs.length > 0 ? [...rookies, ...rookieCs] : [...rookies, ...[undefined, undefined]];
    const rookieGs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'G' && x.plays >= thresholds.BLOCKER_PLAYS).slice(0, 4);
    rookies = rookieGs.length > 0 ? [...rookies, ...rookieGs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    const rookieOTs = tops.filter((x) => x.tier === 'Rookie' && x.position === 'OT' && x.plays >= thresholds.BLOCKER_PLAYS).slice(0, 4);
    rookies = rookieOTs.length > 0 ? [...rookies, ...rookieOTs] : [...rookies, ...[undefined, undefined, undefined, undefined]];
    setBlockerRookieData(rookies);

    const sophCs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'C' && x.plays >= thresholds.BLOCKER_PLAYS).slice(0, 2);
    sophs = sophCs.length > 0 ? [...sophs, ...sophCs] : [...sophs, ...[undefined, undefined]];
    const sophGs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'G' && x.plays >= thresholds.BLOCKER_PLAYS).slice(0, 4);
    sophs = sophGs.length > 0 ? [...sophs, ...sophGs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    const sophOTs = tops.filter((x) => x.tier === 'Sophomore' && x.position === 'OT' && x.plays >= thresholds.BLOCKER_PLAYS).slice(0, 4);
    sophs = sophOTs.length > 0 ? [...sophs, ...sophOTs] : [...sophs, ...[undefined, undefined, undefined, undefined]];
    setBlockerSophData(sophs);

    const proCs = tops.filter((x) => x.tier === 'Professional' && x.position === 'C' && x.plays >= thresholds.BLOCKER_PLAYS).slice(0, 2);
    pros = proCs.length > 0 ? [...pros, ...proCs] : [...pros, ...[undefined, undefined]];
    const proGs = tops.filter((x) => x.tier === 'Professional' && x.position === 'G' && x.plays >= thresholds.BLOCKER_PLAYS).slice(0, 4);
    pros = proGs.length > 0 ? [...pros, ...proGs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    const proOTs = tops.filter((x) => x.tier === 'Professional' && x.position === 'OT' && x.plays >= thresholds.BLOCKER_PLAYS).slice(0, 4);
    pros = proOTs.length > 0 ? [...pros, ...proOTs] : [...pros, ...[undefined, undefined, undefined, undefined]];
    setBlockerProData(pros);

    const vetCs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'C' && x.plays >= thresholds.BLOCKER_PLAYS).slice(0, 2);
    vets = vetCs.length > 0 ? [...vets, ...vetCs] : [...vets, ...[undefined, undefined]];
    const vetGs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'G' && x.plays >= thresholds.BLOCKER_PLAYS).slice(0, 4);
    vets = vetGs.length > 0 ? [...vets, ...vetGs] : [...vets, ...[undefined, undefined, undefined, undefined]];
    const vetOTs = tops.filter((x) => x.tier === 'Veteran' && x.position === 'OT' && x.plays >= thresholds.BLOCKER_PLAYS).slice(0, 4);
    vets = vetOTs.length > 0 ? [...vets, ...vetOTs] : [...vets, ...[undefined, undefined, undefined, undefined]];
    setBlockerVetData(vets);

    setBlockersFetching(false);
  };

  const fetchKickingData = async () => {
    if (!allData || !thresholds) return;

    const tops: PlayerKickingData[] = allData.kickData.sort((a: PlayerKickingData, b: PlayerKickingData) => sortByRating('kicking', a, b));

    let rookies: (PlayerKickingData | undefined)[] = [];
    let sophs: (PlayerKickingData | undefined)[] = [];
    let pros: (PlayerKickingData | undefined)[] = [];
    let vets: (PlayerKickingData | undefined)[] = [];

    const rookieKs = tops.filter((x) => x.tier === 'Rookie' && x.fg_attempts >= thresholds.FG_ATTEMPTS).slice(0, 2);
    rookies = rookieKs.length > 0 ? [...rookies, ...rookieKs] : [...rookies, ...[undefined, undefined]];
    setKickerRookieData(rookies);

    const sophKs = tops.filter((x) => x.tier === 'Sophomore' && x.fg_attempts >= thresholds.FG_ATTEMPTS).slice(0, 2);
    sophs = sophKs.length > 0 ? [...sophs, ...sophKs] : [...sophs, ...[undefined, undefined]];
    setKickerSophData(sophs);

    const proKs = tops.filter((x) => x.tier === 'Professional' && x.fg_attempts >= thresholds.FG_ATTEMPTS).slice(0, 2);
    pros = proKs.length > 0 ? [...pros, ...proKs] : [...pros, ...[undefined, undefined]];
    setKickerProData(pros);

    const vetKs = tops.filter((x) => x.tier === 'Veteran' && x.fg_attempts >= thresholds.FG_ATTEMPTS).slice(0, 2);
    vets = vetKs.length > 0 ? [...vets, ...vetKs] : [...vets, ...[undefined, undefined]];
    setKickerVetData(vets);

    setKickersFetching(false);
  };

  const fetchPuntingData = async () => {
    if (!allData || !thresholds) return;

    const tops: PlayerPuntingData[] = allData.puntData.sort((a: PlayerPuntingData, b: PlayerPuntingData) => sortByRating('punting', a, b));

    let rookies: (PlayerPuntingData | undefined)[] = [];
    let sophs: (PlayerPuntingData | undefined)[] = [];
    let pros: (PlayerPuntingData | undefined)[] = [];
    let vets: (PlayerPuntingData | undefined)[] = [];

    const rookiePs = tops.filter((x) => x.tier === 'Rookie' && x.punts >= thresholds.PUNTS).slice(0, 2);
    rookies = rookiePs.length > 0 ? [...rookies, ...rookiePs] : [...rookies, ...[undefined, undefined]];
    setPunterRookieData(rookies);

    const sophPs = tops.filter((x) => x.tier === 'Sophomore' && x.punts >= thresholds.PUNTS).slice(0, 2);
    sophs = sophPs.length > 0 ? [...sophs, ...sophPs] : [...sophs, ...[undefined, undefined]];
    setPunterSophData(sophs);

    const proPs = tops.filter((x) => x.tier === 'Professional' && x.punts >= thresholds.PUNTS).slice(0, 2);
    pros = proPs.length > 0 ? [...pros, ...proPs] : [...pros, ...[undefined, undefined]];
    setPunterProData(pros);

    const vetPs = tops.filter((x) => x.tier === 'Veteran' && x.punts >= thresholds.PUNTS).slice(0, 2);
    vets = vetPs.length > 0 ? [...vets, ...vetPs] : [...vets, ...[undefined, undefined]];
    setPunterVetData(vets);

    setPuntersFetching(false);
  };

  const fetchReturnerData = async () => {
    if (!allData || !thresholds) return;

    const tops: PlayerReturningData[] = allData.returnData
      .sort((a: PlayerReturningData, b: PlayerReturningData) => sortByRating('returning', a, b))
      .map((x) => ({ ...x, position: 'RET' }));

    let rookies: (PlayerReturningData | undefined)[] = [];
    let sophs: (PlayerReturningData | undefined)[] = [];
    let pros: (PlayerReturningData | undefined)[] = [];
    let vets: (PlayerReturningData | undefined)[] = [];

    const rookie = tops.filter((x) => x.tier === 'Rookie' && x.krs + x.prs >= thresholds.RETURNS).slice(0, 2);
    rookies = rookie.length > 0 ? [...rookies, ...rookie] : [...rookies, ...[undefined, undefined]];
    setReturnerRookieData(rookies);

    const soph = tops.filter((x) => x.tier === 'Sophomore' && x.krs + x.prs >= thresholds.RETURNS).slice(0, 2);
    sophs = soph.length > 0 ? [...sophs, ...soph] : [...sophs, ...[undefined, undefined]];
    setReturnerSophData(sophs);

    const pro = tops.filter((x) => x.tier === 'Professional' && x.krs + x.prs >= thresholds.RETURNS).slice(0, 2);
    pros = pro.length > 0 ? [...pros, ...pro] : [...pros, ...[undefined, undefined]];
    setReturnerProData(pros);

    const vet = tops.filter((x) => x.tier === 'Veteran' && x.krs + x.prs >= thresholds.RETURNS).slice(0, 2);
    vets = vet.length > 0 ? [...vets, ...vet] : [...vets, ...[undefined, undefined]];
    setReturnerVetData(vets);

    setReturnersFetching(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!gamesPlayed) return;

    setThresholds({
      PASS_ATTEMPTS: 20.0 * gamesPlayed,
      CARRIES: 20.0 * gamesPlayed,
      RECEPTIONS: 3.0 * gamesPlayed,
      BLOCKER_PLAYS: 30.0 * gamesPlayed,
      FG_ATTEMPTS: 1.0 * gamesPlayed,
      PUNTS: 1.0 * gamesPlayed,
      RETURNS: 1.0 * gamesPlayed,
    });
  }, [gamesPlayed]);

  useEffect(() => {
    fetchPasserData();
    fetchRusherData();
    fetchReceiverData();
    fetchDefensiveData();
    fetchBlockingData();
    fetchKickingData();
    fetchPuntingData();
    fetchReturnerData();
  }, [thresholds]);

  return (
    <Grid container rowGap={{ xs: 0.5, sm: 1 }} sx={{ mb: 2 }}>
      <Grid sx={{ display: 'flex', justifyContent: 'center' }} size={12}>
        <FormControl>
          <RadioGroup row name='first-or-second-radio-buttons-group' value={teamChoice} onChange={(x) => setTeamChoice(x.target.value)}>
            <FormControlLabel value='first' control={<Radio />} label='1st Team' />
            <FormControlLabel value='second' control={<Radio />} label='2nd Team' />
          </RadioGroup>
        </FormControl>
      </Grid>
      {teamChoice === 'first' && gamesPlayed && (
        <>
          <Grid sx={{ pb: 0 }} size={12}>
            <Divider variant='middle'>
              <Typography variant='h6'>Offense</Typography>
            </Divider>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Rookie</Typography>
              </Divider>
              <AllStarTeamPlayer player={passerRookieData[0]} fetching={passersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherRookieData[0]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherRookieData[2]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverRookieData[0]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverRookieData[2]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverRookieData[3]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerRookieData[0]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerRookieData[2]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerRookieData[3]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerRookieData[6]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerRookieData[7]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Sophomore</Typography>
              </Divider>
              <AllStarTeamPlayer player={passerSophData[0]} fetching={passersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherSophData[0]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherSophData[2]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverSophData[0]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverSophData[2]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverSophData[3]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerSophData[0]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerSophData[2]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerSophData[3]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerSophData[6]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerSophData[7]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Professional</Typography>
              </Divider>
              <AllStarTeamPlayer player={passerProData[0]} fetching={passersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherProData[0]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherProData[2]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverProData[0]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverProData[2]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverProData[3]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerProData[0]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerProData[2]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerProData[3]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerProData[6]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerProData[7]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Veteran</Typography>
              </Divider>
              <AllStarTeamPlayer player={passerVetData[0]} fetching={passersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherVetData[0]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherVetData[2]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverVetData[0]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverVetData[2]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverVetData[3]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerVetData[0]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerVetData[2]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerVetData[3]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerVetData[6]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerVetData[7]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid sx={{ pb: 0 }} size={12}>
            <Divider variant='middle'>
              <Typography variant='h6'>Defense</Typography>
            </Divider>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Rookie</Typography>
              </Divider>
              <AllStarTeamPlayer player={defenderRookieData[0]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[1]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[4]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[5]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[8]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[9]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[10]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[14]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[15]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[18]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[19]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Sophomore</Typography>
              </Divider>
              <AllStarTeamPlayer player={defenderSophData[0]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[1]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[4]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[5]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[8]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[9]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[10]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[14]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[15]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[18]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[19]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Professional</Typography>
              </Divider>
              <AllStarTeamPlayer player={defenderProData[0]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[1]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[4]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[5]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[8]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[9]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[10]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[14]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[15]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[18]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[19]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Veteran</Typography>
              </Divider>
              <AllStarTeamPlayer player={defenderVetData[0]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[1]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[4]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[5]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[8]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[9]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[10]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[14]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[15]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[18]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[19]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid sx={{ pb: 0 }} size={12}>
            <Divider variant='middle'>
              <Typography variant='h6'>Special Teams</Typography>
            </Divider>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Rookie</Typography>
              </Divider>
              <AllStarTeamPlayer player={kickerRookieData[0]} fetching={kickersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={punterRookieData[0]} fetching={puntersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={returnerRookieData[0]} fetching={returnersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Sophomore</Typography>
              </Divider>
              <AllStarTeamPlayer player={kickerSophData[0]} fetching={kickersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={punterSophData[0]} fetching={puntersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={returnerSophData[0]} fetching={returnersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Professional</Typography>
              </Divider>
              <AllStarTeamPlayer player={kickerProData[0]} fetching={kickersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={punterProData[0]} fetching={puntersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={returnerProData[0]} fetching={returnersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Veteran</Typography>
              </Divider>
              <AllStarTeamPlayer player={kickerVetData[0]} fetching={kickersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={punterVetData[0]} fetching={puntersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={returnerVetData[0]} fetching={returnersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
        </>
      )}
      {teamChoice === 'second' && gamesPlayed && (
        <>
          <Grid sx={{ pb: 0 }} size={12}>
            <Divider variant='middle'>
              <Typography variant='h6'>Offense</Typography>
            </Divider>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Rookie</Typography>
              </Divider>
              <AllStarTeamPlayer player={passerRookieData[1]} fetching={passersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherRookieData[1]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherRookieData[3]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverRookieData[1]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverRookieData[4]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverRookieData[5]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerRookieData[1]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerRookieData[4]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerRookieData[5]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerRookieData[8]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerRookieData[9]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Sophomore</Typography>
              </Divider>
              <AllStarTeamPlayer player={passerSophData[1]} fetching={passersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherSophData[1]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherSophData[3]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverSophData[1]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverSophData[4]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverSophData[5]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerSophData[1]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerSophData[4]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerSophData[5]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerSophData[8]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerSophData[9]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Professional</Typography>
              </Divider>
              <AllStarTeamPlayer player={passerProData[1]} fetching={passersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherProData[1]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherProData[3]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverProData[1]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverProData[4]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverProData[5]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerProData[1]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerProData[4]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerProData[5]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerProData[8]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerProData[9]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Veteran</Typography>
              </Divider>
              <AllStarTeamPlayer player={passerVetData[1]} fetching={passersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherVetData[1]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={rusherVetData[3]} fetching={rushersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverVetData[1]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverVetData[4]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={receiverVetData[5]} fetching={receiversFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerVetData[1]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerVetData[4]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerVetData[5]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerVetData[8]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={blockerVetData[9]} fetching={blockersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid sx={{ pb: 0 }} size={12}>
            <Divider variant='middle'>
              <Typography variant='h6'>Defense</Typography>
            </Divider>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Rookie</Typography>
              </Divider>
              <AllStarTeamPlayer player={defenderRookieData[2]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[3]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[6]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[7]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[11]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[12]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[13]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[16]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[17]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[20]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderRookieData[21]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Sophomore</Typography>
              </Divider>
              <AllStarTeamPlayer player={defenderSophData[2]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[3]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[6]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[7]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[11]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[12]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[13]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[16]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[17]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[20]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderSophData[21]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Professional</Typography>
              </Divider>
              <AllStarTeamPlayer player={defenderProData[2]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[3]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[6]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[7]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[11]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[12]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[13]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[16]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[17]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[20]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderProData[21]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Veteran</Typography>
              </Divider>
              <AllStarTeamPlayer player={defenderVetData[2]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[3]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[6]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[7]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[11]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[12]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[13]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[16]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[17]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[20]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={defenderVetData[21]} fetching={defendersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid sx={{ pb: 0 }} size={12}>
            <Divider variant='middle'>
              <Typography variant='h6'>Special Teams</Typography>
            </Divider>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Rookie</Typography>
              </Divider>
              <AllStarTeamPlayer player={kickerRookieData[1]} fetching={kickersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={punterRookieData[1]} fetching={puntersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={returnerRookieData[1]} fetching={returnersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Sophomore</Typography>
              </Divider>
              <AllStarTeamPlayer player={kickerSophData[1]} fetching={kickersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={punterSophData[1]} fetching={puntersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={returnerSophData[1]} fetching={returnersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Professional</Typography>
              </Divider>
              <AllStarTeamPlayer player={kickerProData[1]} fetching={kickersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={punterProData[1]} fetching={puntersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={returnerProData[1]} fetching={returnersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6,
              xl: 3,
            }}
          >
            <Stack spacing={{ xs: 0.5 }}>
              <Divider variant='middle' textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant='h6'>Veteran</Typography>
              </Divider>
              <AllStarTeamPlayer player={kickerVetData[1]} fetching={kickersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={punterVetData[1]} fetching={puntersFetching} gamesPlayed={gamesPlayed} />
              <AllStarTeamPlayer player={returnerVetData[1]} fetching={returnersFetching} gamesPlayed={gamesPlayed} />
            </Stack>
          </Grid>
        </>
      )}
    </Grid>
  );
}
