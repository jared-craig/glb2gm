'use client';

import { GameData } from '@/app/games/gameData';
import { TeamData } from '@/app/rankings/teamData';
import { Container, LinearProgress, Stack, Typography } from '@mui/material';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TeamStatsParams {
  team1: string | number;
  team2: string | number;
  sort: string;
  label: string;
  textSize: any;
}

function TeamStats({ team1, team2, sort, label, textSize }: TeamStatsParams) {
  return (
    <Stack direction='row' sx={{ justifyContent: 'space-evenly' }}>
      {typeof team1 === 'string' && typeof team2 === 'string' && (
        <>
          <Typography sx={{ width: '300px', typography: textSize, fontWeight: 'bolder' }}>{team1 ?? 'N/A'}</Typography>
          <Typography sx={{ width: '300px', typography: textSize }}>{label}</Typography>
          <Typography sx={{ width: '300px', typography: textSize }}>{team2 ?? 'N/A'}</Typography>
        </>
      )}
      {typeof team1 === 'number' && typeof team2 === 'number' && team1 > team2 && (
        <>
          <Typography sx={{ width: '300px', typography: textSize, color: sort === 'asc' ? '' : 'green' }}>{team1?.toFixed(1) ?? 'N/A'}</Typography>
          <Typography sx={{ width: '300px', typography: textSize }}>{label}</Typography>
          <Typography sx={{ width: '300px', typography: textSize, color: sort === 'asc' ? 'green' : '' }}>{team2?.toFixed(1) ?? 'N/A'}</Typography>
        </>
      )}
      {typeof team1 === 'number' && typeof team2 === 'number' && team1 < team2 && (
        <>
          <Typography sx={{ width: '300px', typography: textSize, color: sort === 'asc' ? 'green' : '' }}>{team1?.toFixed(1) ?? 'N/A'}</Typography>
          <Typography sx={{ width: '300px', typography: textSize }}>{label}</Typography>
          <Typography sx={{ width: '300px', typography: textSize, color: sort === 'asc' ? '' : 'green' }}>{team2?.toFixed(1) ?? 'N/A'}</Typography>
        </>
      )}
    </Stack>
  );
}

