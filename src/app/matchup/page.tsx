'use client';

import { GameData } from '@/app/games/gameData';
import { TeamData } from '@/app/teams/teamData';
import { Autocomplete, Box, Container, Divider, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { extractTeamData, sumArray } from './topTeamHelpers';

interface TeamStatsParams {
  team1: string | number;
  team2: string | number;
  sort: string;
  label: string;
  textSize: any;
  decimals: number;
}

function TeamStats({ team1, team2, sort, label, textSize, decimals }: TeamStatsParams) {
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
          <Typography sx={{ width: '300px', typography: textSize, color: sort === 'asc' ? '' : sort === 'desc' ? 'green' : '' }}>
            {team1?.toFixed(decimals) ?? 'N/A'}
          </Typography>
          <Typography sx={{ width: '300px', typography: textSize }}>{label}</Typography>
          <Typography sx={{ width: '300px', typography: textSize, color: sort === 'asc' ? 'green' : '' }}>{team2?.toFixed(decimals) ?? 'N/A'}</Typography>
        </>
      )}
      {typeof team1 === 'number' && typeof team2 === 'number' && team1 < team2 && (
        <>
          <Typography sx={{ width: '300px', typography: textSize, color: sort === 'asc' ? 'green' : '' }}>{team1?.toFixed(decimals) ?? 'N/A'}</Typography>
          <Typography sx={{ width: '300px', typography: textSize }}>{label}</Typography>
          <Typography sx={{ width: '300px', typography: textSize, color: sort === 'asc' ? '' : sort === 'desc' ? 'green' : '' }}>
            {team2?.toFixed(decimals) ?? 'N/A'}
          </Typography>
        </>
      )}
      {typeof team1 === 'number' && typeof team2 === 'number' && team1 == team2 && (
        <>
          <Typography sx={{ width: '300px', typography: textSize }}>{team1?.toFixed(decimals) ?? 'N/A'}</Typography>
          <Typography sx={{ width: '300px', typography: textSize }}>{label}</Typography>
          <Typography sx={{ width: '300px', typography: textSize }}>{team2?.toFixed(decimals) ?? 'N/A'}</Typography>
        </>
      )}
    </Stack>
  );
}

