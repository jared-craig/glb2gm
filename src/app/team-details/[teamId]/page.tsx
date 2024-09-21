'use client';

import { useEffect, useState } from 'react';
import { TeamData } from '../../rankings/teamData';
import { Container, LinearProgress, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';

export default function TeamDetails({ params }: { params: { teamId: string } }) {
  const [leagueData, setLeagueData] = useState<TeamData[]>();
  const [teamData, setTeamData] = useState<TeamData>();

  const fetchData = async () => {
    const res = await fetch('/api/teams');
    const data = await res.json();
    const currentTeam = data.find((x: TeamData) => x.id === +params.teamId);
    setLeagueData(data.filter((x: TeamData) => x.league === currentTeam.league));
    setTeamData(currentTeam);
  };

  const formatWithOrdinal = (number: number): string => {
    const ordinals = ['th', 'st', 'nd', 'rd'];
    const lastTwoDigits = number % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return number + 'th';
    const lastDigit = number % 10;
    const ordinalSuffix = ordinals[lastDigit] || 'th';
    return number + ordinalSuffix;
  };

  const sortLeagueData = (stat: string, dir: string): TeamData[] => {
    if (!leagueData) return [];
    switch (stat) {
      case 'offensive_rushing_yards_per_carry':
        return [...leagueData].sort((a, b) => +(b.offensive_rushing_yards / +b.offensive_rushes) - +(a.offensive_rushing_yards / +a.offensive_rushes));
      case 'offensive_passing_yards_per_attempt':
        return [...leagueData].sort((a, b) => +(b.offensive_passing_yards / +b.offensive_attempts) - +(a.offensive_passing_yards / +a.offensive_attempts));
      case 'defensive_rushing_yards_per_carry':
        return [...leagueData].sort((a, b) => +(a.defensive_rushing_yards / +a.defensive_rushes) - +(b.defensive_rushing_yards / +b.defensive_rushes));
      case 'defensive_passing_yards_per_attempt':
        return [...leagueData].sort((a, b) => +(a.defensive_passing_yards / +a.defensive_attempts) - +(b.defensive_passing_yards / +b.defensive_attempts));
      default:
        if (dir === 'asc') {
          return [...leagueData].sort((a, b) => +a[stat as keyof TeamData] - +b[stat as keyof TeamData]);
        } else {
          return [...leagueData].sort((a, b) => +b[stat as keyof TeamData] - +a[stat as keyof TeamData]);
        }
    }
  };

  const getLeagueRank = (stat: string, dir: string): string | undefined => {
    if (!teamData || !leagueData) return;
    const sortedLeague = sortLeagueData(stat, dir);
    return formatWithOrdinal(sortedLeague.map((x) => x.id).indexOf(teamData.id) + 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth='xl'>
      {(!teamData || !leagueData) && <LinearProgress sx={{ height: 32, borderRadius: 2 }} />}
      {teamData && leagueData && (
        <Grid container rowSpacing={{ xs: 1, sm: 2 }}>
          <Grid size={{ xs: 12 }}>
            <Stack spacing={-0.5}>
              <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
                <Typography variant='h5'>{teamData.team_name}</Typography>
                <Link href={`https://glb2.warriorgeneral.com/game/team/${params.teamId}`} target='_blank' style={{ color: 'inherit' }}>
                  <Typography>GLB2 Link</Typography>
                </Link>
              </Stack>
              <Typography variant='caption'>
                {teamData.tier} - {teamData.league}
              </Typography>
              <Typography variant='caption'>Owner: {teamData.owner}</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Typography variant='h6'>
              Record: {teamData.wins}-{teamData.losses}-{teamData.ties}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Stack direction='row' spacing={2}>
              <Typography variant='h6'>Global: {teamData.global_rank}</Typography>
              <Typography variant='h6'>Tier: {teamData.tier_rank}</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={0}>
              <Typography variant='h6'>Offense</Typography>
              <Stack direction='row' spacing={1}>
                <Typography>Rushing Yards: {teamData.offensive_rushing_yards}</Typography>
                <Typography>( {getLeagueRank('offensive_rushing_yards', 'desc')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography>Rushing YPC: {(+teamData.offensive_rushing_yards / +teamData.offensive_rushes).toFixed(2)}</Typography>
                <Typography>( {getLeagueRank('offensive_rushing_yards_per_carry', 'desc')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography>Passing Yards: {teamData.offensive_passing_yards}</Typography>{' '}
                <Typography>( {getLeagueRank('offensive_passing_yards', 'desc')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography>Passing YPA: {(+teamData.offensive_passing_yards / +teamData.offensive_attempts).toFixed(2)}</Typography>
                <Typography>( {getLeagueRank('offensive_passing_yards_per_attempt', 'desc')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography>Interceptions: {teamData.offensive_interceptions}</Typography>{' '}
                <Typography>( {getLeagueRank('offensive_interceptions', 'asc')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography>Sacks Taken: {teamData.offensive_sacks}</Typography>
                <Typography>( {getLeagueRank('offensive_sacks', 'asc')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography>Fumbles Lost: {teamData.offensive_fumbles_lost}</Typography>
                <Typography>( {getLeagueRank('offensive_fumbles_lost', 'asc')} )</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={0}>
              <Typography variant='h6'>Defense</Typography>
              <Stack direction='row' spacing={1}>
                <Typography>Rushing Yards: {teamData.defensive_rushing_yards}</Typography>
                <Typography>( {getLeagueRank('defensive_rushing_yards', 'asc')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography>Rushing YPC: {(+teamData.defensive_rushing_yards / +teamData.defensive_rushes).toFixed(2)}</Typography>
                <Typography>( {getLeagueRank('defensive_rushing_yards_per_carry', 'desc')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography>Passing Yards: {teamData.defensive_passing_yards}</Typography>{' '}
                <Typography>( {getLeagueRank('defensive_passing_yards', 'asc')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography>Passing YPA: {(+teamData.defensive_passing_yards / +teamData.defensive_attempts).toFixed(2)}</Typography>
                <Typography>( {getLeagueRank('defensive_passing_yards_per_attempt', 'asc')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography>Interceptions: {teamData.defensive_interceptions}</Typography>{' '}
                <Typography>( {getLeagueRank('defensive_interceptions', 'desc')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography>Sacks: {teamData.defensive_sacks}</Typography>
                <Typography>( {getLeagueRank('defensive_sacks', 'desc')} )</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography>Forced Fumbles: {teamData.defensive_fumbles_lost}</Typography>
                <Typography>( {getLeagueRank('defensive_fumbles_lost', 'desc')} )</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={12}>
            <Typography variant='caption'>* ( League Rank )</Typography>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
