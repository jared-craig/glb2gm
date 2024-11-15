'use client';

import { useEffect, useState } from 'react';
import { Container, LinearProgress, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { PlayerData } from '@/app/players/playerData';
import { getRankColor } from '@/app/helpers';

const combinePlayerData = (...objects: any): any => {
  return objects.reduce((acc: any, obj: any) => {
    if (!obj) return acc;
    const key = Object.keys(obj)[0];
    return { ...acc, [key]: obj[key] };
  }, {});
};

const THRESHOLDS = {
  PASS_ATTEMPTS: 5.0,
  CARRIES: 5.0,
  RECEPTIONS: 0.5,
  BLOCKER_PLAYS: 20.0,
  FG_ATTEMPTS: 0.5,
  PUNTS: 0.5,
  RETURNS: 1.0,
};

export default function TeamDetails({ params }: { params: { playerId: string } }) {
  const [tierData, setTierData] = useState<any>();
  const [playerData, setPlayerData] = useState<any>();
  const [genericPlayerData, setGenericPlayerData] = useState<PlayerData>();

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
    const passing = passData.find((x: PlayerData) => x.id === +params.playerId);
    const rushing = rushData.find((x: PlayerData) => x.id === +params.playerId);
    const receiving = receivingData.find((x: PlayerData) => x.id === +params.playerId);
    const blocking = blockingData.find((x: PlayerData) => x.id === +params.playerId);
    const defensive = defensiveData.find((x: PlayerData) => x.id === +params.playerId);
    const kicking = kickingData.find((x: PlayerData) => x.id === +params.playerId);
    const punting = puntingData.find((x: PlayerData) => x.id === +params.playerId);
    const returning = returningData.find((x: PlayerData) => x.id === +params.playerId);

    const gamesPlayed = Math.max(...passData.map((x: PlayerData) => x.games_played));

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
      { defensive: defensiveData.filter((x: any) => x.tier === defensive?.tier && x.games_played / gamesPlayed >= 0.75 && x.position === defensive?.position) },
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
    if (!tierData) return [];
    switch (stat) {
      case 'passing_yards':
        return [...tierData.passing].sort((a, b) => +b.yards - +a.yards);
      case 'passing_yards_per_attempt':
        return [...tierData.passing].sort((a, b) => +b.yards / +b.attempts - +a.completion_percentage / +a.attempts);
      case 'passing_attempts':
        return [...tierData.passing].sort((a, b) => +b.attempts - +a.attempts);
      case 'passing_completions':
        return [...tierData.passing].sort((a, b) => +b.completions - +a.completions);
      case 'passing_completion_percentage':
        return [...tierData.passing].sort((a, b) => +b.completion_percentage - +a.completion_percentage);
      case 'passing_touchdowns':
        return [...tierData.passing].sort((a, b) => +b.touchdowns - +a.touchdowns);
      case 'passing_interceptions':
        return [...tierData.passing].sort((a, b) => +b.interceptions - +a.interceptions);
      case 'passing_touchdowns_to_interceptions':
        return [...tierData.passing].sort((a, b) => +b.touchdowns / +b.interceptions - +a.touchdowns / +a.interceptions);
      case 'passing_sacks':
        return [...tierData.passing].sort((a, b) => +b.sacks / +b.attempts - +a.sacks / +a.attempts);
      case 'passing_hurries':
        return [...tierData.passing].sort((a, b) => +b.hurries / +b.attempts - +a.hurries / +a.attempts);
      case 'rushing_yards':
        return [...tierData.rushing].sort((a, b) => +b.yards - +a.yards);
      case 'rushing_yards_per_carry':
        return [...tierData.rushing].sort((a, b) => +b.yards / +b.rushes - +a.yards / +a.rushes);
      case 'rushing_touchdowns':
        return [...tierData.rushing].sort((a, b) => +b.touchdowns - +a.touchdowns);
      case 'rushing_broken_tackles':
        return [...tierData.rushing].sort((a, b) => +b.broken_tackles / +b.rushes - +a.broken_tackles / +b.rushes);
      case 'rushing_yards_after_contact':
        return [...tierData.rushing].sort((a, b) => +b.yards_after_contact - +a.yards_after_contact);
      case 'rushing_tackles_for_loss':
        return [...tierData.rushing].sort((a, b) => +a.tackles_for_loss / +a.rushes - +b.tackles_for_loss / +a.rushes);
      case 'rushing_fumbles':
        return [...tierData.rushing].sort((a, b) => +a.fumbles / +a.rushes - +b.fumbles / +b.rushes);
      case 'rushing_fumbles_lost':
        return [...tierData.rushing].sort((a, b) => +a.fumbles_lost / +a.rushes - +b.fumbles_lost / +b.rushes);
      case 'receiving_yards':
        return [...tierData.receiving].sort((a, b) => +b.yards - +a.yards);
      case 'receiving_yards_per_reception':
        return [...tierData.receiving].sort((a, b) => +b.yards / +b.receptions - +a.yards / +a.receptions);
      case 'receiving_touchdowns':
        return [...tierData.receiving].sort((a, b) => +b.touchdowns - +a.touchdowns);
      case 'receiving_yards_after_catch':
        return [...tierData.receiving].sort((a, b) => +b.yards_after_catch / +b.receptions - +a.yards_after_catch / +a.receptions);
      case 'receiving_targets':
        return [...tierData.receiving].sort((a, b) => +b.targets - +a.targets);
      case 'receiving_receptions':
        return [...tierData.receiving].sort((a, b) => +b.receptions - +a.receptions);
      case 'receiving_drops':
        return [...tierData.receiving].sort((a, b) => +b.drops - +a.drops);
      case 'receiving_fumbles':
        return [...tierData.receiving].sort((a, b) => +b.fumbles / +b.receptions - +a.fumbles / +a.receptions);
      case 'receiving_fumbles_lost':
        return [...tierData.receiving].sort((a, b) => +b.fumbles_lost / +b.receptions - +a.fumbles_lost / +a.receptions);
      case 'defensive_tackles':
        return [...tierData.defensive].sort((a, b) => +b.tackles - +a.tackles);
      case 'defensive_missed_tackles':
        return [...tierData.defensive].sort((a, b) => +b.missed_tackles - +a.missed_tackles);
      case 'defensive_sticks':
        return [...tierData.defensive].sort((a, b) => +b.sticks - +a.sticks);
      case 'defensive_sacks':
        return [...tierData.defensive].sort((a, b) => +b.sacks - +a.sacks);
      case 'defensive_interceptions':
        return [...tierData.defensive].sort((a, b) => +b.interceptions - +a.interceptions);
      case 'blocking_pancakes':
        return [...tierData.blocking].sort((a, b) => +b.pancakes - +a.pancakes);
      case 'blocking_reverse_pancaked':
        return [...tierData.blocking].sort((a, b) => +b.reverse_pancaked - +a.reverse_pancaked);
      case 'blocking_hurries_allowed':
        return [...tierData.blocking].sort((a, b) => +b.hurries_allowed - +a.hurries_allowed);
      case 'blocking_sacks_allowed':
        return [...tierData.blocking].sort((a, b) => +b.sacks_allowed - +a.sacks_allowed);
      case 'kicking_fg_attempts':
        return [...tierData.kicking].sort((a, b) => +b.fg_attempts - +a.fg_attempts);
      case 'kicking_fg_made':
        return [...tierData.kicking].sort((a, b) => +b.fg_made - +a.fg_made);
      case 'kicking_50_attempts':
        return [...tierData.kicking].sort((a, b) => +b.fifty_plus_attempts - +a.fifty_plus_attempts);
      case 'kicking_50_made':
        return [...tierData.kicking].sort((a, b) => +b.fifty_plus_made - +a.fifty_plus_made);
      case 'kicking_touchbacks':
        return [...tierData.kicking].sort((a, b) => +b.touchbacks - +a.touchbacks);
      case 'kicking_kickoffs':
        return [...tierData.kicking].sort((a, b) => +b.kickoffs - +a.kickoffs);
      case 'kicking_touchback_ratio':
        return [...tierData.kicking].sort((a, b) => +b.touchbacks / +b.kickoffs - +a.touchbacks / +a.kickoffs);
      case 'punting_punts':
        return [...tierData.punting].sort((a, b) => +b.punts - +a.punts);
      case 'punting_average':
        return [...tierData.punting].sort((a, b) => +b.average - +a.average);
      case 'punting_hangtime':
        return [...tierData.punting].sort((a, b) => +b.hangtime - +a.hangtime);
      case 'punting_inside_twenty':
        return [...tierData.punting].sort((a, b) => +b.inside_twenty - +a.inside_twenty);
      case 'returning_kr_yards':
        return [...tierData.returning].sort((a, b) => +b.kr_yards - +a.kr_yards);
      case 'returning_kr_yards_per_return':
        return [...tierData.returning].sort((a, b) => +b.kr_yards / +b.krs - +a.kr_yards / +a.krs);
      case 'returning_kr_touchdowns':
        return [...tierData.returning].sort((a, b) => +b.kr_touchdowns - +a.kr_touchdowns);
      case 'returning_pr_yards':
        return [...tierData.returning].sort((a, b) => +b.pr_yards - +a.pr_yards);
      case 'returning_pr_yards_per_return':
        return [...tierData.returning].sort((a, b) => +b.pr_yards / +b.prs - +a.pr_yards / +a.prs);
      case 'returning_pr_touchdowns':
        return [...tierData.returning].sort((a, b) => +b.pr_touchdowns - +a.pr_touchdowns);
      case 'returning_total_touchdowns':
        return [...tierData.returning].sort((a, b) => +b.kr_touchdowns + +b.pr_touchdowns - (+a.kr_touchdowns + +a.pr_touchdowns));
      default:
        return null;
    }
  };

  const getTierRank = (stat: string): string => {
    if (!genericPlayerData || !tierData) return 'N/A';
    const sortedTier = sortTierData(stat);
    if (sortedTier) {
      const rank = sortedTier.map((x) => x.id).indexOf(genericPlayerData.id);
      if (rank === -1) return 'N/A';
      return formatWithOrdinal(sortedTier.map((x) => x.id).indexOf(genericPlayerData.id) + 1);
    } else {
      return 'N/A';
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth='xl'>
      {!genericPlayerData && !playerData && <LinearProgress sx={{ borderRadius: 2 }} />}
      {genericPlayerData && playerData && (
        <Grid container rowSpacing={{ xs: 1, sm: 2 }}>
          <Grid size={{ xs: 12 }}>
            <Stack spacing={-0.5}>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h5' } }}>{genericPlayerData.player_name}</Typography>
              <Typography variant='caption'>
                {genericPlayerData.position} - {genericPlayerData.tier}
              </Typography>
              <Typography variant='caption'>Team: {genericPlayerData.team_name}</Typography>
              <Link href={`https://glb2.warriorgeneral.com/game/player/${params.playerId}`} target='_blank' style={{ color: 'inherit' }}>
                <Typography variant='caption'>GLB2 Link</Typography>
              </Link>
            </Stack>
          </Grid>
          {playerData.passing && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Passing</Typography>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Yards: {playerData.passing.yards}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('passing_yards'), tierData.passing.length, 'asc') }}
                >
                  ( {getTierRank('passing_yards')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Yards Per Attempt: {(+playerData.passing.yards / +playerData.passing.attempts).toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('passing_yards_per_attempt'), tierData.passing.length, 'asc'),
                  }}
                >
                  ( {getTierRank('passing_yards_per_attempt')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Attempts: {playerData.passing.attempts}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2', color: getRankColor(getTierRank('passing_attempts'), tierData.passing.length, 'asc') } }}
                >
                  ( {getTierRank('passing_attempts')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Completions: {playerData.passing.completions}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('passing_completions'), tierData.passing.length, 'asc') }}
                >
                  ( {getTierRank('passing_completions')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Completion %: {playerData.passing.completion_percentage}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('passing_completion_percentage'), tierData.passing.length, 'asc'),
                  }}
                >
                  ( {getTierRank('passing_completion_percentage')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Touchdowns: {playerData.passing.touchdowns}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('passing_touchdowns'), tierData.passing.length, 'asc') }}
                >
                  ( {getTierRank('passing_touchdowns')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Interceptions: {playerData.passing.interceptions}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('passing_interceptions'), tierData.passing.length, 'desc') }}
                >
                  ( {getTierRank('passing_interceptions')} most)
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  TD/Int Ratio: {(playerData.passing.touchdowns / playerData.passing.interceptions).toFixed(1)}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('passing_touchdowns_to_interceptions'), tierData.passing.length, 'asc'),
                  }}
                >
                  ( {getTierRank('passing_touchdowns_to_interceptions')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Sacks: {playerData.passing.sacks}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('passing_sacks'), tierData.passing.length, 'desc') }}
                >
                  ( {getTierRank('passing_sacks')} most per attempt )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Hurries: {playerData.passing.hurries}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('passing_hurries'), tierData.passing.length, 'desc') }}
                >
                  ( {getTierRank('passing_hurries')} most per attempt )
                </Typography>
              </Stack>
              <Typography variant='caption'>
                * ( out of {tierData.passing.length} eligible {genericPlayerData.tier} {genericPlayerData.position}s )
              </Typography>
            </Grid>
          )}
          {playerData.rushing && playerData.rushing.rushes >= THRESHOLDS.CARRIES * genericPlayerData.games_played && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Rushing</Typography>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Yards: {playerData.rushing.yards}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2', color: getRankColor(getTierRank('rushing_yards'), tierData.rushing.length, 'asc') } }}
                >
                  ( {getTierRank('rushing_yards')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Yards Per Carry: {(+playerData.rushing.yards / +playerData.rushing.rushes).toFixed(2)}
                </Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2', color: getRankColor(getTierRank('rushing_yards'), tierData.rushing.length, 'asc') } }}
                >
                  ( {getTierRank('rushing_yards_per_carry')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Touchdowns: {playerData.rushing.touchdowns}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2', color: getRankColor(getTierRank('rushing_touchdowns'), tierData.rushing.length, 'asc') } }}
                >
                  ( {getTierRank('rushing_touchdowns')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Broken Tackles: {playerData.rushing.broken_tackles}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2', color: getRankColor(getTierRank('rushing_broken_tackles'), tierData.rushing.length, 'asc') } }}
                >
                  ( {getTierRank('rushing_broken_tackles')} per carry )
                </Typography>{' '}
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Yards After Contact: {playerData.rushing.yards_after_contact}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2', color: getRankColor(getTierRank('rushing_yards_after_contact'), tierData.rushing.length, 'asc') },
                  }}
                >
                  ( {getTierRank('rushing_yards_after_contact')} )
                </Typography>{' '}
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Tackles For Loss: {playerData.rushing.tackles_for_loss}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2', color: getRankColor(getTierRank('rushing_tackles_for_loss'), tierData.rushing.length, 'desc') },
                  }}
                >
                  ( {getTierRank('rushing_tackles_for_loss')} per carry )
                </Typography>{' '}
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Fumbles: {playerData.rushing.fumbles}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2', color: getRankColor(getTierRank('rushing_fumbles'), tierData.rushing.length, 'desc') } }}
                >
                  ( {getTierRank('rushing_fumbles')} per carry )
                </Typography>{' '}
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Fumbles Lost: {playerData.rushing.fumbles_lost}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2', color: getRankColor(getTierRank('rushing_fumbles_lost'), tierData.rushing.length, 'desc') } }}
                >
                  ( {getTierRank('rushing_fumbles_lost')} per carry )
                </Typography>{' '}
              </Stack>
              <Typography variant='caption'>
                * ( out of {tierData.rushing.length} eligible {genericPlayerData.tier} {genericPlayerData.position}s )
              </Typography>
            </Grid>
          )}
          {playerData.receiving && playerData.receiving.receptions >= THRESHOLDS.RECEPTIONS * genericPlayerData.games_played && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Receiving</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Yards: {playerData.receiving.yards}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('receiving_yards'), tierData.receiving.length, 'asc') }}
                >
                  ( {getTierRank('receiving_yards')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Yards Per Reception: {(+playerData.receiving.yards / +playerData.receiving.receptions).toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('receiving_yards_per_reception'), tierData.receiving.length, 'asc'),
                  }}
                >
                  ( {getTierRank('receiving_yards_per_reception')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Touchdowns: {playerData.receiving.touchdowns}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('receiving_touchdowns'), tierData.receiving.length, 'asc') }}
                >
                  ( {getTierRank('receiving_touchdowns')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Yards After Catch: {(+playerData.receiving.yards_after_catch / +playerData.receiving.receptions).toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('receiving_yards_after_catch'), tierData.receiving.length, 'asc'),
                  }}
                >
                  ( {getTierRank('receiving_yards_after_catch')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Targets: {playerData.receiving.targets}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('receiving_targets'), tierData.receiving.length, 'asc') }}
                >
                  ( {getTierRank('receiving_targets')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Receptions: {playerData.receiving.receptions}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('receiving_receptions'), tierData.receiving.length, 'asc') }}
                >
                  ( {getTierRank('receiving_receptions')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Drops: {playerData.receiving.drops}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('receiving_drops'), tierData.receiving.length, 'desc') }}
                >
                  ( {getTierRank('receiving_drops')} per reception )
                </Typography>
              </Stack>
              {!playerData.rushing && (
                <>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Fumbles: {playerData.receiving.fumbles}</Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTierRank('receiving_fumbles'), tierData.receiving.length, 'desc'),
                      }}
                    >
                      ( {getTierRank('receiving_fumbles')} per reception )
                    </Typography>
                  </Stack>

                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Fumbles Lost: {playerData.receiving.fumbles_lost}</Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTierRank('receiving_fumbles_lost'), tierData.receiving.length, 'desc'),
                      }}
                    >
                      ( {getTierRank('receiving_fumbles_lost')} per reception )
                    </Typography>
                  </Stack>
                </>
              )}
              <Typography variant='caption'>
                * ( out of {tierData.receiving.length} eligible {genericPlayerData.tier} {genericPlayerData.position}s )
              </Typography>
            </Grid>
          )}
          {playerData.defensive && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Defensive</Typography>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Tackles: {playerData.defensive.tackles}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('defensive_tackles'), tierData.defensive.length, 'asc'),
                  }}
                >
                  ( {getTierRank('defensive_tackles')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Missed Tackles: {playerData.defensive.missed_tackles}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('defensive_missed_tackles'), tierData.defensive.length, 'desc'),
                  }}
                >
                  ( {getTierRank('defensive_missed_tackles')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Sticks: {playerData.defensive.sticks}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('defensive_sticks'), tierData.defensive.length, 'asc'),
                  }}
                >
                  ( {getTierRank('defensive_sticks')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Sacks: {playerData.defensive.sacks}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('defensive_sacks'), tierData.defensive.length, 'asc'),
                  }}
                >
                  ( {getTierRank('defensive_sacks')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Interceptions: {playerData.defensive.interceptions}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('defensive_interceptions'), tierData.defensive.length, 'asc'),
                  }}
                >
                  ( {getTierRank('defensive_interceptions')} )
                </Typography>
              </Stack>
              <Typography variant='caption'>
                * ( out of {tierData.defensive.length} eligible {genericPlayerData.tier} {genericPlayerData.position}s )
              </Typography>
            </Grid>
          )}
          {playerData.blocking && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Blocking</Typography>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Pancakes: {playerData.blocking.pancakes}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('blocking_pancakes'), tierData.blocking.length, 'asc'),
                  }}
                >
                  ( {getTierRank('blocking_pancakes')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Rev Cakes: {playerData.blocking.reverse_pancaked}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('blocking_reverse_pancaked'), tierData.blocking.length, 'desc'),
                  }}
                >
                  ( {getTierRank('blocking_reverse_pancaked')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Hurries Allowed: {playerData.blocking.hurries_allowed}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('blocking_hurries_allowed'), tierData.blocking.length, 'desc'),
                  }}
                >
                  ( {getTierRank('blocking_hurries_allowed')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Sacks Allowed: {playerData.blocking.sacks_allowed}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('blocking_sacks_allowed'), tierData.blocking.length, 'desc'),
                  }}
                >
                  ( {getTierRank('blocking_sacks_allowed')} )
                </Typography>
              </Stack>
              <Typography variant='caption'>
                * ( out of {tierData.blocking.length} eligible {genericPlayerData.tier}s )
              </Typography>
            </Grid>
          )}
          {playerData.kicking && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Kicking</Typography>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>FG Made: {playerData.kicking.fg_made}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('kicking_fg_made'), tierData.kicking.length, 'asc'),
                  }}
                >
                  ( {getTierRank('kicking_fg_made')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>FG Attempts: {playerData.kicking.fg_attempts}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('kicking_fg_attempts'), tierData.kicking.length, 'asc'),
                  }}
                >
                  ( {getTierRank('kicking_fg_attempts')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>50+ Made: {playerData.kicking.fifty_plus_made}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('kicking_50_made'), tierData.kicking.length, 'asc'),
                  }}
                >
                  ( {getTierRank('kicking_50_made')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>50+ Attempts: {playerData.kicking.fifty_plus_attempts}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('kicking_50_attempts'), tierData.kicking.length, 'asc'),
                  }}
                >
                  ( {getTierRank('kicking_50_attempts')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Touchbacks: {playerData.kicking.touchbacks}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('kicking_touchbacks'), tierData.kicking.length, 'asc'),
                  }}
                >
                  ( {getTierRank('kicking_touchbacks')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Kickoffs: {playerData.kicking.kickoffs}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('kicking_kickoffs'), tierData.kicking.length, 'asc'),
                  }}
                >
                  ( {getTierRank('kicking_kickoffs')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Touchback %: {((playerData.kicking.touchbacks / playerData.kicking.kickoffs) * 100.0).toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('kicking_touchback_ratio'), tierData.kicking.length, 'asc'),
                  }}
                >
                  ( {getTierRank('kicking_touchback_ratio')} )
                </Typography>
              </Stack>
              <Typography variant='caption'>
                * ( out of {tierData.kicking.length} eligible {genericPlayerData.tier} {genericPlayerData.position}s )
              </Typography>
            </Grid>
          )}
          {playerData.punting && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Punting</Typography>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Punts: {playerData.punting.punts}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('punting_punts'), tierData.punting.length, 'asc'),
                  }}
                >
                  ( {getTierRank('punting_punts')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Punt Average: {playerData.punting.average}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('punting_average'), tierData.punting.length, 'asc'),
                  }}
                >
                  ( {getTierRank('punting_average')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Hangtime: {playerData.punting.hangtime}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('punting_hangtime'), tierData.punting.length, 'asc'),
                  }}
                >
                  ( {getTierRank('punting_hangtime')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Inside Twenty: {playerData.punting.inside_twenty}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('punting_inside_twenty'), tierData.punting.length, 'asc'),
                  }}
                >
                  ( {getTierRank('punting_inside_twenty')})
                </Typography>
              </Stack>
              <Typography variant='caption'>
                * ( out of {tierData.punting.length} eligible {genericPlayerData.tier} {genericPlayerData.position}s )
              </Typography>
            </Grid>
          )}
          {playerData.returning && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Returning</Typography>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>KR Yards: {playerData.returning.kr_yards}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('returning_kr_yards'), tierData.returning.length, 'asc') }}
                >
                  ( {getTierRank('returning_kr_yards')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  KR Yards Per Return: {(+playerData.returning.kr_yards / +playerData.returning.krs).toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('returning_kr_yards_per_return'), tierData.returning.length, 'asc'),
                  }}
                >
                  ( {getTierRank('returning_kr_yards_per_return')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>KR Touchdowns: {playerData.returning.kr_touchdowns}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('returning_kr_touchdowns'), tierData.returning.length, 'asc'),
                  }}
                >
                  ( {getTierRank('returning_kr_touchdowns')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>PR Yards: {playerData.returning.pr_yards}</Typography>
                <Typography
                  sx={{ typography: { xs: 'body2', sm: 'body2' }, color: getRankColor(getTierRank('returning_pr_yards'), tierData.returning.length, 'asc') }}
                >
                  ( {getTierRank('returning_pr_yards')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  PR Yards Per Return: {(+playerData.returning.pr_yards / +playerData.returning.prs).toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('returning_pr_yards_per_return'), tierData.returning.length, 'asc'),
                  }}
                >
                  ( {getTierRank('returning_pr_yards_per_return')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>PR Touchdowns: {playerData.returning.pr_touchdowns}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('returning_pr_touchdowns'), tierData.returning.length, 'asc'),
                  }}
                >
                  ( {getTierRank('returning_pr_touchdowns')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Total Touchdowns: {+playerData.returning.kr_touchdowns + +playerData.returning.pr_touchdowns}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getTierRank('returning_total_touchdowns'), tierData.returning.length, 'asc'),
                  }}
                >
                  ( {getTierRank('returning_total_touchdowns')} )
                </Typography>
              </Stack>
              <Typography variant='caption'>
                * ( out of {tierData.returning.length} eligible {genericPlayerData.tier} KRs/PRs )
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}
