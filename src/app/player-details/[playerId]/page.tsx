'use client';

import { useEffect, useState } from 'react';
import { Container, LinearProgress, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { PlayerData } from '@/app/players/playerData';
import { PlayerPassingData } from '@/app/stats/passing/playerPassingData';
import { PlayerReceivingData } from '@/app/stats/receiving/playerReceivingData';
import { PlayerRushingData } from '@/app/stats/rushing/playerRushingData';
import { PlayerBlockingData } from '@/app/stats/blocking/playerBlockingData';
import { PlayerDefensiveData } from '@/app/stats/defensive/playerDefensiveData';
import { PlayerKickingData } from '@/app/stats/kicking/playerKickingData';
import { PlayerPuntingData } from '@/app/stats/punting/playerPuntingData';
import { PlayerReturningData } from '@/app/stats/returning/playerReturningData';

const combinePlayerData = (...objects: any): any => {
  return objects.reduce((acc: any, obj: any) => {
    if (!obj) return acc;
    const key = Object.keys(obj)[0];
    return { ...acc, [key]: obj[key] };
  }, {});
};

const THRESHOLDS = {
  PASS_ATTEMPTS: 10.0,
  CARRIES: 10.0,
  RECEPTIONS: 1.0,
  BLOCKER_PLAYS: 25.0,
  FG_ATTEMPTS: 1.0,
  PUNTS: 1.0,
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
      { rushing: rushData.filter((x: any) => x.tier === rushing?.tier && x.rushes >= THRESHOLDS.CARRIES * +x.games_played) },
      { receiving: receivingData.filter((x: any) => x.tier === receiving?.tier && x.receptions >= THRESHOLDS.RECEPTIONS * +x.games_played) },
      { blocking: blockingData.filter((x: any) => x.tier === blocking?.tier && x.plays >= THRESHOLDS.BLOCKER_PLAYS * +x.games_played) },
      { defensive: defensiveData.filter((x: any) => x.tier === defensive?.tier) },
      { kicking: kickingData.filter((x: any) => x.tier === kicking?.tier) },
      { punting: puntingData.filter((x: any) => x.tier === punting?.tier) },
      { returning: returningData.filter((x: any) => x.tier === returning?.tier) }
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
      case 'passing_completion_percentage':
        return [...tierData.passing].sort((a, b) => +b.completion_percentage - +a.completion_percentage);
      case 'passing_touchdowns':
        return [...tierData.passing].sort((a, b) => +b.touchdowns - +a.touchdowns);
      case 'passing_interceptions':
        return [...tierData.passing].sort((a, b) => +b.interceptions - +a.interceptions);
      case 'passing_sacks':
        return [...tierData.passing].sort((a, b) => +b.sacks - +a.sacks);
      case 'passing_hurries':
        return [...tierData.passing].sort((a, b) => +b.hurries - +a.hurries);
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
    return sortedTier ? formatWithOrdinal(sortedTier.map((x) => x.id).indexOf(genericPlayerData.id) + 1) : 'N/A';
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
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('passing_yards')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Yards Per Attempt: {(+playerData.passing.yards / +playerData.passing.attempts).toFixed(2)}
                </Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('passing_yards_per_attempt')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Completion %: {playerData.passing.completion_percentage}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('passing_completion_percentage')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Touchdowns: {playerData.passing.touchdowns}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('passing_touchdowns')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Interceptions: {playerData.passing.interceptions}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('passing_interceptions')} Most )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Sacks: {playerData.passing.sacks}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('passing_sacks')} Most )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Hurries: {playerData.passing.hurries}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('passing_hurries')} Most )</Typography>
              </Stack>
            </Grid>
          )}
          {playerData.rushing && playerData.rushing.rushes >= THRESHOLDS.CARRIES * genericPlayerData.games_played && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Rushing</Typography>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Yards: {playerData.rushing.yards}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('rushing_yards')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Yards Per Carry: {(+playerData.rushing.yards / +playerData.rushing.rushes).toFixed(2)}
                </Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('rushing_yards_per_carry')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Touchdowns: {playerData.rushing.touchdowns}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('rushing_touchdowns')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Broken Tackles: {playerData.rushing.broken_tackles}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('rushing_broken_tackles')} per carry )</Typography>{' '}
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Yards After Contact: {playerData.rushing.yards_after_contact}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('rushing_yards_after_contact')} )</Typography>{' '}
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Tackles For Loss: {playerData.rushing.tackles_for_loss}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('rushing_tackles_for_loss')} per carry )</Typography>{' '}
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Fumbles: {playerData.rushing.fumbles}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('rushing_fumbles')} per carry )</Typography>{' '}
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Fumbles Lost: {playerData.rushing.fumbles_lost}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('rushing_fumbles_lost')} per carry )</Typography>{' '}
              </Stack>
            </Grid>
          )}
          {playerData.receiving && playerData.receiving.receptions >= THRESHOLDS.RECEPTIONS * genericPlayerData.games_played && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Receiving</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Yards: {playerData.receiving.yards}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('receiving_yards')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Yards Per Reception: {(+playerData.receiving.yards / +playerData.receiving.receptions).toFixed(2)}
                </Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('receiving_yards_per_reception')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Touchdowns: {playerData.receiving.touchdowns}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('receiving_touchdowns')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Yards After Catch: {playerData.receiving.yards_after_catch}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('receiving_yards_after_catch')} per reception )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Targets: {playerData.receiving.targets}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('receiving_targets')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Receptions: {playerData.receiving.receptions}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('receiving_receptions')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Drops: {playerData.receiving.drops}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('receiving_drops')} per reception )</Typography>
              </Stack>
              {!playerData.rushing && (
                <>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Fumbles: {playerData.receiving.fumbles}</Typography>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('receiving_fumbles')} per reception )</Typography>
                  </Stack>

                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Fumbles Lost: {playerData.receiving.fumbles_lost}</Typography>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('receiving_fumbles_lost')} per reception )</Typography>
                  </Stack>
                </>
              )}
            </Grid>
          )}
          {playerData.returning && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Returning</Typography>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>KR Yards: {playerData.returning.kr_yards}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('returning_kr_yards')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  KR Yards Per Return: {(+playerData.returning.kr_yards / +playerData.returning.krs).toFixed(2)}
                </Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('returning_kr_yards_per_return')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>KR Touchdowns: {playerData.returning.kr_touchdowns}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('returning_kr_touchdowns')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>PR Yards: {playerData.returning.pr_yards}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('returning_pr_yards')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  PR Yards Per Return: {(+playerData.returning.pr_yards / +playerData.returning.prs).toFixed(2)}
                </Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('returning_pr_yards_per_return')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>PR Touchdowns: {playerData.returning.pr_touchdowns}</Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('returning_pr_touchdowns')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Total Touchdowns: {+playerData.returning.kr_touchdowns + +playerData.returning.pr_touchdowns}
                </Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>( {getTierRank('returning_total_touchdowns')} )</Typography>
              </Stack>
            </Grid>
          )}
          <Grid size={12}>
            <Typography variant='caption'>* ( Tier Rank of Eligible Players )</Typography>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
