'use client';

import { useEffect, useState, use } from 'react';
import {
  Container,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { PlayerData } from '@/app/players/playerData';
import { getRankColor } from '@/app/helpers';
import {
  getBlockingGmRating,
  getDefensiveGmRating,
  getKickingGmRating,
  getPassingGmRating,
  getReceivingGmRating,
  getRushingGmRating,
} from '@/app/stats/statCalculations';

const combinePlayerData = (...objects: any): any => {
  return objects.reduce((acc: any, obj: any) => {
    if (!obj) return acc;
    const key = Object.keys(obj)[0];
    return { ...acc, [key]: obj[key] };
  }, {});
};

const THRESHOLDS = {
  PASS_ATTEMPTS: 10.0,
  CARRIES: 5.0,
  RECEPTIONS: 1.0,
  BLOCKER_PLAYS: 20.0,
  FG_ATTEMPTS: 0.5,
  PUNTS: 0.5,
  RETURNS: 0.5,
  DEFENSIVE_GAMES_PLAYED: 0.75,
};

export default function TeamDetails(props: { params: Promise<{ playerId: string }> }) {
  const params = use(props.params);
  const [tierData, setTierData] = useState<any>();
  const [playerData, setPlayerData] = useState<any>();
  const [genericPlayerData, setGenericPlayerData] = useState<PlayerData>();
  const [gamesPlayed, setGamesPlayed] = useState<number>(1);

  const fetchData = async () => {
    const [passRes, rushRes, receivingRes, blockingRes, defensiveRes, kickingRes, puntingRes, returningRes] = await Promise.all([
      fetch('/api/passing'),
      fetch('/api/rushing'),
      fetch('/api/receiving'),
      fetch('/api/blocking'),
      fetch('/api/defensive'),
      fetch('/api/kicking'),
      fetch('/api/punting'),
      fetch('/api/returning'),
    ]);
    const [passData, rushData, receivingData, blockingData, defensiveData, kickingData, puntingData, returningData] = await Promise.all([
      passRes.json(),
      rushRes.json(),
      receivingRes.json(),
      blockingRes.json(),
      defensiveRes.json(),
      kickingRes.json(),
      puntingRes.json(),
      returningRes.json(),
    ]);
    const passing = passData.find((x: PlayerData) => x.player_id === +params.playerId);
    const rushing = rushData.find((x: PlayerData) => x.player_id === +params.playerId);
    const receiving = receivingData.find((x: PlayerData) => x.player_id === +params.playerId);
    const blocking = blockingData.find((x: PlayerData) => x.player_id === +params.playerId);
    const defensive = defensiveData.find((x: PlayerData) => x.player_id === +params.playerId);
    const kicking = kickingData.find((x: PlayerData) => x.player_id === +params.playerId);
    const punting = puntingData.find((x: PlayerData) => x.player_id === +params.playerId);
    const returning = returningData.find((x: PlayerData) => x.player_id === +params.playerId);

    const gamesPlayed = Math.max(...passData.map((x: PlayerData) => x.games_played));
    setGamesPlayed(gamesPlayed);

    const currentPlayerData = combinePlayerData(
      { passing: passing },
      { rushing: rushing },
      { receiving: receiving },
      { blocking: blocking },
      { defensive: defensive },
      { kicking: kicking },
      { punting: punting },
      { returning: returning }
    );
    const tierPlayerData = combinePlayerData(
      { passing: passData.filter((x: any) => x.tier === passing?.tier && x.attempts >= THRESHOLDS.PASS_ATTEMPTS * +x.games_played) },
      {
        rushing: rushData.filter((x: any) => x.tier === rushing?.tier && x.rushes >= THRESHOLDS.CARRIES * +x.games_played && x.position === rushing?.position),
      },
      {
        receiving: receivingData.filter(
          (x: any) => x.tier === receiving?.tier && x.receptions >= THRESHOLDS.RECEPTIONS * +x.games_played && x.position === receiving?.position
        ),
      },
      { blocking: blockingData.filter((x: any) => x.tier === blocking?.tier && x.plays >= THRESHOLDS.BLOCKER_PLAYS * gamesPlayed) },
      {
        defensive: defensiveData.filter(
          (x: any) => x.tier === defensive?.tier && x.games_played / gamesPlayed >= THRESHOLDS.DEFENSIVE_GAMES_PLAYED && x.position === defensive?.position
        ),
      },
      { kicking: kickingData.filter((x: any) => x.tier === kicking?.tier && x.fg_attempts >= THRESHOLDS.FG_ATTEMPTS * +x.games_played) },
      { punting: puntingData.filter((x: any) => x.tier === punting?.tier && x.punts >= THRESHOLDS.PUNTS * +x.games_played) },
      { returning: returningData.filter((x: any) => x.tier === returning?.tier && x.prs + x.krs >= THRESHOLDS.RETURNS * +x.games_played) }
    );

    setPlayerData(currentPlayerData);
    setGenericPlayerData(
      currentPlayerData.passing ??
        currentPlayerData.rushing ??
        currentPlayerData.receiving ??
        currentPlayerData.blocking ??
        currentPlayerData.defensive ??
        currentPlayerData.kicking ??
        currentPlayerData.punting ??
        currentPlayerData.returning
    );
    setTierData(tierPlayerData);
  };

  const formatWithOrdinal = (number: number): string => {
    const ordinals = ['th', 'st', 'nd', 'rd'];
    const lastTwoDigits = number % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return number + 'th';
    const lastDigit = number % 10;
    const ordinalSuffix = ordinals[lastDigit] || 'th';
    return number + ordinalSuffix;
  };

  const sortTierData = (stat: string) => {
    if (!genericPlayerData || !tierData) return [];
    switch (stat) {
      case 'passing_yards':
        return [...tierData.passing].map((x) => ({ player_id: x.player_id, sortValue: x.yards })).sort((a, b) => b.sortValue - a.sortValue);
      case 'passing_yards_per_game':
        return [...tierData.passing]
          .map((x) => ({ player_id: x.player_id, sortValue: x.yards / genericPlayerData.games_played }))
          .sort((a, b) => b.sortValue - a.sortValue);
      case 'passing_yards_per_attempt':
        return [...tierData.passing].map((x) => ({ player_id: x.player_id, sortValue: x.yards / x.attempts })).sort((a, b) => b.sortValue - a.sortValue);
      case 'passing_attempts':
        return [...tierData.passing].map((x) => ({ player_id: x.player_id, sortValue: x.attempts })).sort((a, b) => b.sortValue - a.sortValue);
      case 'passing_completions':
        return [...tierData.passing].map((x) => ({ player_id: x.player_id, sortValue: x.completions })).sort((a, b) => b.sortValue - a.sortValue);
      case 'passing_completion_percentage':
        return [...tierData.passing].map((x) => ({ player_id: x.player_id, sortValue: x.completion_percentage })).sort((a, b) => b.sortValue - a.sortValue);
      case 'passing_touchdowns':
        return [...tierData.passing].map((x) => ({ player_id: x.player_id, sortValue: x.touchdowns })).sort((a, b) => b.sortValue - a.sortValue);
      case 'passing_touchdowns_per_attempt':
        return [...tierData.passing].map((x) => ({ player_id: x.player_id, sortValue: x.touchdowns / x.attempts })).sort((a, b) => b.sortValue - a.sortValue);
      case 'passing_interceptions':
        return [...tierData.passing].map((x) => ({ player_id: x.player_id, sortValue: x.interceptions })).sort((a, b) => a.sortValue - b.sortValue);
      case 'passing_interceptions_per_attempt':
        return [...tierData.passing]
          .map((x) => ({ player_id: x.player_id, sortValue: x.interceptions / x.attempts }))
          .sort((a, b) => a.sortValue - b.sortValue);
      case 'passing_touchdowns_to_interceptions':
        return [...tierData.passing]
          .map((x) => ({ player_id: x.player_id, sortValue: x.touchdowns / x.interceptions }))
          .sort((a, b) => b.sortValue - a.sortValue);
      case 'passing_sacks':
        return [...tierData.passing].map((x) => ({ player_id: x.player_id, sortValue: x.sacks })).sort((a, b) => a.sortValue - b.sortValue);
      case 'passing_sacks_per_dropback':
        return [...tierData.passing]
          .map((x) => ({ player_id: x.player_id, sortValue: x.sacks / (x.sacks + x.attempts) }))
          .sort((a, b) => a.sortValue - b.sortValue);
      case 'passing_hurries':
        return [...tierData.passing].map((x) => ({ player_id: x.player_id, sortValue: x.hurries })).sort((a, b) => a.sortValue - b.sortValue);
      case 'passing_hurries_per_attempt':
        return [...tierData.passing].map((x) => ({ player_id: x.player_id, sortValue: x.hurries / x.attempts })).sort((a, b) => a.sortValue - b.sortValue);
      case 'passing_gm_rating':
        return [...tierData.passing].map((x) => ({ player_id: x.player_id, sortValue: getPassingGmRating(x) })).sort((a, b) => b.sortValue - a.sortValue);
      case 'rushing_yards':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: x.yards })).sort((a, b) => b.sortValue - a.sortValue);
      case 'rushing_yards_per_game':
        return [...tierData.rushing]
          .map((x) => ({ player_id: x.player_id, sortValue: x.yards / genericPlayerData.games_played }))
          .sort((a, b) => b.sortValue - a.sortValue);
      case 'rushing_yards_per_carry':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: x.yards / x.rushes })).sort((a, b) => b.sortValue - a.sortValue);
      case 'rushing_touchdowns':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: x.touchdowns })).sort((a, b) => b.sortValue - a.sortValue);
      case 'rushing_touchdowns_per_carry':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: x.touchdowns / x.rushes })).sort((a, b) => b.sortValue - a.sortValue);
      case 'rushing_broken_tackles':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: x.broken_tackles })).sort((a, b) => b.sortValue - a.sortValue);
      case 'rushing_broken_tackles_per_carry':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: x.broken_tackles / x.rushes })).sort((a, b) => b.sortValue - a.sortValue);
      case 'rushing_yards_after_contact':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: x.yards_after_contact })).sort((a, b) => b.sortValue - a.sortValue);
      case 'rushing_tackles_for_loss':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: x.tackles_for_loss })).sort((a, b) => a.sortValue - b.sortValue);
      case 'rushing_tackles_for_loss_per_carry':
        return [...tierData.rushing]
          .map((x) => ({ player_id: x.player_id, sortValue: x.tackles_for_loss / x.rushes }))
          .sort((a, b) => a.sortValue - b.sortValue);
      case 'rushing_fumbles':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: x.fumbles })).sort((a, b) => a.sortValue - b.sortValue);
      case 'rushing_fumbles_per_carry':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: x.fumbles / x.rushes })).sort((a, b) => a.sortValue - b.sortValue);
      case 'rushing_fumbles_lost':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: x.fumbles_lost })).sort((a, b) => a.sortValue - b.sortValue);
      case 'rushing_fumbles_lost_per_carry':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: x.fumbles_lost / x.rushes })).sort((a, b) => a.sortValue - b.sortValue);
      case 'rushing_gm_rating':
        return [...tierData.rushing].map((x) => ({ player_id: x.player_id, sortValue: getRushingGmRating(x) })).sort((a, b) => b.sortValue - a.sortValue);
      case 'receiving_yards':
        return [...tierData.receiving].map((x) => ({ player_id: x.player_id, sortValue: x.yards })).sort((a, b) => b.sortValue - a.sortValue);
      case 'receiving_yards_per_reception':
        return [...tierData.receiving].map((x) => ({ player_id: x.player_id, sortValue: x.yards / x.receptions })).sort((a, b) => b.sortValue - a.sortValue);
      case 'receiving_touchdowns':
        return [...tierData.receiving].map((x) => ({ player_id: x.player_id, sortValue: x.touchdowns })).sort((a, b) => b.sortValue - a.sortValue);
      case 'receiving_touchdowns_per_reception':
        return [...tierData.receiving]
          .map((x) => ({ player_id: x.player_id, sortValue: x.touchdowns / x.receptions }))
          .sort((a, b) => b.sortValue - a.sortValue);
      case 'receiving_yards_after_catch':
        return [...tierData.receiving]
          .map((x) => ({ player_id: x.player_id, sortValue: x.yards_after_catch / x.receptions }))
          .sort((a, b) => b.sortValue - a.sortValue);
      case 'receiving_targets':
        return [...tierData.receiving].map((x) => ({ player_id: x.player_id, sortValue: x.targets })).sort((a, b) => b.sortValue - a.sortValue);
      case 'receiving_receptions':
        return [...tierData.receiving].map((x) => ({ player_id: x.player_id, sortValue: x.receptions })).sort((a, b) => b.sortValue - a.sortValue);
      case 'receiving_drops':
        return [...tierData.receiving].map((x) => ({ player_id: x.player_id, sortValue: x.drops })).sort((a, b) => a.sortValue - b.sortValue);
      case 'receiving_drops_per_target':
        return [...tierData.receiving].map((x) => ({ player_id: x.player_id, sortValue: x.drops / x.targets })).sort((a, b) => a.sortValue - b.sortValue);
      case 'receiving_fumbles':
        return [...tierData.receiving].map((x) => ({ player_id: x.player_id, sortValue: x.fumbles })).sort((a, b) => a.sortValue - b.sortValue);
      case 'receiving_fumbles_per_reception':
        return [...tierData.receiving].map((x) => ({ player_id: x.player_id, sortValue: x.fumbles / x.receptions })).sort((a, b) => a.sortValue - b.sortValue);
      case 'receiving_fumbles_lost':
        return [...tierData.receiving].map((x) => ({ player_id: x.player_id, sortValue: x.fumbles_lost })).sort((a, b) => a.sortValue - b.sortValue);
      case 'receiving_fumbles_lost_per_reception':
        return [...tierData.receiving]
          .map((x) => ({ player_id: x.player_id, sortValue: x.fumbles_lost / x.receptions }))
          .sort((a, b) => a.sortValue - b.sortValue);
      case 'receiving_gm_rating':
        return [...tierData.receiving].map((x) => ({ player_id: x.player_id, sortValue: getReceivingGmRating(x) })).sort((a, b) => b.sortValue - a.sortValue);
      case 'defensive_tackles':
        return [...tierData.defensive].map((x) => ({ player_id: x.player_id, sortValue: x.tackles })).sort((a, b) => b.sortValue - a.sortValue);
      case 'defensive_missed_tackles':
        return [...tierData.defensive].map((x) => ({ player_id: x.player_id, sortValue: x.missed_tackles })).sort((a, b) => a.sortValue - b.sortValue);
      case 'defensive_tackle_percentage':
        return [...tierData.defensive]
          .map((x) => ({ player_id: x.player_id, sortValue: x.tackles / (x.tackles + x.missed_tackles) }))
          .sort((a, b) => b.sortValue - a.sortValue);
      case 'defensive_sticks':
        return [...tierData.defensive].map((x) => ({ player_id: x.player_id, sortValue: x.sticks })).sort((a, b) => b.sortValue - a.sortValue);
      case 'defensive_stick_percentage':
        return [...tierData.defensive].map((x) => ({ player_id: x.player_id, sortValue: x.sticks / x.tackles })).sort((a, b) => b.sortValue - a.sortValue);
      case 'defensive_sacks':
        return [...tierData.defensive].map((x) => ({ player_id: x.player_id, sortValue: x.sacks })).sort((a, b) => b.sortValue - a.sortValue);
      case 'defensive_interceptions':
        return [...tierData.defensive].map((x) => ({ player_id: x.player_id, sortValue: x.interceptions })).sort((a, b) => b.sortValue - a.sortValue);
      case 'defensive_gm_rating':
        return [...tierData.defensive].map((x) => ({ player_id: x.player_id, sortValue: getDefensiveGmRating(x) })).sort((a, b) => b.sortValue - a.sortValue);
      case 'blocking_pancakes':
        return [...tierData.blocking].map((x) => ({ player_id: x.player_id, sortValue: x.pancakes })).sort((a, b) => b.sortValue - a.sortValue);
      case 'blocking_reverse_pancaked':
        return [...tierData.blocking].map((x) => ({ player_id: x.player_id, sortValue: x.reverse_pancaked })).sort((a, b) => a.sortValue - b.sortValue);
      case 'blocking_hurries_allowed':
        return [...tierData.blocking].map((x) => ({ player_id: x.player_id, sortValue: x.hurries_allowed })).sort((a, b) => a.sortValue - b.sortValue);
      case 'blocking_sacks_allowed':
        return [...tierData.blocking].map((x) => ({ player_id: x.player_id, sortValue: x.sacks_allowed })).sort((a, b) => a.sortValue - b.sortValue);
      case 'blocking_gm_rating':
        return [...tierData.blocking].map((x) => ({ player_id: x.player_id, sortValue: getBlockingGmRating(x) })).sort((a, b) => b.sortValue - a.sortValue);
      case 'kicking_fg_attempts':
        return [...tierData.kicking].map((x) => ({ player_id: x.player_id, sortValue: x.fg_attempts })).sort((a, b) => b.sortValue - a.sortValue);
      case 'kicking_fg_made':
        return [...tierData.kicking].map((x) => ({ player_id: x.player_id, sortValue: x.fg_made })).sort((a, b) => b.sortValue - a.sortValue);
      case 'kicking_fg_percentage':
        return [...tierData.kicking].map((x) => ({ player_id: x.player_id, sortValue: x.fg_made / x.fg_attempts })).sort((a, b) => b.sortValue - a.sortValue);
      case 'kicking_50_attempts':
        return [...tierData.kicking].map((x) => ({ player_id: x.player_id, sortValue: x.fifty_plus_attempts })).sort((a, b) => b.sortValue - a.sortValue);
      case 'kicking_50_made':
        return [...tierData.kicking].map((x) => ({ player_id: x.player_id, sortValue: x.fifty_plus_made })).sort((a, b) => b.sortValue - a.sortValue);
      case 'kicking_touchbacks':
        return [...tierData.kicking].map((x) => ({ player_id: x.player_id, sortValue: x.touchbacks })).sort((a, b) => b.sortValue - a.sortValue);
      case 'kicking_kickoffs':
        return [...tierData.kicking].map((x) => ({ player_id: x.player_id, sortValue: x.kickoffs })).sort((a, b) => b.sortValue - a.sortValue);
      case 'kicking_touchback_ratio':
        return [...tierData.kicking].map((x) => ({ player_id: x.player_id, sortValue: x.touchbacks / x.kickoffs })).sort((a, b) => b.sortValue - a.sortValue);
      case 'kicking_gm_rating':
        return [...tierData.kicking].map((x) => ({ player_id: x.player_id, sortValue: getKickingGmRating(x) })).sort((a, b) => b.sortValue - a.sortValue);
      case 'punting_punts':
        return [...tierData.punting].map((x) => ({ player_id: x.player_id, sortValue: x.punts })).sort((a, b) => b.sortValue - a.sortValue);
      case 'punting_average':
        return [...tierData.punting].map((x) => ({ player_id: x.player_id, sortValue: x.average })).sort((a, b) => b.sortValue - a.sortValue);
      case 'punting_hangtime':
        return [...tierData.punting].map((x) => ({ player_id: x.player_id, sortValue: x.hangtime })).sort((a, b) => b.sortValue - a.sortValue);
      case 'punting_inside_twenty':
        return [...tierData.punting].map((x) => ({ player_id: x.player_id, sortValue: x.inside_twenty })).sort((a, b) => b.sortValue - a.sortValue);
      case 'returning_kr_yards':
        return [...tierData.returning].map((x) => ({ player_id: x.player_id, sortValue: x.kr_yards })).sort((a, b) => b.sortValue - a.sortValue);
      case 'returning_kr_yards_per_return':
        return [...tierData.returning].map((x) => ({ player_id: x.player_id, sortValue: x.kr_yards / x.krs })).sort((a, b) => b.sortValue - a.sortValue);
      case 'returning_kr_touchdowns':
        return [...tierData.returning].map((x) => ({ player_id: x.player_id, sortValue: x.kr_touchdowns })).sort((a, b) => b.sortValue - a.sortValue);
      case 'returning_pr_yards':
        return [...tierData.returning].map((x) => ({ player_id: x.player_id, sortValue: x.pr_yards })).sort((a, b) => b.sortValue - a.sortValue);
      case 'returning_pr_yards_per_return':
        return [...tierData.returning].map((x) => ({ player_id: x.player_id, sortValue: x.pr_yards / x.prs })).sort((a, b) => b.sortValue - a.sortValue);
      case 'returning_pr_touchdowns':
        return [...tierData.returning].map((x) => ({ player_id: x.player_id, sortValue: x.pr_touchdowns })).sort((a, b) => b.sortValue - a.sortValue);
      case 'returning_total_touchdowns':
        return [...tierData.returning]
          .map((x) => ({ player_id: x.player_id, sortValue: x.kr_touchdowns + x.pr_touchdowns }))
          .sort((a, b) => b.sortValue - a.sortValue);
      default:
        return null;
    }
  };

  const getTierRank = (stat: string): string => {
    if (!genericPlayerData || !tierData) return 'N/A';
    const sortedTier = sortTierData(stat);
    if (!sortedTier) return 'N/A';
    let rank = 1;
    let previousSortValue = null;
    for (let i = 0; i <= sortedTier.length; i++) {
      const { player_id, sortValue } = sortedTier[i];
      if (sortValue !== previousSortValue) rank = i + 1;
      if (player_id === genericPlayerData.player_id) return formatWithOrdinal(rank);
      previousSortValue = sortValue;
    }
    return 'N/A';
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth='xl'>
      {!genericPlayerData && !playerData && <LinearProgress sx={{ borderRadius: 2 }} />}
      {genericPlayerData && playerData && (
        <Grid container rowSpacing={2} columnSpacing={2} sx={{ mb: 1 }}>
          <Grid size={12}>
            <Stack spacing={-0.5}>
              <Typography variant='h5'>{genericPlayerData.player_name}</Typography>
              <Typography variant='caption'>
                {genericPlayerData.position} - {genericPlayerData.tier}
              </Typography>
              <Typography variant='caption'>Team: {genericPlayerData.team_name}</Typography>
              <Link href={`https://glb2.warriorgeneral.com/game/player/${params.playerId}`} target='_blank' style={{ color: 'inherit' }}>
                <Typography variant='caption'>GLB2 Link</Typography>
              </Link>
            </Stack>
          </Grid>
          {playerData.passing && playerData.passing.attempts >= THRESHOLDS.PASS_ATTEMPTS * genericPlayerData.games_played && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TableContainer component={Paper}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Passing</TableCell>
                      <TableCell />
                      <TableCell>Tier [{tierData.passing.length}*]</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Yards</TableCell>
                      <TableCell>{playerData.passing.yards}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_yards'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_yards')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Yards Per Game</TableCell>
                      <TableCell>{(playerData.passing.yards / genericPlayerData.games_played).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_yards_per_game'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_yards_per_game')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Yards Per Attempt</TableCell>
                      <TableCell>{(playerData.passing.yards / playerData.passing.attempts).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_yards_per_attempt'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_yards_per_attempt')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Attempts</TableCell>
                      <TableCell>{playerData.passing.attempts}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_attempts'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_attempts')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Completions</TableCell>
                      <TableCell>{playerData.passing.completions}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_completions'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_completions')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Completion %</TableCell>
                      <TableCell>{playerData.passing.completion_percentage}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_completion_percentage'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_completion_percentage')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Touchdowns</TableCell>
                      <TableCell>{playerData.passing.touchdowns}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_touchdowns'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_touchdowns')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>TDs Per Attempt</TableCell>
                      <TableCell>{(playerData.passing.touchdowns / playerData.passing.attempts).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_touchdowns_per_attempt'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_touchdowns_per_attempt')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Interceptions</TableCell>
                      <TableCell>{playerData.passing.interceptions}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_interceptions'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_interceptions')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>INTs Per Attempt</TableCell>
                      <TableCell>{(playerData.passing.interceptions / playerData.passing.attempts).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_interceptions_per_attempt'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_interceptions_per_attempt')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>TD/Int Ratio</TableCell>
                      <TableCell>{(playerData.passing.touchdowns / playerData.passing.interceptions).toFixed(1)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_touchdowns_to_interceptions'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_touchdowns_to_interceptions')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sacks</TableCell>
                      <TableCell>{playerData.passing.sacks}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_sacks'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_sacks')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sacks Per Dropback</TableCell>
                      <TableCell>{(playerData.passing.sacks / (playerData.passing.sacks + playerData.passing.attempts)).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_sacks_per_dropback'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_sacks_per_dropback')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Hurries</TableCell>
                      <TableCell>{playerData.passing.hurries}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_hurries'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_hurries')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Hurries Per Attempt</TableCell>
                      <TableCell>{(playerData.passing.hurries / playerData.passing.attempts).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('passing_hurries_per_attempt'), tierData.passing.length, 'asc') }}>
                        {getTierRank('passing_hurries_per_attempt')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} align='right'>
                        * Eligible {genericPlayerData.position}: {THRESHOLDS.PASS_ATTEMPTS} attempts per game played
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          )}
          {playerData.rushing && playerData.rushing.rushes >= THRESHOLDS.CARRIES * genericPlayerData.games_played && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TableContainer component={Paper}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rushing</TableCell>
                      <TableCell />
                      <TableCell>Tier [{tierData.rushing.length}*]</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Yards</TableCell>
                      <TableCell>{playerData.rushing.yards}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_yards'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_yards')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Yards Per Game</TableCell>
                      <TableCell>{(playerData.rushing.yards / genericPlayerData.games_played).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_yards_per_game'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_yards_per_game')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Yards Per Carry</TableCell>
                      <TableCell>{(playerData.rushing.yards / playerData.rushing.rushes).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_yards_per_carry'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_yards_per_carry')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Touchdowns</TableCell>
                      <TableCell>{playerData.rushing.touchdowns}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_touchdowns'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_touchdowns')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>TDs Per Carry</TableCell>
                      <TableCell>{(playerData.rushing.touchdowns / playerData.rushing.rushes).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_touchdowns_per_carry'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_touchdowns_per_carry')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Broken Tackles</TableCell>
                      <TableCell>{playerData.rushing.broken_tackles}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_broken_tackles'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_broken_tackles')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>BTK Per Carry</TableCell>
                      <TableCell>{(playerData.rushing.broken_tackles / playerData.rushing.rushes).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_broken_tackles_per_carry'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_broken_tackles_per_carry')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Yards After Contact</TableCell>
                      <TableCell>{playerData.rushing.yards_after_contact}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_yards_after_contact'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_yards_after_contact')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tackles For Loss</TableCell>
                      <TableCell>{playerData.rushing.tackles_for_loss}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_tackles_for_loss'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_tackles_for_loss')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>TFL Per Carry</TableCell>
                      <TableCell>{(playerData.rushing.tackles_for_loss / playerData.rushing.rushes).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_tackles_for_loss_per_carry'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_tackles_for_loss_per_carry')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fumbles</TableCell>
                      <TableCell>{playerData.rushing.fumbles}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_fumbles'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_fumbles')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fumbles Per Carry</TableCell>
                      <TableCell>{(playerData.rushing.fumbles / playerData.rushing.rushes).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_fumbles_per_carry'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_fumbles_per_carry')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fumbles Lost</TableCell>
                      <TableCell>{playerData.rushing.fumbles_lost}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_fumbles_lost'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_fumbles_lost')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>FL Per Carry</TableCell>
                      <TableCell>{(playerData.rushing.fumbles_lost / playerData.rushing.rushes).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('rushing_fumbles_lost_per_carry'), tierData.rushing.length, 'asc') }}>
                        {getTierRank('rushing_fumbles_lost_per_carry')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} align='right'>
                        * Eligible {genericPlayerData.position}: {THRESHOLDS.CARRIES} carries per game played
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          )}
          {playerData.receiving && playerData.receiving.receptions >= THRESHOLDS.RECEPTIONS * genericPlayerData.games_played && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TableContainer component={Paper}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Receiving</TableCell>
                      <TableCell />
                      <TableCell>Tier [{tierData.receiving.length}*]</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Yards</TableCell>
                      <TableCell>{playerData.receiving.yards}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('receiving_yards'), tierData.receiving.length, 'asc') }}>
                        {getTierRank('receiving_yards')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Yards Per Reception</TableCell>
                      <TableCell>{(playerData.receiving.yards / playerData.receiving.receptions).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('receiving_yards_per_reception'), tierData.receiving.length, 'asc') }}>
                        {getTierRank('receiving_yards_per_reception')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Touchdowns</TableCell>
                      <TableCell>{playerData.receiving.touchdowns}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('receiving_touchdowns'), tierData.receiving.length, 'asc') }}>
                        {getTierRank('receiving_touchdowns')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>TDs Per Reception</TableCell>
                      <TableCell>{(playerData.receiving.touchdowns / playerData.receiving.receptions).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('receiving_touchdowns_per_reception'), tierData.receiving.length, 'asc') }}>
                        {getTierRank('receiving_touchdowns_per_reception')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Yards After Catch</TableCell>
                      <TableCell>{(playerData.receiving.yards_after_catch / playerData.receiving.receptions).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('receiving_yards_after_catch'), tierData.receiving.length, 'asc') }}>
                        {getTierRank('receiving_yards_after_catch')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Receptions</TableCell>
                      <TableCell>{playerData.receiving.receptions}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('receiving_receptions'), tierData.receiving.length, 'asc') }}>
                        {getTierRank('receiving_receptions')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Targets</TableCell>
                      <TableCell>{playerData.receiving.targets}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('receiving_targets'), tierData.receiving.length, 'asc') }}>
                        {getTierRank('receiving_targets')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Drops</TableCell>
                      <TableCell>{playerData.receiving.drops}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('receiving_drops'), tierData.receiving.length, 'asc') }}>
                        {getTierRank('receiving_drops')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Drops Per Target</TableCell>
                      <TableCell>{(playerData.receiving.drops / playerData.receiving.targets).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('receiving_drops_per_target'), tierData.receiving.length, 'asc') }}>
                        {getTierRank('receiving_drops_per_target')}
                      </TableCell>
                    </TableRow>
                    {!playerData.rushing && (
                      <>
                        <TableRow>
                          <TableCell>Fumbles</TableCell>
                          <TableCell>{playerData.receiving.fumbles}</TableCell>
                          <TableCell sx={{ color: getRankColor(getTierRank('receiving_fumbles'), tierData.receiving.length, 'asc') }}>
                            {getTierRank('receiving_fumbles')}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Fumbles Per Reception</TableCell>
                          <TableCell>{(playerData.receiving.fumbles / playerData.receiving.receptions).toFixed(2)}</TableCell>
                          <TableCell sx={{ color: getRankColor(getTierRank('receiving_fumbles_per_reception'), tierData.receiving.length, 'asc') }}>
                            {getTierRank('receiving_fumbles_per_reception')}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Fumbles Lost</TableCell>
                          <TableCell>{playerData.receiving.fumbles_lost}</TableCell>
                          <TableCell sx={{ color: getRankColor(getTierRank('receiving_fumbles_lost'), tierData.receiving.length, 'asc') }}>
                            {getTierRank('receiving_fumbles_lost')}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>FL Per Reception</TableCell>
                          <TableCell>{(playerData.receiving.fumbles_lost / playerData.receiving.receptions).toFixed(2)}</TableCell>
                          <TableCell sx={{ color: getRankColor(getTierRank('receiving_fumbles_lost_per_reception'), tierData.receiving.length, 'asc') }}>
                            {getTierRank('receiving_fumbles_lost_per_reception')}
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} align='right'>
                        * Eligible {genericPlayerData.position}: {THRESHOLDS.RECEPTIONS} reception per game played
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          )}
          {playerData.defensive && genericPlayerData.games_played / gamesPlayed >= THRESHOLDS.DEFENSIVE_GAMES_PLAYED && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TableContainer component={Paper}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Defensive</TableCell>
                      <TableCell />
                      <TableCell>Tier [{tierData.defensive.length}*]</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Tackles</TableCell>
                      <TableCell>{playerData.defensive.tackles}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('defensive_tackles'), tierData.defensive.length, 'asc') }}>
                        {getTierRank('defensive_tackles')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Missed Tackles</TableCell>
                      <TableCell>{playerData.defensive.missed_tackles}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('defensive_missed_tackles'), tierData.defensive.length, 'asc') }}>
                        {getTierRank('defensive_missed_tackles')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tackle %</TableCell>
                      <TableCell>
                        {((playerData.defensive.tackles / (playerData.defensive.tackles + playerData.defensive.missed_tackles)) * 100.0).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('defensive_tackle_percentage'), tierData.defensive.length, 'asc') }}>
                        {getTierRank('defensive_tackle_percentage')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sticks</TableCell>
                      <TableCell>{playerData.defensive.sticks}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('defensive_sticks'), tierData.defensive.length, 'asc') }}>
                        {getTierRank('defensive_sticks')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Stick %</TableCell>
                      <TableCell>{((playerData.defensive.sticks / playerData.defensive.tackles) * 100.0).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('defensive_stick_percentage'), tierData.defensive.length, 'asc') }}>
                        {getTierRank('defensive_stick_percentage')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sacks</TableCell>
                      <TableCell>{playerData.defensive.sacks}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('defensive_sacks'), tierData.defensive.length, 'asc') }}>
                        {getTierRank('defensive_sacks')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Interceptions</TableCell>
                      <TableCell>{playerData.defensive.interceptions}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('defensive_interceptions'), tierData.defensive.length, 'asc') }}>
                        {getTierRank('defensive_interceptions')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} align='right'>
                        * Eligible {genericPlayerData.position}: played {THRESHOLDS.DEFENSIVE_GAMES_PLAYED * 100.0}% of team games
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          )}
          {playerData.blocking && playerData.blocking.plays >= THRESHOLDS.BLOCKER_PLAYS * genericPlayerData.games_played && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TableContainer component={Paper}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Blocking</TableCell>
                      <TableCell />
                      <TableCell>Tier [{tierData.blocking.length}*]</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Pancakes</TableCell>
                      <TableCell>{playerData.blocking.pancakes}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('blocking_pancakes'), tierData.blocking.length, 'asc') }}>
                        {getTierRank('blocking_pancakes')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Rev Caked</TableCell>
                      <TableCell>{playerData.blocking.reverse_pancaked}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('blocking_reverse_pancaked'), tierData.blocking.length, 'asc') }}>
                        {getTierRank('blocking_reverse_pancaked')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sacks Allowed</TableCell>
                      <TableCell>{playerData.blocking.sacks_allowed}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('blocking_sacks_allowed'), tierData.blocking.length, 'asc') }}>
                        {getTierRank('blocking_sacks_allowed')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Hurries Allowed</TableCell>
                      <TableCell>{playerData.blocking.hurries_allowed}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('blocking_hurries_allowed'), tierData.blocking.length, 'asc') }}>
                        {getTierRank('blocking_hurries_allowed')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} align='right'>
                        * Eligible {genericPlayerData.position}: {THRESHOLDS.BLOCKER_PLAYS} plays per game played
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          )}
          {playerData.kicking && playerData.kicking.fg_attempts >= THRESHOLDS.FG_ATTEMPTS * genericPlayerData.games_played && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TableContainer component={Paper}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Kicking</TableCell>
                      <TableCell />
                      <TableCell>Tier [{tierData.kicking.length}*]</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>FG Made</TableCell>
                      <TableCell>{playerData.kicking.fg_made}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('kicking_fg_made'), tierData.kicking.length, 'asc') }}>
                        {getTierRank('kicking_fg_made')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>FG Attempts</TableCell>
                      <TableCell>{playerData.kicking.fg_attempts}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('kicking_fg_attempts'), tierData.kicking.length, 'asc') }}>
                        {getTierRank('kicking_fg_attempts')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>FG %</TableCell>
                      <TableCell>{((playerData.kicking.fg_made / playerData.kicking.fg_attempts) * 100.0).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('kicking_fg_percentage'), tierData.kicking.length, 'asc') }}>
                        {getTierRank('kicking_fg_percentage')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>50+ Made</TableCell>
                      <TableCell>{playerData.kicking.fifty_plus_made}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('kicking_50_made'), tierData.kicking.length, 'asc') }}>
                        {getTierRank('kicking_50_made')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>50+ Attempts</TableCell>
                      <TableCell>{playerData.kicking.fifty_plus_attempts}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('kicking_50_attempts'), tierData.kicking.length, 'asc') }}>
                        {getTierRank('kicking_50_attempts')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Touchbacks</TableCell>
                      <TableCell>{playerData.kicking.touchbacks}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('kicking_touchbacks'), tierData.kicking.length, 'asc') }}>
                        {getTierRank('kicking_touchbacks')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Kickoffs</TableCell>
                      <TableCell>{playerData.kicking.kickoffs}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('kicking_kickoffs'), tierData.kicking.length, 'asc') }}>
                        {getTierRank('kicking_kickoffs')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Touchback %</TableCell>
                      <TableCell>{((playerData.kicking.touchbacks / playerData.kicking.kickoffs) * 100.0).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('kicking_touchback_ratio'), tierData.kicking.length, 'asc') }}>
                        {getTierRank('kicking_touchback_ratio')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} align='right'>
                        * Eligible {genericPlayerData.position}: {THRESHOLDS.FG_ATTEMPTS} attempts per game played
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          )}
          {playerData.punting && playerData.punting.punts >= THRESHOLDS.PUNTS * genericPlayerData.games_played && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TableContainer component={Paper}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Punting</TableCell>
                      <TableCell />
                      <TableCell>Tier [{tierData.punting.length}*]</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Punts</TableCell>
                      <TableCell>{playerData.punting.punts}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('punting_punts'), tierData.punting.length, 'asc') }}>
                        {getTierRank('punting_punts')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Punt Average</TableCell>
                      <TableCell>{playerData.punting.average}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('punting_average'), tierData.punting.length, 'asc') }}>
                        {getTierRank('punting_average')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Hangtime</TableCell>
                      <TableCell>{playerData.punting.hangtime}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('punting_hangtime'), tierData.punting.length, 'asc') }}>
                        {getTierRank('punting_hangtime')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Inside Twenty</TableCell>
                      <TableCell>{playerData.punting.inside_twenty}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('punting_inside_twenty'), tierData.punting.length, 'asc') }}>
                        {getTierRank('punting_inside_twenty')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} align='right'>
                        * Eligible {genericPlayerData.position}: {THRESHOLDS.PUNTS} punts per game played
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          )}
          {playerData.returning && playerData.returning.krs + playerData.returning.prs >= THRESHOLDS.RETURNS * genericPlayerData.games_played && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TableContainer component={Paper}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Returning</TableCell>
                      <TableCell />
                      <TableCell>Tier [{tierData.returning.length}*]</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>KR Yards</TableCell>
                      <TableCell>{playerData.returning.kr_yards}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('returning_kr_yards'), tierData.returning.length, 'asc') }}>
                        {getTierRank('returning_kr_yards')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>KR Yards Per Return</TableCell>
                      <TableCell>{(playerData.returning.kr_yards / playerData.returning.krs).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('returning_kr_yards_per_return'), tierData.returning.length, 'asc') }}>
                        {getTierRank('returning_kr_yards_per_return')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>KR Touchdowns</TableCell>
                      <TableCell>{playerData.returning.kr_touchdowns}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('returning_kr_touchdowns'), tierData.returning.length, 'asc') }}>
                        {getTierRank('returning_kr_touchdowns')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PR Yards</TableCell>
                      <TableCell>{playerData.returning.pr_yards}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('returning_pr_yards'), tierData.returning.length, 'asc') }}>
                        {getTierRank('returning_pr_yards')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PR Yards Per Return</TableCell>
                      <TableCell>{(playerData.returning.pr_yards / playerData.returning.prs).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('returning_pr_yards_per_return'), tierData.returning.length, 'asc') }}>
                        {getTierRank('returning_pr_yards_per_return')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PR Touchdowns</TableCell>
                      <TableCell>{playerData.returning.pr_touchdowns}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('returning_pr_touchdowns'), tierData.returning.length, 'asc') }}>
                        {getTierRank('returning_pr_touchdowns')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Touchdowns</TableCell>
                      <TableCell>{playerData.returning.kr_touchdowns + playerData.returning.pr_touchdowns}</TableCell>
                      <TableCell sx={{ color: getRankColor(getTierRank('returning_total_touchdowns'), tierData.returning.length, 'asc') }}>
                        {getTierRank('returning_total_touchdowns')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} align='right'>
                        * Eligible {genericPlayerData.position}: {THRESHOLDS.RETURNS} returns per game played
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}
