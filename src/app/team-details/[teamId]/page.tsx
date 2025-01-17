'use client';

import { useEffect, useState, use } from 'react';
import { TeamData } from '../../teams/teamData';
import { Container, LinearProgress, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { GameData } from '@/app/games/gameData';
import { sumArray, extractTeamData, getRecord, getTopTeamRank } from '@/app/teams/teamHelpers';
import { formatWithOrdinal, getRankColor } from '@/app/helpers';

export default function TeamDetails(props: { params: Promise<{ teamId: string }> }) {
  const params = use(props.params);
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
    const gamesRes = await fetch(`/api/games`);
    const gamesData: GameData[] = await gamesRes.json();
    const currentTeam = data.find((x: TeamData) => x.id === +params.teamId);
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
      const allTeamGames = allGamesData.filter((x) => x.team_one_id === teamData.id || x.team_two_id === teamData.id);
      let topTeams: TeamData[] = [];
      if (teamData.tier === 'Professional') {
        topTeams = [...allTeams].filter(
          (x) =>
            (x.tier === teamData.tier && x.tier_rank <= getTopTeamRank(teamData.tier) && x.id !== teamData.id) ||
            (x.tier === 'Veteran' && (x.global_rank <= teamData.global_rank || x.global_rank <= 10.0) && x.id !== teamData.id)
        );
      } else {
        topTeams = [...allTeams].filter((x) => x.tier === teamData.tier && x.tier_rank <= getTopTeamRank(teamData.tier) && x.id !== teamData.id);
      }

      const teamOneTopTeamGames = [...allTeamGames].filter((x) => x.team_one_id === teamData.id && topTeams.some((y) => y.id === x.team_two_id));
      const teamOneRecord = getRecord(teamOneTopTeamGames, teamData.id);
      const teamOneTopGamesSum = sumArray(teamOneTopTeamGames.map((x) => extractTeamData(x, 'team_one_')));
      if (teamOneTopGamesSum) teamOneTopGamesSum['games'] = teamOneTopTeamGames.length;
      const teamTwoTopTeamGames = [...allTeamGames].filter((x) => x.team_two_id === teamData.id && topTeams.some((y) => y.id === x.team_one_id));
      const teamTwoRecord = getRecord(teamTwoTopTeamGames, teamData.id);
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
          id: teamData.id,
          team_name: teamData.team_name,
          tier: teamData.tier,
          topTeamGames,
        },
      ];
    });
    setTopTeamGames(extraTeamData.find((x) => x.id === teamData.id)?.topTeamGames);
    setTopTeamsForRanks(extraTeamData.filter((x) => x.tier === teamData.tier && x.topTeamGames?.games / gamesPlayed >= 0.33));
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

  const sortTopTeamsData = (stat: string, dir: string): TeamData[] => {
    if (!topTeamsForRanks) return [];
    switch (stat) {
      case 'offensive_points_scored_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(b.topTeamGames.offensive_points / b.topTeamGames.games) - +(a.topTeamGames.offensive_points / a.topTeamGames.games)
        );
      case 'offensive_total_yards_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(b.topTeamGames.offensive_total_yards / b.topTeamGames.games) - +(a.topTeamGames.offensive_total_yards / a.topTeamGames.games)
        );
      case 'offensive_rushing_yards_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(b.topTeamGames.offensive_rushing_yards / b.topTeamGames.games) - +(a.topTeamGames.offensive_rushing_yards / a.topTeamGames.games)
        );
      case 'offensive_rushing_yards_per_carry':
        return [...topTeamsForRanks].sort((a, b) => +(b.offensive_rushing_yards / +b.offensive_rushes) - +(a.offensive_rushing_yards / +a.offensive_rushes));
      case 'offensive_passing_yards_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(b.topTeamGames.offensive_passing_yards / b.topTeamGames.games) - +(a.topTeamGames.offensive_passing_yards / a.topTeamGames.games)
        );
      case 'offensive_passing_yards_per_attempt':
        return [...topTeamsForRanks].sort(
          (a, b) => +(b.offensive_passing_yards / +b.offensive_attempts) - +(a.offensive_passing_yards / +a.offensive_attempts)
        );
      case 'offensive_sacks_taken_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(a.topTeamGames.offensive_sacks / a.topTeamGames.games) - +(b.topTeamGames.offensive_sacks / b.topTeamGames.games)
        );
      case 'offensive_interceptions_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(a.topTeamGames.offensive_interceptions / a.topTeamGames.games) - +(b.topTeamGames.offensive_interceptions / b.topTeamGames.games)
        );
      case 'offensive_fumbles_lost_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(a.topTeamGames.offensive_fumbles_lost / a.topTeamGames.games) - +(b.topTeamGames.offensive_fumbles_lost / b.topTeamGames.games)
        );
      case 'defensive_points_allowed_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(a.topTeamGames.defensive_points / a.topTeamGames.games) - +(b.topTeamGames.defensive_points / b.topTeamGames.games)
        );
      case 'defensive_total_yards_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(a.topTeamGames.defensive_total_yards / a.topTeamGames.games) - +(b.topTeamGames.defensive_total_yards / b.topTeamGames.games)
        );
      case 'defensive_rushing_yards_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(a.topTeamGames.defensive_rushing_yards / a.topTeamGames.games) - +(b.topTeamGames.defensive_rushing_yards / b.topTeamGames.games)
        );
      case 'defensive_rushing_yards_per_carry':
        return [...topTeamsForRanks].sort((a, b) => +(a.defensive_rushing_yards / +a.defensive_rushes) - +(b.defensive_rushing_yards / +b.defensive_rushes));
      case 'defensive_passing_yards_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(a.topTeamGames.defensive_passing_yards / a.topTeamGames.games) - +(b.topTeamGames.defensive_passing_yards / b.topTeamGames.games)
        );
      case 'defensive_passing_yards_per_attempt':
        return [...topTeamsForRanks].sort(
          (a, b) => +(a.defensive_passing_yards / +a.defensive_attempts) - +(b.defensive_passing_yards / +b.defensive_attempts)
        );
      case 'defensive_sacks_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(b.topTeamGames.defensive_sacks / b.topTeamGames.games) - +(a.topTeamGames.defensive_sacks / a.topTeamGames.games)
        );
      case 'defensive_interceptions_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(b.topTeamGames.defensive_interceptions / b.topTeamGames.games) - +(a.topTeamGames.defensive_interceptions / a.topTeamGames.games)
        );
      case 'defensive_fumbles_lost_per_game':
        return [...topTeamsForRanks].sort(
          (a, b) => +(b.topTeamGames.defensive_fumbles_lost / b.topTeamGames.games) - +(a.topTeamGames.defensive_fumbles_lost / a.topTeamGames.games)
        );
      default:
        if (dir === 'asc') {
          return [...topTeamsForRanks].sort((a, b) => +a[stat as keyof TeamData] - +b[stat as keyof TeamData]);
        } else {
          return [...topTeamsForRanks].sort((a, b) => +b[stat as keyof TeamData] - +a[stat as keyof TeamData]);
        }
    }
  };

  const getLeagueRank = (stat: string, dir: string): string => {
    if (!teamData || !leagueData) return 'N/A';
    const sortedLeague = sortLeagueData(stat, dir);
    return formatWithOrdinal(sortedLeague.map((x) => x.id).indexOf(teamData.id) + 1);
  };

  const getTopTeamsRank = (stat: string, dir: string): string => {
    if (!teamData || !topTeamsForRanks) return 'N/A';
    const sortedTopTeamsData = sortTopTeamsData(stat, dir);
    return formatWithOrdinal(sortedTopTeamsData.map((x) => x.id).indexOf(teamData.id) + 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getTopTeamGames();
  }, [allTeams, teamData, allGamesData]);

  return (
    <Container maxWidth='xl'>
      {(!teamData || !leagueData) && <LinearProgress sx={{ borderRadius: 2 }} />}
      {teamData && leagueData && (
        <Grid container rowSpacing={{ xs: 1, sm: 2 }}>
          <Grid size={{ xs: 12 }}>
            <Stack spacing={-0.5}>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h5' } }}>{teamData.team_name}</Typography>
              <Typography variant='caption'>
                {teamData.tier} - {teamData.league}
              </Typography>
              <Typography variant='caption'>Owner: {teamData.owner}</Typography>
              <Link href={`https://glb2.warriorgeneral.com/game/team/${params.teamId}`} target='_blank' style={{ color: 'inherit' }}>
                <Typography variant='caption'>GLB2 Link</Typography>
              </Link>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Stack direction='row' spacing={2}>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Global: {teamData.global_rank}</Typography>
              <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>Tier: {teamData.tier_rank}</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>
              Overall ({teamData.wins}-{teamData.losses}-{teamData.ties})
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={{ xs: 0, md: 0.5 }}>
              <Typography sx={{ typography: { xs: 'body1', sm: 'body1' } }}>Offense</Typography>
              <Stack direction='row' spacing={1}>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                  }}
                >
                  Points Scored: {teamData.offensive_points}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('offensive_points', 'desc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('offensive_points', 'desc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                  }}
                >
                  Total Yards: {teamData.offensive_total_yards}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('offensive_total_yards', 'desc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('offensive_total_yards', 'desc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Rushing Yards: {teamData.offensive_rushing_yards}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('offensive_rushing_yards', 'desc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('offensive_rushing_yards', 'desc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Rushing YPC: {(+teamData.offensive_rushing_yards / +teamData.offensive_rushes).toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('offensive_rushing_yards_per_carry', 'desc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('offensive_rushing_yards_per_carry', 'desc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Passing Yards: {teamData.offensive_passing_yards}</Typography>{' '}
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('offensive_passing_yards', 'desc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('offensive_passing_yards', 'desc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Passing YPA: {(+teamData.offensive_passing_yards / +teamData.offensive_attempts).toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('offensive_passing_yards_per_attempt', 'desc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('offensive_passing_yards_per_attempt', 'desc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Sacks Taken: {teamData.offensive_sacks}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('offensive_sacks', 'asc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('offensive_sacks', 'asc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Interceptions: {teamData.offensive_interceptions}</Typography>{' '}
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('offensive_interceptions', 'asc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('offensive_interceptions', 'asc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Fumbles Lost: {teamData.offensive_fumbles_lost}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('offensive_fumbles_lost', 'asc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('offensive_fumbles_lost', 'asc')} )
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={{ xs: 0, md: 0.5 }}>
              <Typography sx={{ typography: { xs: 'body1', sm: 'body1' } }}>Defense</Typography>
              <Stack direction='row' spacing={1}>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                  }}
                >
                  Points Allowed: {teamData.defensive_points}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('defensive_points', 'asc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('defensive_points', 'asc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Total Yards: {teamData.defensive_total_yards}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('defensive_total_yards', 'asc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('defensive_total_yards', 'asc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Rushing Yards: {teamData.defensive_rushing_yards}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('defensive_rushing_yards', 'asc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('defensive_rushing_yards', 'asc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Rushing YPC: {(+teamData.defensive_rushing_yards / +teamData.defensive_rushes).toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('defensive_rushing_yards_per_carry', 'asc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('defensive_rushing_yards_per_carry', 'asc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Passing Yards: {teamData.defensive_passing_yards}</Typography>{' '}
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('defensive_passing_yards', 'asc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('defensive_passing_yards', 'asc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Passing YPA: {(+teamData.defensive_passing_yards / +teamData.defensive_attempts).toFixed(2)}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('defensive_passing_yards_per_attempt', 'asc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('defensive_passing_yards_per_attempt', 'asc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Sacks: {teamData.defensive_sacks}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('defensive_sacks', 'desc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('defensive_sacks', 'desc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Interceptions: {teamData.defensive_interceptions}</Typography>{' '}
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('defensive_interceptions', 'desc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('defensive_interceptions', 'desc')} )
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Forced Fumbles: {teamData.defensive_fumbles_lost}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('defensive_fumbles_lost', 'desc'), leagueData.length, 'asc'),
                  }}
                >
                  ( {getLeagueRank('defensive_fumbles_lost', 'desc')} )
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={12}>
            <Typography variant='caption'>
              * ( out of {leagueData.length} {teamData.league} Teams )
            </Typography>
          </Grid>
          {topTeamGames && topTeamsForRanks && topTeamsForRanks.some((x) => x.id === teamData.id) && (
            <>
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>
                  VS Top Teams ({topTeamGames.wins}-{topTeamGames.losses}-{topTeamGames.ties})
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={{ xs: 0, md: 0.5 }}>
                  <Typography sx={{ typography: { xs: 'body1', sm: 'body1' } }}>Offense</Typography>
                  <Stack direction='row' spacing={1}>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                      }}
                    >
                      Points Scored/Game: {(topTeamGames.offensive_points / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('offensive_points_scored_per_game', 'desc'), leagueData.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('offensive_points_scored_per_game', 'desc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Total YPG: {(topTeamGames.offensive_total_yards / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('offensive_total_yards_per_game', 'desc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('offensive_total_yards_per_game', 'desc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Rushing YPG: {(topTeamGames.offensive_rushing_yards / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('offensive_rushing_yards_per_game', 'desc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('offensive_rushing_yards_per_game', 'desc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Rushing YPC: {(topTeamGames.offensive_rushing_yards / topTeamGames.offensive_rushes).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('offensive_rushing_yards_per_carry', 'desc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('offensive_rushing_yards_per_carry', 'desc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Passing YPG: {(topTeamGames.offensive_passing_yards / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('offensive_passing_yards_per_game', 'desc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('offensive_passing_yards_per_game', 'desc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Passing YPA: {(topTeamGames.offensive_passing_yards / topTeamGames.offensive_attempts).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('offensive_passing_yards_per_attempt', 'desc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('offensive_passing_yards_per_attempt', 'desc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Sacks Taken/Game: {(topTeamGames.offensive_sacks / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('offensive_sacks_taken_per_game', 'asc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('offensive_sacks_taken_per_game', 'asc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Interceptions/Game: {(topTeamGames.offensive_interceptions / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('offensive_interceptions_per_game', 'asc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('offensive_interceptions_per_game', 'asc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Fumbles/Game: {(topTeamGames.offensive_fumbles_lost / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('offensive_fumbles_lost_per_game', 'asc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('offensive_fumbles_lost_per_game', 'asc')} )
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={{ xs: 0, md: 0.5 }}>
                  <Typography sx={{ typography: { xs: 'body1', sm: 'body1' } }}>Defense</Typography>
                  <Stack direction='row' spacing={1}>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                      }}
                    >
                      Points Allowed/Game: {(topTeamGames.defensive_points / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('defensive_points_allowed_per_game', 'desc'), leagueData.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('defensive_points_allowed_per_game', 'desc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Total YPG: {(topTeamGames.defensive_total_yards / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('defensive_total_yards_per_game', 'asc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('defensive_total_yards_per_game', 'asc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Rushing YPG: {(topTeamGames.defensive_rushing_yards / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('defensive_rushing_yards_per_game', 'asc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('defensive_rushing_yards_per_game', 'asc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Rushing YPC: {(topTeamGames.defensive_rushing_yards / topTeamGames.defensive_rushes).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('defensive_rushing_yards_per_carry', 'asc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('defensive_rushing_yards_per_carry', 'asc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Passing YPG: {(topTeamGames.defensive_passing_yards / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('defensive_passing_yards_per_game', 'asc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('defensive_passing_yards_per_game', 'asc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Passing YPA: {(topTeamGames.defensive_passing_yards / topTeamGames.defensive_attempts).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('defensive_passing_yards_per_attempt', 'asc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('defensive_passing_yards_per_attempt', 'asc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Sacks/Game: {(topTeamGames.defensive_sacks / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('defensive_sacks_per_game', 'desc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('defensive_sacks_per_game', 'desc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Interceptions/Game: {(topTeamGames.defensive_interceptions / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('defensive_interceptions_per_game', 'desc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('defensive_interceptions_per_game', 'desc')} )
                    </Typography>
                  </Stack>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Forced Fumbles/Game: {(topTeamGames.defensive_fumbles_lost / topTeamGames.games).toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        typography: { xs: 'body2', sm: 'body2' },
                        color: getRankColor(getTopTeamsRank('defensive_fumbles_lost_per_game', 'desc'), topTeamsForRanks.length, 'asc'),
                      }}
                    >
                      ( {getTopTeamsRank('defensive_fumbles_lost_per_game', 'desc')} )
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid size={12}>
                <Typography variant='caption'>* ( out of {topTeamsForRanks.length} Top Teams )</Typography>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Container>
  );
}