export default function Matchup({ params }: { params: { teamIds: number[] } }) {
  const [allTeams, setAllTeams] = useState<TeamData[]>();
  const [teamOne, setTeamOne] = useState<TeamData>();
  const [teamTwo, setTeamTwo] = useState<TeamData>();
  const [allTeamOneGames, setAllTeamOneGames] = useState<GameData[]>();
  const [allTeamTwoGames, setAllTeamTwoGames] = useState<GameData[]>();
  const [topTenTeamOneGames, setTopTenTeamOneGames] = useState<any>();
  const [topTenTeamTwoGames, setTopTenTeamTwoGames] = useState<any>();
  const [fetching, setFetching] = useState<boolean>(true);

  const fetchData = async () => {
    const teamRes = await fetch('/api/teams');
    const teamData: TeamData[] = await teamRes.json();
    const teamOneGameRes = await fetch(`/api/games?teamId=${params.teamIds[0]}`);
    const teamOneGameData: GameData[] = await teamOneGameRes.json();
    const teamTwoGameRes = await fetch(`/api/games?teamId=${params.teamIds[1]}`);
    const teamTwoGameData: GameData[] = await teamTwoGameRes.json();

    const team1 = teamData.find((x: TeamData) => x.id === +params.teamIds[0]);
    const team2 = teamData.find((x: TeamData) => x.id === +params.teamIds[1]);

    setAllTeams(teamData);
    setTeamOne(team1);
    setTeamTwo(team2);
    setAllTeamOneGames(teamOneGameData);
    setAllTeamTwoGames(teamTwoGameData);
    setFetching(false);
  };

  const extractTeamData = (originalObject: any, keyword: string) => {
    const newObject: any = {};
    for (const property in originalObject) {
      if (property !== 'team_one_id' && property !== 'team_two_id' && property.includes(keyword)) {
        newObject[property.substring(keyword.length)] = originalObject[property];
      }
    }
    return newObject;
  };

  const sumArray = (arr: any[]) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return null; // Handle empty or invalid input
    }
    const firstObject = arr[0]; // Get the structure of the first object
    const properties = Object.keys(firstObject);
    const sumObject: any = {};
    // Initialize sumObject with zeros
    properties.forEach((prop) => {
      sumObject[prop] = 0;
    });
    // Iterate through the array and sum up the properties
    arr.forEach((obj) => {
      properties.forEach((prop) => (sumObject[prop] += +obj[prop]));
    });
    return sumObject;
  };

  const getTopTenGames = () => {
    if (!allTeams || !teamOne || !teamTwo || !allTeamOneGames || !allTeamTwoGames) return;

    const teamOneTopTeams = [...allTeams].filter(
      (x) => x.tier === teamOne.tier && x.tier_rank <= (teamOne.tier === 'Professional' ? 5.0 : 10.0) && x.id !== teamOne.id
    );
    const teamTwoTopTeams = [...allTeams].filter(
      (x) => x.tier === teamTwo.tier && x.tier_rank <= (teamTwo.tier === 'Professional' ? 5.0 : 10.0) && x.id !== teamTwo.id
    );

    const teamOneTeamOneTopGames = [...allTeamOneGames].filter((x) => x.team_one_id === teamOne.id && teamOneTopTeams.some((y) => y.id === x.team_two_id));
    const teamOneTeamOneTopGamesSum = sumArray(teamOneTeamOneTopGames.map((x) => extractTeamData(x, 'team_one_')));
    if (teamOneTeamOneTopGamesSum) teamOneTeamOneTopGamesSum['games'] = teamOneTeamOneTopGames.length;

    const teamOneTeamTwoTopGames = [...allTeamOneGames].filter((x) => x.team_two_id === teamOne.id && teamOneTopTeams.some((y) => y.id === x.team_one_id));
    const teamOneTeamTwoTopGamesSum = sumArray(teamOneTeamTwoTopGames.map((x) => extractTeamData(x, 'team_two_')));
    if (teamOneTeamTwoTopGamesSum) teamOneTeamTwoTopGamesSum['games'] = teamOneTeamTwoTopGames.length;

    const teamOneTopTenGames =
      teamOneTeamOneTopGamesSum && teamOneTeamTwoTopGamesSum
        ? sumArray([teamOneTeamOneTopGamesSum, teamOneTeamTwoTopGamesSum])
        : teamOneTeamOneTopGamesSum
        ? teamOneTeamOneTopGamesSum
        : teamOneTeamTwoTopGamesSum;

    const teamTwoTeamOneTopGames = [...allTeamTwoGames].filter((x) => x.team_one_id === teamTwo.id && teamTwoTopTeams.some((y) => y.id === x.team_two_id));
    const teamTwoTeamOneTopGamesSum = sumArray(teamTwoTeamOneTopGames.map((x) => extractTeamData(x, 'team_one_')));
    if (teamTwoTeamOneTopGamesSum) teamTwoTeamOneTopGamesSum['games'] = teamTwoTeamOneTopGames.length;

    const teamTwoTeamTwoTopGames = [...allTeamTwoGames].filter((x) => x.team_two_id === teamTwo.id && teamTwoTopTeams.some((y) => y.id === x.team_one_id));
    const teamTwoTeamTwoTopGamesSum = sumArray(teamTwoTeamTwoTopGames.map((x) => extractTeamData(x, 'team_two_')));
    if (teamTwoTeamTwoTopGamesSum) teamTwoTeamTwoTopGamesSum['games'] = teamTwoTeamTwoTopGames.length;

    const teamTwoTopTenGames =
      teamTwoTeamOneTopGamesSum && teamTwoTeamTwoTopGamesSum
        ? sumArray([teamTwoTeamOneTopGamesSum, teamTwoTeamTwoTopGamesSum])
        : teamTwoTeamOneTopGamesSum
        ? teamTwoTeamOneTopGamesSum
        : teamTwoTeamTwoTopGamesSum;

    setTopTenTeamOneGames(teamOneTopTenGames);
    setTopTenTeamTwoGames(teamTwoTopTenGames);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getTopTenGames();
  }, [allTeams, teamOne, teamTwo, allTeamOneGames, allTeamTwoGames]);

  if (params.teamIds.length !== 2) return notFound();

  if (fetching) return <LinearProgress sx={{ height: 32, borderRadius: 2 }} />;

  return (
    <Container maxWidth='lg'>
      {(!teamOne || !teamTwo || !topTenTeamOneGames || !topTenTeamTwoGames) && <Typography>Teams not found.</Typography>}
      {teamOne && teamTwo && topTenTeamOneGames && topTenTeamTwoGames && (
        <Stack spacing={4}>
          <Stack sx={{ textAlign: 'center' }} spacing={1}>
            <TeamStats team1={teamOne.team_name} team2={teamTwo.team_name} sort='asc' label='vs' textSize={{ xs: 'body2', sm: 'body1', md: 'h6' }} />
            <Typography variant='h6'>Overall</Typography>
            <TeamStats
              team1={+teamOne.offensive_total_yards}
              team2={+teamTwo.offensive_total_yards}
              sort='desc'
              label='Total Yards'
              textSize={{ xs: 'body2', sm: 'body1' }}
            />
            <TeamStats
              team1={+teamOne.offensive_rushing_yards}
              team2={+teamTwo.offensive_rushing_yards}
              sort='desc'
              label='Rush Yards'
              textSize={{ xs: 'body2', sm: 'body1' }}
            />
            <TeamStats
              team1={+teamOne.offensive_rushing_yards / +teamOne.offensive_rushes}
              team2={+teamTwo.offensive_rushing_yards / +teamTwo.offensive_rushes}
              sort='desc'
              label='Rush YPC'
              textSize={{ xs: 'body2', sm: 'body1' }}
            />
            <TeamStats
              team1={+teamOne.offensive_passing_yards}
              team2={+teamTwo.offensive_passing_yards}
              sort='desc'
              label='Pass Yards'
              textSize={{ xs: 'body2', sm: 'body1' }}
            />
            <TeamStats
              team1={+teamOne.offensive_passing_yards / +teamOne.offensive_attempts}
              team2={+teamTwo.offensive_passing_yards / +teamTwo.offensive_attempts}
              sort='desc'
              label='Pass YPA'
              textSize={{ xs: 'body2', sm: 'body1' }}
            />
            <TeamStats
              team1={+teamOne.defensive_total_yards}
              team2={+teamTwo.defensive_total_yards}
              sort='asc'
              label='Total Yards Alw.'
              textSize={{ xs: 'body2', sm: 'body1' }}
            />
            <TeamStats
              team1={+teamOne.defensive_rushing_yards}
              team2={+teamTwo.defensive_rushing_yards}
              sort='asc'
              label='Rush Yards Alw.'
              textSize={{ xs: 'body2', sm: 'body1' }}
            />
            <TeamStats
              team1={+teamOne.defensive_passing_yards}
              team2={+teamTwo.defensive_passing_yards}
              sort='asc'
              label='Pass Yards Alw.'
              textSize={{ xs: 'body2', sm: 'body1' }}
            />
          </Stack>
          <Stack sx={{ textAlign: 'center' }} spacing={1}>
            <Typography variant='h6'>VS Top Teams</Typography>
            <TeamStats
              team1={topTenTeamOneGames.total_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.total_yards / topTenTeamTwoGames.games}
              sort='desc'
              label='Yards Per Game'
              textSize={{ xs: 'body2', sm: 'body1' }}
            />
            <TeamStats
              team1={topTenTeamOneGames.total_yards / (topTenTeamOneGames.rushes + topTenTeamOneGames.completions)}
              team2={topTenTeamTwoGames.total_yards / (topTenTeamTwoGames.rushes + topTenTeamTwoGames.completions)}
              sort='desc'
              label='Yards Per Play'
              textSize={{ xs: 'body2', sm: 'body1' }}
            />
            <TeamStats
              team1={topTenTeamOneGames.rushing_yards / topTenTeamOneGames.rushes}
              team2={topTenTeamTwoGames.rushing_yards / topTenTeamTwoGames.rushes}
              sort='desc'
              label='Rushing YPC'
              textSize={{ xs: 'body2', sm: 'body1' }}
            />
            <TeamStats
              team1={topTenTeamOneGames.passing_yards / topTenTeamOneGames.attempts}
              team2={topTenTeamTwoGames.passing_yards / topTenTeamTwoGames.attempts}
              sort='desc'
              label='Passing YPA'
              textSize={{ xs: 'body2', sm: 'body1' }}
            />
          </Stack>
        </Stack>
      )}
    </Container>
  );
}