export default function Matchup() {
  const [allTeams, setAllTeams] = useState<TeamData[]>();
  const [teamOne, setTeamOne] = useState<TeamData>();
  const [teamTwo, setTeamTwo] = useState<TeamData>();
  const [allTeamOneGames, setAllTeamOneGames] = useState<GameData[]>();
  const [allTeamTwoGames, setAllTeamTwoGames] = useState<GameData[]>();
  const [headToHeadGames, setHeadToHeadGames] = useState<GameData[]>();
  const [topTenTeamOneGames, setTopTenTeamOneGames] = useState<any>();
  const [topTenTeamTwoGames, setTopTenTeamTwoGames] = useState<any>();
  const [fetching, setFetching] = useState<boolean>(true);
  const [teamOneInputValue, setTeamOneInputValue] = useState<string>('');
  const [teamOneSelection, setTeamOneSelection] = useState<TeamData | null>(null);
  const [teamTwoInputValue, setTeamTwoInputValue] = useState<string>('');
  const [teamTwoSelection, setTeamTwoSelection] = useState<TeamData | null>(null);

  const fetchData = async () => {
    setFetching(true);
    const teamRes = await fetch('/api/teams');
    const teamData: TeamData[] = await teamRes.json();
    setAllTeams(teamData);
    setFetching(false);
  };

  const fetchTeams = async () => {
    if (!allTeams || !teamOneSelection || !teamTwoSelection) return;
    setFetching(true);
    const teamOneGameRes = await fetch(`/api/games?teamId=${teamOneSelection.id}`);
    const teamOneGameData: GameData[] = await teamOneGameRes.json();
    const teamTwoGameRes = await fetch(`/api/games?teamId=${teamTwoSelection.id}`);
    const teamTwoGameData: GameData[] = await teamTwoGameRes.json();

    const team1 = allTeams.find((x: TeamData) => x.id === teamOneSelection.id);
    const team2 = allTeams.find((x: TeamData) => x.id === teamTwoSelection.id);

    const headToHeadGames = teamOneGameData.filter(
      (x) => (x.team_one_id === team1?.id && x.team_two_id === team2?.id) || (x.team_one_id === team2?.id && x.team_two_id === team1?.id)
    );

    setTeamOne(team1);
    setTeamTwo(team2);
    setAllTeamOneGames(teamOneGameData);
    setAllTeamTwoGames(teamTwoGameData);
    setHeadToHeadGames(headToHeadGames);
    setFetching(false);
  };

  const getTopTenGames = () => {
    if (!allTeams || !teamOne || !teamTwo || !allTeamOneGames || !allTeamTwoGames) return;

    const teamOneTopTeams = [...allTeams].filter(
      (x) => x.tier === teamOne.tier && x.tier_rank <= (teamOne.tier === 'Professional' ? 6.0 : 10.0) && x.id !== teamOne.id
    );
    const teamTwoTopTeams = [...allTeams].filter(
      (x) => x.tier === teamTwo.tier && x.tier_rank <= (teamTwo.tier === 'Professional' ? 6.0 : 10.0) && x.id !== teamTwo.id
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

    console.log(teamOneTopTenGames);
    setTopTenTeamOneGames(teamOneTopTenGames);
    setTopTenTeamTwoGames(teamTwoTopTenGames);
  };

  const getTierAbbreviation = (tier: string) => {
    switch (tier) {
      case 'Rookie':
        return 'Rook';
      case 'Sophomore':
        return 'Soph';
      case 'Professional':
        return 'Pro';
      case 'Veteran':
        return 'Vet';
      default:
        return tier;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [teamOneSelection, teamTwoSelection]);

  useEffect(() => {
    getTopTenGames();
  }, [teamOne, teamTwo, allTeamOneGames, allTeamTwoGames]);

  if (fetching) return <LinearProgress sx={{ borderRadius: 2 }} />;

  return (
    <Container maxWidth='lg'>
      {allTeams && (
        <Stack direction={{ xs: 'column', md: 'row' }} sx={{ alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
          <Autocomplete
            options={allTeams}
            getOptionLabel={(x) => `${x.team_name} (${getTierAbbreviation(x.tier)})`}
            renderInput={(params) => <TextField {...params} label='Team One' />}
            value={teamOneSelection}
            onChange={(event, newValue) => {
              setTeamOneSelection(newValue);
            }}
            inputValue={teamOneInputValue}
            onInputChange={(event, newInputValue) => {
              setTeamOneInputValue(newInputValue);
            }}
            disablePortal
            fullWidth
            size='small'
            sx={{ maxWidth: 400 }}
          />
          <Typography>VS</Typography>
          <Autocomplete
            options={allTeams}
            getOptionLabel={(x) => `${x.team_name} (${getTierAbbreviation(x.tier)})`}
            renderInput={(params) => <TextField {...params} label='Team Two' />}
            value={teamTwoSelection}
            onChange={(event, newValue) => {
              setTeamTwoSelection(newValue);
            }}
            inputValue={teamTwoInputValue}
            onInputChange={(event, newInputValue) => {
              setTeamTwoInputValue(newInputValue);
            }}
            disablePortal
            fullWidth
            size='small'
            sx={{ maxWidth: 400 }}
          />
        </Stack>
      )}
      {teamOne && teamTwo && topTenTeamOneGames && topTenTeamTwoGames && (
        <Stack spacing={4} sx={{ mb: 2 }}>
          {headToHeadGames && headToHeadGames.length > 0 && (
            <Stack sx={{ textAlign: 'center' }} spacing={1}>
              <Divider variant='middle'>
                <Typography typography={{ xs: 'h6', sm: 'h5' }}>H2H</Typography>
              </Divider>
              {headToHeadGames.map((x) => (
                <Fragment key={x.id}>
                  <Stack spacing={0} sx={{ py: 1 }}>
                    <Box>
                      <TeamStats
                        team1={x.team_one_id === teamOne.id ? +x.team_one_points : +x.team_two_points}
                        team2={x.team_one_id === teamOne.id ? +x.team_two_points : +x.team_one_points}
                        sort='desc'
                        label='Score'
                        textSize={{ xs: 'body1', sm: 'h6' }}
                        decimals={0}
                      />
                    </Box>
                    <TeamStats
                      team1={
                        x.team_one_id === teamOne.id
                          ? (+x.team_one_rushes / (+x.team_one_rushes + +x.team_one_attempts + +x.team_one_sacks)) * 100.0
                          : (+x.team_two_rushes / (+x.team_two_rushes + +x.team_two_attempts + +x.team_two_sacks)) * 100.0
                      }
                      team2={
                        x.team_one_id === teamOne.id
                          ? (+x.team_two_rushes / (+x.team_two_rushes + +x.team_two_attempts + +x.team_two_sacks)) * 100.0
                          : (+x.team_one_rushes / (+x.team_one_rushes + +x.team_one_attempts + +x.team_one_sacks)) * 100.0
                      }
                      sort=''
                      label='Run %'
                      textSize={{ xs: 'body2', sm: 'body1' }}
                      decimals={1}
                    />
                    <TeamStats
                      team1={
                        x.team_one_id === teamOne.id
                          ? ((+x.team_one_attempts + +x.team_one_sacks) / (+x.team_one_rushes + +x.team_one_attempts + +x.team_one_sacks)) * 100.0
                          : ((+x.team_two_attempts + +x.team_one_sacks) / (+x.team_two_rushes + +x.team_two_attempts + +x.team_two_sacks)) * 100.0
                      }
                      team2={
                        x.team_one_id === teamOne.id
                          ? ((+x.team_two_attempts + +x.team_one_sacks) / (+x.team_two_rushes + +x.team_two_attempts + +x.team_two_sacks)) * 100.0
                          : ((+x.team_one_attempts + +x.team_one_sacks) / (+x.team_one_rushes + +x.team_one_attempts + +x.team_one_sacks)) * 100.0
                      }
                      sort=''
                      label='Pass %'
                      textSize={{ xs: 'body2', sm: 'body1' }}
                      decimals={1}
                    />
                    <TeamStats
                      team1={x.team_one_id === teamOne.id ? +x.team_one_rushing_yards : +x.team_two_rushing_yards}
                      team2={x.team_one_id === teamOne.id ? +x.team_two_rushing_yards : +x.team_one_rushing_yards}
                      sort='desc'
                      label='Rush Yards'
                      textSize={{ xs: 'body2', sm: 'body1' }}
                      decimals={1}
                    />
                    <TeamStats
                      team1={x.team_one_id === teamOne.id ? +x.team_one_passing_yards : +x.team_two_passing_yards}
                      team2={x.team_one_id === teamOne.id ? +x.team_two_passing_yards : +x.team_one_passing_yards}
                      sort='desc'
                      label='Pass Yards'
                      textSize={{ xs: 'body2', sm: 'body1' }}
                      decimals={1}
                    />
                    <TeamStats
                      team1={x.team_one_id === teamOne.id ? +x.team_two_sacks : +x.team_one_sacks}
                      team2={x.team_one_id === teamOne.id ? +x.team_one_sacks : +x.team_two_sacks}
                      sort='desc'
                      label='Sacks'
                      textSize={{ xs: 'body2', sm: 'body1' }}
                      decimals={0}
                    />
                    <TeamStats
                      team1={
                        x.team_one_id === teamOne.id
                          ? +x.team_one_interceptions + +x.team_one_fumbles_lost
                          : +x.team_two_interceptions + +x.team_two_fumbles_lost
                      }
                      team2={
                        x.team_one_id === teamOne.id
                          ? +x.team_two_interceptions + +x.team_two_fumbles_lost
                          : +x.team_one_interceptions + +x.team_one_fumbles_lost
                      }
                      sort='asc'
                      label='Turnovers'
                      textSize={{ xs: 'body2', sm: 'body1' }}
                      decimals={0}
                    />
                  </Stack>
                </Fragment>
              ))}
            </Stack>
          )}
          <Stack sx={{ textAlign: 'center' }} spacing={0}>
            <Divider variant='middle'>
              <Typography typography={{ xs: 'h6', sm: 'h5' }}>Overall</Typography>
            </Divider>
            <Typography typography={{ xs: 'body1', sm: 'h6' }}>Offense</Typography>
            <TeamStats
              team1={(+teamOne.offensive_rushes / (+teamOne.offensive_rushes + +teamOne.offensive_attempts + +teamOne.offensive_sacks)) * 100.0}
              team2={(+teamTwo.offensive_rushes / (+teamTwo.offensive_rushes + +teamTwo.offensive_attempts + +teamTwo.offensive_sacks)) * 100.0}
              sort=''
              label='Run %'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={
                ((+teamOne.offensive_attempts + +teamOne.offensive_sacks) /
                  (+teamOne.offensive_rushes + +teamOne.offensive_attempts + +teamOne.offensive_sacks)) *
                100.0
              }
              team2={
                ((+teamTwo.offensive_attempts + +teamTwo.offensive_sacks) /
                  (+teamTwo.offensive_rushes + +teamTwo.offensive_attempts + +teamTwo.offensive_sacks)) *
                100.0
              }
              sort=''
              label='Pass %'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.offensive_total_yards}
              team2={+teamTwo.offensive_total_yards}
              sort='desc'
              label='Total Yards'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.offensive_rushing_yards}
              team2={+teamTwo.offensive_rushing_yards}
              sort='desc'
              label='Rush Yards'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.offensive_rushing_yards / +teamOne.offensive_rushes}
              team2={+teamTwo.offensive_rushing_yards / +teamTwo.offensive_rushes}
              sort='desc'
              label='Rush YPC'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.offensive_passing_yards}
              team2={+teamTwo.offensive_passing_yards}
              sort='desc'
              label='Pass Yards'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.offensive_passing_yards / +teamOne.offensive_attempts}
              team2={+teamTwo.offensive_passing_yards / +teamTwo.offensive_attempts}
              sort='desc'
              label='Pass YPA'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.offensive_sacks}
              team2={+teamTwo.offensive_sacks}
              sort='asc'
              label='Sacks Taken'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={0}
            />
            <TeamStats
              team1={+teamOne.offensive_interceptions}
              team2={+teamTwo.offensive_interceptions}
              sort='asc'
              label='Interceptions'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={0}
            />
            <TeamStats
              team1={+teamOne.offensive_fumbles_lost}
              team2={+teamTwo.offensive_fumbles_lost}
              sort='asc'
              label='Fumbles Lost'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={0}
            />
            <Typography typography={{ xs: 'body1', sm: 'h6' }} sx={{ pt: 1 }}>
              Defense
            </Typography>
            <TeamStats
              team1={+teamOne.defensive_total_yards}
              team2={+teamTwo.defensive_total_yards}
              sort='asc'
              label='Total Yards'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.defensive_rushing_yards}
              team2={+teamTwo.defensive_rushing_yards}
              sort='asc'
              label='Rush Yards'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.defensive_rushing_yards / +teamOne.defensive_rushes}
              team2={+teamTwo.defensive_rushing_yards / +teamOne.defensive_rushes}
              sort='asc'
              label='Rush YPC'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.defensive_passing_yards}
              team2={+teamTwo.defensive_passing_yards}
              sort='asc'
              label='Pass Yards'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.defensive_passing_yards / +teamOne.defensive_attempts}
              team2={+teamTwo.defensive_passing_yards / +teamOne.defensive_attempts}
              sort='asc'
              label='Pass YPA'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.defensive_sacks}
              team2={+teamTwo.defensive_sacks}
              sort='desc'
              label='Sacks'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={0}
            />
            <TeamStats
              team1={+teamOne.defensive_interceptions}
              team2={+teamTwo.defensive_interceptions}
              sort='desc'
              label='Interceptions'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={0}
            />
            <TeamStats
              team1={+teamOne.defensive_fumbles_lost}
              team2={+teamTwo.defensive_fumbles_lost}
              sort='desc'
              label='Forced Fumbles'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={0}
            />
          </Stack>
          <Stack sx={{ textAlign: 'center' }} spacing={0}>
            <Divider variant='middle'>
              <Typography typography={{ xs: 'h6', sm: 'h5' }}>VS Top Teams</Typography>
            </Divider>
            <Typography typography={{ xs: 'body1', sm: 'h6' }}>Offense</Typography>
            <TeamStats
              team1={topTenTeamOneGames.offensive_total_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_total_yards / topTenTeamTwoGames.games}
              sort='desc'
              label='Total YPG'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_rushing_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_rushing_yards / topTenTeamTwoGames.games}
              sort='desc'
              label='Rush YPG'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_rushing_yards / topTenTeamOneGames.offensive_rushes}
              team2={topTenTeamTwoGames.offensive_rushing_yards / topTenTeamTwoGames.offensive_rushes}
              sort='desc'
              label='Rush YPC'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_passing_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_passing_yards / topTenTeamTwoGames.games}
              sort='desc'
              label='Pass YPG'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_passing_yards / topTenTeamOneGames.offensive_attempts}
              team2={topTenTeamTwoGames.offensive_passing_yards / topTenTeamTwoGames.offensive_attempts}
              sort='desc'
              label='Pass YPA'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_sacks / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_sacks / topTenTeamTwoGames.games}
              sort='asc'
              label='Sacks Taken/Game'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={0}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_interceptions / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_interceptions / topTenTeamTwoGames.games}
              sort='asc'
              label='Ints/Game'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_fumbles_lost / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_fumbles_lost / topTenTeamTwoGames.games}
              sort='asc'
              label='Fumbles/Game'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <Typography typography={{ xs: 'body1', sm: 'h6' }} sx={{ pt: 1 }}>
              Defense
            </Typography>
            <TeamStats
              team1={topTenTeamOneGames.defensive_total_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.defensive_total_yards / topTenTeamTwoGames.games}
              sort='asc'
              label='Total YPG'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_rushing_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.defensive_rushing_yards / topTenTeamTwoGames.games}
              sort='asc'
              label='Rush YPG'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_rushing_yards / topTenTeamOneGames.defensive_rushes}
              team2={topTenTeamTwoGames.defensive_rushing_yards / topTenTeamTwoGames.defensive_rushes}
              sort='asc'
              label='Rush YPC'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_passing_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.defensive_passing_yards / topTenTeamTwoGames.games}
              sort='asc'
              label='Pass YPG'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_passing_yards / topTenTeamOneGames.defensive_attempts}
              team2={topTenTeamTwoGames.defensive_passing_yards / topTenTeamTwoGames.defensive_attempts}
              sort='asc'
              label='Pass YPA'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_sacks / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.defensive_sacks / topTenTeamTwoGames.games}
              sort='desc'
              label='Sacks/Game'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_interceptions / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.defensive_interceptions / topTenTeamTwoGames.games}
              sort='desc'
              label='Ints/Game'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_fumbles_lost / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.defensive_fumbles_lost / topTenTeamTwoGames.games}
              sort='desc'
              label='FF/Game'
              textSize={{ xs: 'body2', sm: 'body1' }}
              decimals={1}
            />
          </Stack>
        </Stack>
      )}
    </Container>
  );
}
