'use client';

import { useEffect, useState, use } from 'react';
import { TeamData } from '../../teams/teamData';
import { Container, LinearProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { GameData } from '@/app/games/gameData';
import { sumArray, extractTeamData, getRecord, getTopTeams } from '@/app/teams/teamHelpers';
import { formatWithOrdinal, getRankColor } from '@/app/helpers';

export default function TeamDetails(props: { params: Promise<{ teamId: string }> }) {
  const params = use(props.params);
  const [tierData, setTierData] = useState<TeamData[]>();
  const [leagueData, setLeagueData] = useState<TeamData[]>();
  const [allTeams, setAllTeams] = useState<TeamData[]>();
  const [teamData, setTeamData] = useState<TeamData>();
  const [allGamesData, setAllGamesData] = useState<GameData[]>([]);
  const [topTeamGames, setTopTeamGames] = useState<any>();
  const [topTeamsForRanks, setTopTeamsForRanks] = useState<any[]>();
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);

  const fetchData = async () => {
    const res = await fetch('/api/teams');
    const data: TeamData[] = await res.json();
    const gamesRes = await fetch('/api/games');
    const gamesData: GameData[] = await gamesRes.json();
    const currentTeam = data.find((x: TeamData) => x.team_id === +params.teamId);
    setTierData(data.filter((x: TeamData) => x.tier === currentTeam?.tier));
    setLeagueData(data.filter((x: TeamData) => x.league === currentTeam?.league));
    setTeamData(currentTeam);
    setAllTeams(data);
    setAllGamesData(gamesData);
    setGamesPlayed(data[0].wins + data[0].losses + data[0].ties);
  };

  const getTopTeamGames = () => {
    if (!allTeams || !teamData || !allGamesData) return;

    let extraTeamData: any[] = [];

    allTeams.forEach((teamData) => {
      const allTeamGames = allGamesData.filter((x) => x.team_one_id === teamData.team_id || x.team_two_id === teamData.team_id);
      const topTeams: TeamData[] = getTopTeams(teamData, allTeams);

      const teamOneTopTeamGames = [...allTeamGames].filter((x) => x.team_one_id === teamData.team_id && topTeams.some((y) => y.team_id === x.team_two_id));
      const teamOneRecord = getRecord(teamOneTopTeamGames, teamData.team_id);
      const teamOneTopGamesSum = sumArray(teamOneTopTeamGames.map((x) => extractTeamData(x, 'team_one_')));
      if (teamOneTopGamesSum) teamOneTopGamesSum['games'] = teamOneTopTeamGames.length;
      const teamTwoTopTeamGames = [...allTeamGames].filter((x) => x.team_two_id === teamData.team_id && topTeams.some((y) => y.team_id === x.team_one_id));
      const teamTwoRecord = getRecord(teamTwoTopTeamGames, teamData.team_id);
      const teamTwoTopGamesSum = sumArray(teamTwoTopTeamGames.map((x) => extractTeamData(x, 'team_two_')));
      if (teamTwoTopGamesSum) teamTwoTopGamesSum['games'] = teamTwoTopTeamGames.length;

      const topTeamGames =
        teamOneTopGamesSum && teamTwoTopGamesSum
          ? sumArray([teamOneTopGamesSum, teamTwoTopGamesSum])
          : teamOneTopGamesSum
          ? teamOneTopGamesSum
          : teamTwoTopGamesSum;

      if (topTeamGames) {
        topTeamGames['wins'] = teamOneRecord.wins + teamTwoRecord.wins;
        topTeamGames['losses'] = teamOneRecord.losses + teamTwoRecord.losses;
        topTeamGames['ties'] = teamOneRecord.ties + teamTwoRecord.ties;
      }

      extraTeamData = [
        ...extraTeamData,
        {
          team_id: teamData.team_id,
          team_name: teamData.team_name,
          tier: teamData.tier,
          topTeamGames,
        },
      ];
    });
    setTopTeamGames(extraTeamData.find((x) => x.team_id === teamData.team_id)?.topTeamGames);
    setTopTeamsForRanks(extraTeamData.filter((x) => x.tier === teamData.tier && x.topTeamGames?.games / gamesPlayed >= 0.33));
  };

  const sortTierData = (stat: string, dir: string): TeamData[] => {
    if (!tierData) return [];
    switch (stat) {
      case 'offensive_rushing_yards_per_carry':
        return [...tierData].sort((a, b) => +(b.offensive_rushing_yards / +b.offensive_rushes) - +(a.offensive_rushing_yards / +a.offensive_rushes));
      case 'offensive_passing_yards_per_attempt':
        return [...tierData].sort((a, b) => +(b.offensive_passing_yards / +b.offensive_attempts) - +(a.offensive_passing_yards / +a.offensive_attempts));
      case 'offensive_passing_completion_percent':
        return [...tierData].sort((a, b) => b.offensive_completions / b.offensive_attempts - a.offensive_completions / a.offensive_attempts);
      case 'defensive_rushing_yards_per_carry':
        return [...tierData].sort((a, b) => +(a.defensive_rushing_yards / +a.defensive_rushes) - +(b.defensive_rushing_yards / +b.defensive_rushes));
      case 'defensive_passing_yards_per_attempt':
        return [...tierData].sort((a, b) => +(a.defensive_passing_yards / +a.defensive_attempts) - +(b.defensive_passing_yards / +b.defensive_attempts));
      case 'defensive_passing_completion_percent':
        return [...tierData].sort((a, b) => a.defensive_completions / a.defensive_attempts - b.defensive_completions / b.defensive_attempts);
      default:
        if (dir === 'asc') {
          return [...tierData].sort((a, b) => +a[stat as keyof TeamData] - +b[stat as keyof TeamData]);
        } else {
          return [...tierData].sort((a, b) => +b[stat as keyof TeamData] - +a[stat as keyof TeamData]);
        }
    }
  };

  const sortLeagueData = (stat: string, dir: string): TeamData[] => {
    if (!leagueData) return [];
    switch (stat) {
      case 'offensive_rushing_yards_per_carry':
        return [...leagueData].sort((a, b) => +(b.offensive_rushing_yards / +b.offensive_rushes) - +(a.offensive_rushing_yards / +a.offensive_rushes));
      case 'offensive_passing_yards_per_attempt':
        return [...leagueData].sort((a, b) => +(b.offensive_passing_yards / +b.offensive_attempts) - +(a.offensive_passing_yards / +a.offensive_attempts));
      case 'offensive_passing_completion_percent':
        return [...leagueData].sort((a, b) => b.offensive_completions / b.offensive_attempts - a.offensive_completions / a.offensive_attempts);
      case 'defensive_rushing_yards_per_carry':
        return [...leagueData].sort((a, b) => +(a.defensive_rushing_yards / +a.defensive_rushes) - +(b.defensive_rushing_yards / +b.defensive_rushes));
      case 'defensive_passing_yards_per_attempt':
        return [...leagueData].sort((a, b) => +(a.defensive_passing_yards / +a.defensive_attempts) - +(b.defensive_passing_yards / +b.defensive_attempts));
      case 'defensive_passing_completion_percent':
        return [...leagueData].sort((a, b) => a.defensive_completions / a.defensive_attempts - b.defensive_completions / b.defensive_attempts);
      default:
        if (dir === 'asc') {
          return [...leagueData].sort((a, b) => +a[stat as keyof TeamData] - +b[stat as keyof TeamData]);
        } else {
          return [...leagueData].sort((a, b) => +b[stat as keyof TeamData] - +a[stat as keyof TeamData]);
        }
    }
  };

  const sortTopTeamsData = (stat: string, dir: string): any[] => {
    if (!topTeamsForRanks) return [];
    switch (stat) {
      case 'offensive_points_scored_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => b.topTeamGames.offensive_points / b.topTeamGames.games - a.topTeamGames.offensive_points / a.topTeamGames.games
        );
      case 'offensive_total_yards_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => b.topTeamGames.offensive_total_yards / b.topTeamGames.games - a.topTeamGames.offensive_total_yards / a.topTeamGames.games
        );
      case 'offensive_rushing_yards_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => b.topTeamGames.offensive_rushing_yards / b.topTeamGames.games - a.topTeamGames.offensive_rushing_yards / a.topTeamGames.games
        );
      case 'offensive_rushing_yards_per_carry':
        return [...topTeamsForRanks].sort(
          (a, b) =>
            b.topTeamGames.offensive_rushing_yards / b.topTeamGames.offensive_rushes - a.topTeamGames.offensive_rushing_yards / a.topTeamGames.offensive_rushes
        );
      case 'offensive_passing_yards_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => b.topTeamGames.offensive_passing_yards / b.topTeamGames.games - a.topTeamGames.offensive_passing_yards / a.topTeamGames.games
        );
      case 'offensive_passing_yards_per_attempt':
        return [...topTeamsForRanks].sort(
          (a, b) =>
            b.topTeamGames.offensive_passing_yards / b.topTeamGames.offensive_attempts -
            a.topTeamGames.offensive_passing_yards / a.topTeamGames.offensive_attempts
        );
      case 'offensive_passing_completion_percent':
        return [...topTeamsForRanks].sort(
          (a, b) =>
            b.topTeamGames.offensive_completions / b.topTeamGames.offensive_attempts - a.topTeamGames.offensive_completions / a.topTeamGames.offensive_attempts
        );
      case 'offensive_sacks_taken_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => a.topTeamGames.offensive_sacks / a.topTeamGames.games - b.topTeamGames.offensive_sacks / b.topTeamGames.games
        );
      case 'offensive_interceptions_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => a.topTeamGames.offensive_interceptions / a.topTeamGames.games - b.topTeamGames.offensive_interceptions / b.topTeamGames.games
        );
      case 'offensive_fumbles_lost_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => a.topTeamGames.offensive_fumbles_lost / a.topTeamGames.games - b.topTeamGames.offensive_fumbles_lost / b.topTeamGames.games
        );
      case 'defensive_points_allowed_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => a.topTeamGames.defensive_points / a.topTeamGames.games - b.topTeamGames.defensive_points / b.topTeamGames.games
        );
      case 'defensive_total_yards_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => a.topTeamGames.defensive_total_yards / a.topTeamGames.games - b.topTeamGames.defensive_total_yards / b.topTeamGames.games
        );
      case 'defensive_rushing_yards_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => a.topTeamGames.defensive_rushing_yards / a.topTeamGames.games - b.topTeamGames.defensive_rushing_yards / b.topTeamGames.games
        );
      case 'defensive_rushing_yards_per_carry':
        return [...topTeamsForRanks].sort(
          (a, b) =>
            a.topTeamGames.defensive_rushing_yards / a.topTeamGames.defensive_rushes - b.topTeamGames.defensive_rushing_yards / b.topTeamGames.defensive_rushes
        );
      case 'defensive_passing_yards_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => a.topTeamGames.defensive_passing_yards / a.topTeamGames.games - b.topTeamGames.defensive_passing_yards / b.topTeamGames.games
        );
      case 'defensive_passing_yards_per_attempt':
        return [...topTeamsForRanks].sort(
          (a, b) =>
            a.topTeamGames.defensive_passing_yards / a.topTeamGames.defensive_attempts -
            b.topTeamGames.defensive_passing_yards / b.topTeamGames.defensive_attempts
        );
      case 'defensive_passing_completion_percent':
        return [...topTeamsForRanks].sort(
          (a, b) =>
            a.topTeamGames.defensive_completions / a.topTeamGames.defensive_attempts - b.topTeamGames.defensive_completions / b.topTeamGames.defensive_attempts
        );
      case 'defensive_sacks_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => b.topTeamGames.defensive_sacks / b.topTeamGames.games - a.topTeamGames.defensive_sacks / a.topTeamGames.games
        );
      case 'defensive_interceptions_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => b.topTeamGames.defensive_interceptions / b.topTeamGames.games - a.topTeamGames.defensive_interceptions / a.topTeamGames.games
        );
      case 'defensive_fumbles_lost_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => b.topTeamGames.defensive_fumbles_lost / b.topTeamGames.games - a.topTeamGames.defensive_fumbles_lost / a.topTeamGames.games
        );
      default:
        if (dir === 'asc') {
          return [...topTeamsForRanks].sort((a, b) => a.topTeamGames[stat as keyof TeamData] - b.topTeamGames[stat as keyof TeamData]);
        } else {
          return [...topTeamsForRanks].sort((a, b) => b.topTeamGames[stat as keyof TeamData] - a.topTeamGames[stat as keyof TeamData]);
        }
    }
  };

  const getTierRank = (stat: string, dir: string): string => {
    if (!teamData || !tierData) return 'N/A';
    const sortedTier = sortTierData(stat, dir);
    return formatWithOrdinal(sortedTier.map((x) => x.team_id).indexOf(teamData.team_id) + 1);
  };

  const getLeagueRank = (stat: string, dir: string): string => {
    if (!teamData || !leagueData) return 'N/A';
    const sortedLeague = sortLeagueData(stat, dir);
    return formatWithOrdinal(sortedLeague.map((x) => x.team_id).indexOf(teamData.team_id) + 1);
  };

  const getTopTeamsRank = (stat: string, dir: string): string => {
    if (!teamData || !topTeamsForRanks || !topTeamsForRanks.some((x) => x.team_id === teamData.team_id)) return 'N/A';
    const sortedTopTeamsData = sortTopTeamsData(stat, dir);
    return formatWithOrdinal(sortedTopTeamsData.map((x) => x.team_id).indexOf(teamData.team_id) + 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getTopTeamGames();
  }, [allTeams, teamData, allGamesData]);

  return (
    <Container maxWidth='xl'>
      {(!teamData || !tierData || !leagueData) && <LinearProgress sx={{ borderRadius: 2 }} />}
      {teamData && tierData && leagueData && (
        <Grid container rowSpacing={2} columnSpacing={2} sx={{ mb: 1 }}>
          <Grid size={12}>
            <Stack spacing={-0.5}>
              <Typography variant='h5'>{teamData.team_name}</Typography>
              <Typography variant='caption'>
                {teamData.tier} - {teamData.league}
              </Typography>
              <Typography variant='caption'>Owner: {teamData.owner}</Typography>
              <Link href={`https://glb2.warriorgeneral.com/game/team/${params.teamId}`} target='_blank' rel='noopener' style={{ color: 'inherit' }}>
                <Typography variant='caption'>GLB2 Link</Typography>
              </Link>
            </Stack>
          </Grid>
          <Grid size={12}>
            <Stack direction='row' spacing={2}>
              <Typography variant='h6'>Global: {teamData.global_rank}</Typography>
              <Typography variant='h6'>Tier: {teamData.tier_rank}</Typography>
            </Stack>
          </Grid>
          <Grid size={12}>
            <Typography variant='h6'>
              Overall ({teamData.wins}-{teamData.losses}-{teamData.ties})
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <TableContainer component={Paper}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Offense</TableCell>
                    <TableCell />
                    <TableCell align='right'>League [{leagueData.length}]</TableCell>
                    <TableCell align='right'>Tier [{tierData.length}]</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Points Scored</TableCell>
                    <TableCell align='right'>{teamData.offensive_points}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('offensive_points', 'desc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('offensive_points', 'desc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('offensive_points', 'desc'), tierData.length, 'asc') }}>
                      {getTierRank('offensive_points', 'desc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Yards</TableCell>
                    <TableCell align='right'>{teamData.offensive_total_yards}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('offensive_total_yards', 'desc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('offensive_total_yards', 'desc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('offensive_total_yards', 'desc'), tierData.length, 'asc') }}>
                      {getTierRank('offensive_total_yards', 'desc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rushing Yards</TableCell>
                    <TableCell align='right'>{teamData.offensive_rushing_yards}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('offensive_rushing_yards', 'desc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('offensive_rushing_yards', 'desc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('offensive_rushing_yards', 'desc'), tierData.length, 'asc') }}>
                      {getTierRank('offensive_rushing_yards', 'desc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rushing YPC</TableCell>
                    <TableCell align='right'>{(teamData.offensive_rushing_yards / teamData.offensive_rushes).toFixed(2)}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('offensive_rushing_yards_per_carry', 'desc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('offensive_rushing_yards_per_carry', 'desc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('offensive_rushing_yards_per_carry', 'desc'), tierData.length, 'asc') }}>
                      {getTierRank('offensive_rushing_yards_per_carry', 'desc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Passing Yards</TableCell>
                    <TableCell align='right'>{teamData.offensive_passing_yards}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('offensive_passing_yards', 'desc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('offensive_passing_yards', 'desc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('offensive_passing_yards', 'desc'), tierData.length, 'asc') }}>
                      {getTierRank('offensive_passing_yards', 'desc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Passing YPA</TableCell>
                    <TableCell align='right'>{(teamData.offensive_passing_yards / teamData.offensive_attempts).toFixed(2)}</TableCell>
                    <TableCell
                      align='right'
                      sx={{ color: getRankColor(getLeagueRank('offensive_passing_yards_per_attempt', 'desc'), leagueData.length, 'asc') }}
                    >
                      {getLeagueRank('offensive_passing_yards_per_attempt', 'desc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('offensive_passing_yards_per_attempt', 'desc'), tierData.length, 'asc') }}>
                      {getTierRank('offensive_passing_yards_per_attempt', 'desc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Passing Comp %</TableCell>
                    <TableCell align='right'>{((teamData.offensive_completions / teamData.offensive_attempts) * 100.0).toFixed(2)}</TableCell>
                    <TableCell
                      align='right'
                      sx={{ color: getRankColor(getLeagueRank('offensive_passing_completion_percent', 'desc'), leagueData.length, 'asc') }}
                    >
                      {getLeagueRank('offensive_passing_completion_percent', 'desc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('offensive_passing_completion_percent', 'desc'), tierData.length, 'asc') }}>
                      {getTierRank('offensive_passing_completion_percent', 'desc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sacks</TableCell>
                    <TableCell align='right'>{teamData.offensive_sacks}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('offensive_sacks', 'asc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('offensive_sacks', 'asc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('offensive_sacks', 'asc'), tierData.length, 'asc') }}>
                      {getTierRank('offensive_sacks', 'asc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Interceptions</TableCell>
                    <TableCell align='right'>{teamData.offensive_interceptions}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('offensive_interceptions', 'asc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('offensive_interceptions', 'asc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('offensive_interceptions', 'asc'), tierData.length, 'asc') }}>
                      {getTierRank('offensive_interceptions', 'asc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fumbles</TableCell>
                    <TableCell align='right'>{teamData.offensive_fumbles_lost}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('offensive_fumbles_lost', 'asc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('offensive_fumbles_lost', 'asc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('offensive_fumbles_lost', 'asc'), tierData.length, 'asc') }}>
                      {getTierRank('offensive_fumbles_lost', 'asc')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <TableContainer component={Paper}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Defense</TableCell>
                    <TableCell />
                    <TableCell align='right'>League [{leagueData.length}]</TableCell>
                    <TableCell align='right'>Tier [{tierData.length}]</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Points Allowed</TableCell>
                    <TableCell align='right'>{teamData.defensive_points}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('defensive_points', 'asc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('defensive_points', 'asc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('defensive_points', 'asc'), tierData.length, 'asc') }}>
                      {getTierRank('defensive_points', 'asc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Yards</TableCell>
                    <TableCell align='right'>{teamData.defensive_total_yards}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('defensive_total_yards', 'asc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('defensive_total_yards', 'asc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('defensive_total_yards', 'asc'), tierData.length, 'asc') }}>
                      {getTierRank('defensive_total_yards', 'asc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rushing Yards</TableCell>
                    <TableCell align='right'>{teamData.defensive_rushing_yards}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('defensive_rushing_yards', 'asc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('defensive_rushing_yards', 'asc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('defensive_rushing_yards', 'asc'), tierData.length, 'asc') }}>
                      {getTierRank('defensive_rushing_yards', 'asc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rushing YPC</TableCell>
                    <TableCell align='right'>{(teamData.defensive_rushing_yards / teamData.defensive_rushes).toFixed(2)}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('defensive_rushing_yards_per_carry', 'asc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('defensive_rushing_yards_per_carry', 'asc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('defensive_rushing_yards_per_carry', 'asc'), tierData.length, 'asc') }}>
                      {getTierRank('defensive_rushing_yards_per_carry', 'asc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Passing Yards</TableCell>
                    <TableCell align='right'>{teamData.defensive_passing_yards}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('defensive_passing_yards', 'asc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('defensive_passing_yards', 'asc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('defensive_passing_yards', 'asc'), tierData.length, 'asc') }}>
                      {getTierRank('defensive_passing_yards', 'asc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Passing YPA</TableCell>
                    <TableCell align='right'>{(teamData.defensive_passing_yards / teamData.defensive_attempts).toFixed(2)}</TableCell>
                    <TableCell
                      align='right'
                      sx={{ color: getRankColor(getLeagueRank('defensive_passing_yards_per_attempt', 'asc'), leagueData.length, 'asc') }}
                    >
                      {getLeagueRank('defensive_passing_yards_per_attempt', 'asc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('defensive_passing_yards_per_attempt', 'asc'), tierData.length, 'asc') }}>
                      {getTierRank('defensive_passing_yards_per_attempt', 'asc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Passing Comp %</TableCell>
                    <TableCell align='right'>{((teamData.defensive_completions / teamData.defensive_attempts) * 100.0).toFixed(2)}</TableCell>
                    <TableCell
                      align='right'
                      sx={{ color: getRankColor(getLeagueRank('defensive_passing_completion_percent', 'asc'), leagueData.length, 'asc') }}
                    >
                      {getLeagueRank('defensive_passing_completion_percent', 'asc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('defensive_passing_completion_percent', 'asc'), tierData.length, 'asc') }}>
                      {getTierRank('defensive_passing_completion_percent', 'asc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sacks</TableCell>
                    <TableCell align='right'>{teamData.defensive_sacks}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('defensive_sacks', 'desc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('defensive_sacks', 'desc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('defensive_sacks', 'desc'), tierData.length, 'asc') }}>
                      {getTierRank('defensive_sacks', 'desc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Interceptions</TableCell>
                    <TableCell align='right'>{teamData.defensive_interceptions}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('defensive_interceptions', 'desc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('defensive_interceptions', 'desc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('defensive_interceptions', 'desc'), tierData.length, 'asc') }}>
                      {getTierRank('defensive_interceptions', 'desc')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fumbles</TableCell>
                    <TableCell align='right'>{teamData.defensive_fumbles_lost}</TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getLeagueRank('defensive_fumbles_lost', 'desc'), leagueData.length, 'asc') }}>
                      {getLeagueRank('defensive_fumbles_lost', 'desc')}
                    </TableCell>
                    <TableCell align='right' sx={{ color: getRankColor(getTierRank('defensive_fumbles_lost', 'desc'), tierData.length, 'asc') }}>
                      {getTierRank('defensive_fumbles_lost', 'desc')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {topTeamGames && topTeamsForRanks && (
            <>
              <Grid size={12}>
                <Typography variant='h6'>
                  VS Top Teams ({topTeamGames.wins}-{topTeamGames.losses}-{topTeamGames.ties})
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <TableContainer component={Paper}>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Offense</TableCell>
                        <TableCell />
                        <TableCell align='right'>Rank [{topTeamsForRanks.length}*]</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Points Scored/G</TableCell>
                        <TableCell align='right'>{(topTeamGames.offensive_points / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('offensive_points_scored_per_game', 'desc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('offensive_points_scored_per_game', 'desc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total YPG</TableCell>
                        <TableCell align='right'>{(topTeamGames.offensive_total_yards / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('offensive_total_yards_per_game', 'desc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('offensive_total_yards_per_game', 'desc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rushing YPG</TableCell>
                        <TableCell align='right'>{(topTeamGames.offensive_rushing_yards / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('offensive_rushing_yards_per_game', 'desc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('offensive_rushing_yards_per_game', 'desc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rushing YPC</TableCell>
                        <TableCell align='right'>{(topTeamGames.offensive_rushing_yards / topTeamGames.offensive_rushes).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('offensive_rushing_yards_per_carry', 'desc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('offensive_rushing_yards_per_carry', 'desc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Passing YPG</TableCell>
                        <TableCell align='right'>{(topTeamGames.offensive_passing_yards / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('offensive_passing_yards_per_game', 'desc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('offensive_passing_yards_per_game', 'desc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Passing YPA</TableCell>
                        <TableCell align='right'>{(topTeamGames.offensive_passing_yards / topTeamGames.offensive_attempts).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('offensive_passing_yards_per_attempt', 'desc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('offensive_passing_yards_per_attempt', 'desc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Passing Comp %</TableCell>
                        <TableCell align='right'>{((topTeamGames.offensive_completions / topTeamGames.offensive_attempts) * 100.0).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('offensive_passing_completion_percent', 'desc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('offensive_passing_completion_percent', 'desc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sacks/G</TableCell>
                        <TableCell align='right'>{(topTeamGames.offensive_sacks / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('offensive_sacks_taken_per_game', 'asc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('offensive_sacks_taken_per_game', 'asc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Interceptions/G</TableCell>
                        <TableCell align='right'>{(topTeamGames.offensive_interceptions / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('offensive_interceptions_per_game', 'asc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('offensive_interceptions_per_game', 'asc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Fumbles/G</TableCell>
                        <TableCell align='right'>{(topTeamGames.offensive_fumbles_lost / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('offensive_fumbles_lost_per_game', 'asc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('offensive_fumbles_lost_per_game', 'asc')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <TableContainer component={Paper}>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Defense</TableCell>
                        <TableCell />
                        <TableCell align='right'>Rank [{topTeamsForRanks.length}*]</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Points Allowed/G</TableCell>
                        <TableCell align='right'>{(topTeamGames.defensive_points / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('defensive_points_allowed_per_game', 'asc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('defensive_points_allowed_per_game', 'asc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total YPG</TableCell>
                        <TableCell align='right'>{(topTeamGames.defensive_total_yards / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('defensive_total_yards_per_game', 'asc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('defensive_total_yards_per_game', 'asc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rushing YPG</TableCell>
                        <TableCell align='right'>{(topTeamGames.defensive_rushing_yards / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('defensive_rushing_yards_per_game', 'asc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('defensive_rushing_yards_per_game', 'asc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rushing YPC</TableCell>
                        <TableCell align='right'>{(topTeamGames.defensive_rushing_yards / topTeamGames.defensive_rushes).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('defensive_rushing_yards_per_carry', 'asc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('defensive_rushing_yards_per_carry', 'asc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Passing YPG</TableCell>
                        <TableCell align='right'>{(topTeamGames.defensive_passing_yards / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('defensive_passing_yards_per_game', 'asc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('defensive_passing_yards_per_game', 'asc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Passing YPA</TableCell>
                        <TableCell align='right'>{(topTeamGames.defensive_passing_yards / topTeamGames.defensive_attempts).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('defensive_passing_yards_per_attempt', 'asc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('defensive_passing_yards_per_attempt', 'asc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Passing Comp %</TableCell>
                        <TableCell align='right'>{((topTeamGames.defensive_completions / topTeamGames.defensive_attempts) * 100.0).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('defensive_passing_completion_percent', 'asc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('defensive_passing_completion_percent', 'asc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sacks/G</TableCell>
                        <TableCell align='right'>{(topTeamGames.defensive_sacks / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('defensive_sacks_per_game', 'desc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('defensive_sacks_per_game', 'desc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Interceptions/G</TableCell>
                        <TableCell align='right'>{(topTeamGames.defensive_interceptions / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('defensive_interceptions_per_game', 'desc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('defensive_interceptions_per_game', 'desc')}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Fumbles/G</TableCell>
                        <TableCell align='right'>{(topTeamGames.defensive_fumbles_lost / topTeamGames.games).toFixed(2)}</TableCell>
                        <TableCell
                          align='right'
                          sx={{ color: getRankColor(getTopTeamsRank('defensive_fumbles_lost_per_game', 'desc'), topTeamsForRanks.length, 'asc') }}
                        >
                          {getTopTeamsRank('defensive_fumbles_lost_per_game', 'desc')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid size={12}>
                <Typography variant='caption'>* Teams eligible are those that have played at least 33% of their games against Top Teams</Typography>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Container>
  );
}
