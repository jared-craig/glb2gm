'use client';

import { useEffect, useState } from 'react';
import { TeamData } from '../../teams/teamData';
import { Container, LinearProgress, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import { GameData } from '@/app/games/gameData';
import { sumArray, extractTeamData, getRecord, getTopTeamRank } from '@/app/teams/teamHelpers';
import { getRankColor } from '@/app/helpers';

export default function TeamDetails({ params }: { params: { teamId: string } }) {
  const [leagueData, setLeagueData] = useState<TeamData[]>();
  const [allTeams, setAllTeams] = useState<TeamData[]>();
  const [teamData, setTeamData] = useState<TeamData>();
  const [allTeamOneGames, setAllTeamOneGames] = useState<GameData[]>();
  const [topTenGames, setTopTenGames] = useState<any>();

  const fetchData = async () => {
    const res = await fetch('/api/teams');
    const data = await res.json();
    const teamOneGameRes = await fetch(`/api/games?teamId=${params.teamId}`);
    const teamOneGameData: GameData[] = await teamOneGameRes.json();
    const currentTeam = data.find((x: TeamData) => x.id === +params.teamId);
    setLeagueData(data.filter((x: TeamData) => x.league === currentTeam.league));
    setTeamData(currentTeam);
    setAllTeams(data);
    setAllTeamOneGames(teamOneGameData);
  };

  const getTopTenGames = () => {
    if (!allTeams || !teamData || !allTeamOneGames) return;

    const teamOneTopTeams = [...allTeams].filter((x) => x.tier === teamData.tier && x.tier_rank <= getTopTeamRank(teamData.tier) && x.id !== teamData.id);

    const teamOneTopGames = [...allTeamOneGames].filter((x) => x.team_one_id === teamData.id && teamOneTopTeams.some((y) => y.id === x.team_two_id));
    const teamOneRecord = getRecord(teamOneTopGames, teamData.id);
    const teamOneTopGamesSum = sumArray(teamOneTopGames.map((x) => extractTeamData(x, 'team_one_')));
    if (teamOneTopGamesSum) teamOneTopGamesSum['games'] = teamOneTopGames.length;
    const teamTwoTopGames = [...allTeamOneGames].filter((x) => x.team_two_id === teamData.id && teamOneTopTeams.some((y) => y.id === x.team_one_id));
    const teamTwoRecord = getRecord(teamTwoTopGames, teamData.id);
    const teamTwoTopGamesSum = sumArray(teamTwoTopGames.map((x) => extractTeamData(x, 'team_two_')));
    if (teamTwoTopGamesSum) teamTwoTopGamesSum['games'] = teamTwoTopGames.length;

    const topTenGames =
      teamOneTopGamesSum && teamTwoTopGamesSum
        ? sumArray([teamOneTopGamesSum, teamTwoTopGamesSum])
        : teamOneTopGamesSum
          ? teamOneTopGamesSum
          : teamTwoTopGamesSum;

    if (!topTenGames) {
      setTopTenGames(null);
      return;
    }

    topTenGames['wins'] = teamOneRecord.wins + teamTwoRecord.wins;
    topTenGames['losses'] = teamOneRecord.losses + teamTwoRecord.losses;
    topTenGames['ties'] = teamOneRecord.ties + teamTwoRecord.ties;

    setTopTenGames(topTenGames);
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

  const getLeagueRank = (stat: string, dir: string): string => {
    if (!teamData || !leagueData) return 'N/A';
    const sortedLeague = sortLeagueData(stat, dir);
    return formatWithOrdinal(sortedLeague.map((x) => x.id).indexOf(teamData.id) + 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getTopTenGames();
  }, [allTeams, teamData, allTeamOneGames]);

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
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Run:{' '}
                  {((+teamData.offensive_rushes / (+teamData.offensive_rushes + +teamData.offensive_attempts + +teamData.offensive_sacks)) * 100.0).toFixed(1)}%
                </Typography>
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                  Pass:{' '}
                  {(
                    ((+teamData.offensive_attempts + +teamData.offensive_sacks) /
                      (+teamData.offensive_rushes + +teamData.offensive_attempts + +teamData.offensive_sacks)) *
                    100.0
                  ).toFixed(1)}
                  %
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
                    color: getRankColor(getLeagueRank('offensive_sacks', 'asc'), leagueData.length, 'desc'),
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
                    color: getRankColor(getLeagueRank('offensive_interceptions', 'asc'), leagueData.length, 'desc'),
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
                    color: getRankColor(getLeagueRank('offensive_fumbles_lost', 'asc'), leagueData.length, 'desc'),
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
                <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>Total Yards: {teamData.defensive_total_yards}</Typography>
                <Typography
                  sx={{
                    typography: { xs: 'body2', sm: 'body2' },
                    color: getRankColor(getLeagueRank('defensive_total_yards', 'asc'), leagueData.length, 'desc'),
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
                    color: getRankColor(getLeagueRank('defensive_rushing_yards', 'asc'), leagueData.length, 'desc'),
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
                    color: getRankColor(getLeagueRank('defensive_rushing_yards_per_carry', 'asc'), leagueData.length, 'desc'),
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
                    color: getRankColor(getLeagueRank('defensive_passing_yards', 'asc'), leagueData.length, 'desc'),
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
                    color: getRankColor(getLeagueRank('defensive_passing_yards_per_attempt', 'asc'), leagueData.length, 'desc'),
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
            <Typography variant='caption'>* ( out of {leagueData.length} League Teams )</Typography>
          </Grid>
          {topTenGames && (
            <>
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ typography: { xs: 'h6', sm: 'h6' } }}>
                  VS Top Teams ({topTenGames.wins}-{topTenGames.losses}-{topTenGames.ties})
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={{ xs: 0, md: 0.5 }}>
                  <Typography sx={{ typography: { xs: 'body1', sm: 'body1' } }}>Offense</Typography>
                  <Stack direction='row' spacing={1}>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Run:{' '}
                      {(
                        (+topTenGames.offensive_rushes / (+topTenGames.offensive_rushes + +topTenGames.offensive_attempts + +topTenGames.offensive_sacks)) *
                        100.0
                      ).toFixed(1)}
                      %
                    </Typography>
                    <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                      Pass:{' '}
                      {(
                        ((+topTenGames.offensive_attempts + +topTenGames.offensive_sacks) /
                          (+topTenGames.offensive_rushes + +topTenGames.offensive_attempts + +topTenGames.offensive_sacks)) *
                        100.0
                      ).toFixed(1)}
                      %
                    </Typography>
                  </Stack>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Total YPG: {(topTenGames.offensive_total_yards / topTenGames.games).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Rushing YPG: {(topTenGames.offensive_rushing_yards / topTenGames.games).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Rushing YPC: {(topTenGames.offensive_rushing_yards / topTenGames.offensive_rushes).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Passing YPG: {(topTenGames.offensive_passing_yards / topTenGames.games).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Passing YPA: {(topTenGames.offensive_passing_yards / topTenGames.offensive_attempts).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Sacks Taken/Game: {(topTenGames.offensive_sacks / topTenGames.games).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Interceptions/Game: {(topTenGames.offensive_interceptions / topTenGames.games).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Fumbles/Game: {(topTenGames.offensive_fumbles_lost / topTenGames.games).toFixed(2)}
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={{ xs: 0, md: 0.5 }}>
                  <Typography sx={{ typography: { xs: 'body1', sm: 'body1' } }}>Defense</Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Total YPG: {(topTenGames.defensive_total_yards / topTenGames.games).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Rushing YPG: {(topTenGames.defensive_rushing_yards / topTenGames.games).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Rushing YPC: {(topTenGames.defensive_rushing_yards / topTenGames.defensive_rushes).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Passing YPG: {(topTenGames.defensive_passing_yards / topTenGames.games).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Passing YPA: {(topTenGames.defensive_passing_yards / topTenGames.defensive_attempts).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Sacks/Game: {(topTenGames.defensive_sacks / topTenGames.games).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Interceptions/Game: {(topTenGames.defensive_interceptions / topTenGames.games).toFixed(2)}
                  </Typography>
                  <Typography sx={{ typography: { xs: 'body2', sm: 'body2' } }}>
                    Forced Fumbles/Game: {(topTenGames.defensive_fumbles_lost / topTenGames.games).toFixed(2)}
                  </Typography>
                </Stack>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Container>
  );
}
