'use client';

import { GameData } from '@/app/games/gameData';
import { TeamData } from '@/app/teams/teamData';
import { Autocomplete, Box, Container, Divider, Grid2, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { extractTeamData, getRecord, sumArray } from '../teams/teamHelpers';

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
    <Stack direction='row' sx={{ justifyContent: 'center' }}>
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
  const [teamOneCommonGames, setTeamOneCommonGames] = useState<any>();
  const [teamTwoCommonGames, setTeamTwoCommonGames] = useState<any>();
  const [topTenTeamOneGames, setTopTenTeamOneGames] = useState<any>();
  const [topTenTeamTwoGames, setTopTenTeamTwoGames] = useState<any>();
  const [fetching, setFetching] = useState<boolean>(true);
  const [teamOneInputValue, setTeamOneInputValue] = useState<string>('');
  const [teamOneSelection, setTeamOneSelection] = useState<TeamData | null>(null);
  const [teamTwoInputValue, setTeamTwoInputValue] = useState<string>('');
  const [teamTwoSelection, setTeamTwoSelection] = useState<TeamData | null>(null);

  function findCommonOpponentGames(
    team1Id: number,
    team2Id: number,
    team1Games: GameData[],
    team2Games: GameData[]
  ): { teamOneCommonGames: any; teamTwoCommonGames: any } {
    const team1Opponents = new Set<number>();
    const team2Opponents = new Set<number>();

    team1Games.forEach((game) => {
      if (game.team_one_id === team1Id) {
        team1Opponents.add(game.team_two_id);
      } else if (game.team_two_id === team1Id) {
        team1Opponents.add(game.team_one_id);
      }
    });

    team2Games.forEach((game) => {
      if (game.team_one_id === team2Id) {
        team2Opponents.add(game.team_two_id);
      } else if (game.team_two_id === team2Id) {
        team2Opponents.add(game.team_one_id);
      }
    });

    let teamOneCommonGames: GameData[] = [];
    let teamTwoCommonGames: GameData[] = [];

    team1Games.forEach((game) => {
      const opponentId = game.team_one_id === team1Id ? game.team_two_id : game.team_one_id;
      if (team2Opponents.has(opponentId)) {
        teamOneCommonGames.push(game);
      }
    });

    team2Games.forEach((game) => {
      const opponentId = game.team_one_id === team2Id ? game.team_two_id : game.team_one_id;
      if (team1Opponents.has(opponentId)) {
        teamTwoCommonGames.push(game);
      }
    });

    const teamOneTeamOneCommonGames = [...teamOneCommonGames].filter((x) => x.team_one_id === team1Id);
    const teamOneTeamOneRecord = getRecord(teamOneTeamOneCommonGames, team1Id);
    const teamOneTeamOneCommonGamesSum = sumArray(teamOneTeamOneCommonGames.map((x) => extractTeamData(x, 'team_one_')));
    if (teamOneTeamOneCommonGamesSum) teamOneTeamOneCommonGamesSum['games'] = teamOneTeamOneCommonGames.length;
    const teamOneTeamTwoCommonGames = [...teamOneCommonGames].filter((x) => x.team_two_id === team1Id);
    const teamOneTeamTwoRecord = getRecord(teamOneTeamTwoCommonGames, team1Id);
    const teamOneTeamTwoCommonGamesSum = sumArray(teamOneTeamTwoCommonGames.map((x) => extractTeamData(x, 'team_two_')));
    if (teamOneTeamTwoCommonGamesSum) teamOneTeamTwoCommonGamesSum['games'] = teamOneTeamTwoCommonGames.length;

    const teamOneCommonTenGames =
      teamOneTeamOneCommonGamesSum && teamOneTeamTwoCommonGamesSum
        ? sumArray([teamOneTeamOneCommonGamesSum, teamOneTeamTwoCommonGamesSum])
        : teamOneTeamOneCommonGamesSum
          ? teamOneTeamOneCommonGamesSum
          : teamOneTeamTwoCommonGamesSum;

    teamOneCommonTenGames['wins'] = teamOneTeamOneRecord.wins + teamOneTeamTwoRecord.wins;
    teamOneCommonTenGames['losses'] = teamOneTeamOneRecord.losses + teamOneTeamTwoRecord.losses;
    teamOneCommonTenGames['ties'] = teamOneTeamOneRecord.ties + teamOneTeamTwoRecord.ties;

    const teamTwoTeamOneCommonGames = [...teamTwoCommonGames].filter((x) => x.team_one_id === team2Id);
    const teamTwoOneRecord = getRecord(teamTwoTeamOneCommonGames, team2Id);
    const teamTwoTeamOneCommonGamesSum = sumArray(teamTwoTeamOneCommonGames.map((x) => extractTeamData(x, 'team_one_')));
    if (teamTwoTeamOneCommonGamesSum) teamTwoTeamOneCommonGamesSum['games'] = teamTwoTeamOneCommonGames.length;

    const teamTwoTeamTwoCommonGames = [...teamTwoCommonGames].filter((x) => x.team_two_id === team2Id);
    const teamTwoTeamTwoRecord = getRecord(teamTwoTeamTwoCommonGames, team2Id);
    const teamTwoTeamTwoCommonGamesSum = sumArray(teamTwoTeamTwoCommonGames.map((x) => extractTeamData(x, 'team_two_')));
    if (teamTwoTeamTwoCommonGamesSum) teamTwoTeamTwoCommonGamesSum['games'] = teamTwoTeamTwoCommonGames.length;

    const teamTwoCommonTenGames =
      teamTwoTeamOneCommonGamesSum && teamTwoTeamTwoCommonGamesSum
        ? sumArray([teamTwoTeamOneCommonGamesSum, teamTwoTeamTwoCommonGamesSum])
        : teamTwoTeamOneCommonGamesSum
          ? teamTwoTeamOneCommonGamesSum
          : teamTwoTeamTwoCommonGamesSum;

    teamTwoCommonTenGames['wins'] = teamTwoOneRecord.wins + teamTwoTeamTwoRecord.wins;
    teamTwoCommonTenGames['losses'] = teamTwoOneRecord.losses + teamTwoTeamTwoRecord.losses;
    teamTwoCommonTenGames['ties'] = teamTwoOneRecord.ties + teamTwoTeamTwoRecord.ties;

    console.log(teamOneCommonTenGames, teamTwoCommonTenGames);

    return { teamOneCommonGames: teamOneCommonTenGames, teamTwoCommonGames: teamTwoCommonTenGames };
  }

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

    const { teamOneCommonGames, teamTwoCommonGames } = findCommonOpponentGames(team1?.id!, team2?.id!, teamOneGameData, teamTwoGameData);

    setTeamOne(team1);
    setTeamTwo(team2);
    setAllTeamOneGames(teamOneGameData);
    setAllTeamTwoGames(teamTwoGameData);
    setHeadToHeadGames(headToHeadGames);
    setTeamOneCommonGames(teamOneCommonGames);
    setTeamTwoCommonGames(teamTwoCommonGames);
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
    const teamOneTeamOneRecord = getRecord(teamOneTeamOneTopGames, teamOne.id);
    const teamOneTeamOneTopGamesSum = sumArray(teamOneTeamOneTopGames.map((x) => extractTeamData(x, 'team_one_')));
    if (teamOneTeamOneTopGamesSum) teamOneTeamOneTopGamesSum['games'] = teamOneTeamOneTopGames.length;

    const teamOneTeamTwoTopGames = [...allTeamOneGames].filter((x) => x.team_two_id === teamOne.id && teamOneTopTeams.some((y) => y.id === x.team_one_id));
    const teamOneTeamTwoRecord = getRecord(teamOneTeamTwoTopGames, teamOne.id);
    const teamOneTeamTwoTopGamesSum = sumArray(teamOneTeamTwoTopGames.map((x) => extractTeamData(x, 'team_two_')));
    if (teamOneTeamTwoTopGamesSum) teamOneTeamTwoTopGamesSum['games'] = teamOneTeamTwoTopGames.length;

    const teamOneTopTenGames =
      teamOneTeamOneTopGamesSum && teamOneTeamTwoTopGamesSum
        ? sumArray([teamOneTeamOneTopGamesSum, teamOneTeamTwoTopGamesSum])
        : teamOneTeamOneTopGamesSum
          ? teamOneTeamOneTopGamesSum
          : teamOneTeamTwoTopGamesSum;

    teamOneTopTenGames['wins'] = teamOneTeamOneRecord.wins + teamOneTeamTwoRecord.wins;
    teamOneTopTenGames['losses'] = teamOneTeamOneRecord.losses + teamOneTeamTwoRecord.losses;
    teamOneTopTenGames['ties'] = teamOneTeamOneRecord.ties + teamOneTeamTwoRecord.ties;

    const teamTwoTeamOneTopGames = [...allTeamTwoGames].filter((x) => x.team_one_id === teamTwo.id && teamTwoTopTeams.some((y) => y.id === x.team_two_id));
    const teamTwoOneRecord = getRecord(teamTwoTeamOneTopGames, teamTwo.id);
    const teamTwoTeamOneTopGamesSum = sumArray(teamTwoTeamOneTopGames.map((x) => extractTeamData(x, 'team_one_')));
    if (teamTwoTeamOneTopGamesSum) teamTwoTeamOneTopGamesSum['games'] = teamTwoTeamOneTopGames.length;

    const teamTwoTeamTwoTopGames = [...allTeamTwoGames].filter((x) => x.team_two_id === teamTwo.id && teamTwoTopTeams.some((y) => y.id === x.team_one_id));
    const teamTwoTeamTwoRecord = getRecord(teamTwoTeamTwoTopGames, teamTwo.id);
    const teamTwoTeamTwoTopGamesSum = sumArray(teamTwoTeamTwoTopGames.map((x) => extractTeamData(x, 'team_two_')));
    if (teamTwoTeamTwoTopGamesSum) teamTwoTeamTwoTopGamesSum['games'] = teamTwoTeamTwoTopGames.length;

    const teamTwoTopTenGames =
      teamTwoTeamOneTopGamesSum && teamTwoTeamTwoTopGamesSum
        ? sumArray([teamTwoTeamOneTopGamesSum, teamTwoTeamTwoTopGamesSum])
        : teamTwoTeamOneTopGamesSum
          ? teamTwoTeamOneTopGamesSum
          : teamTwoTeamTwoTopGamesSum;

    teamTwoTopTenGames['wins'] = teamTwoOneRecord.wins + teamTwoTeamTwoRecord.wins;
    teamTwoTopTenGames['losses'] = teamTwoOneRecord.losses + teamTwoTeamTwoRecord.losses;
    teamTwoTopTenGames['ties'] = teamTwoOneRecord.ties + teamTwoTeamTwoRecord.ties;

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
    <Container maxWidth={false}>
      {allTeams && (
        <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'center', my: 2 }}>
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
          <Typography sx={{ px: 1 }}>VS</Typography>
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
        <Grid2 container sx={{ mb: 2 }}>
          <Grid2 size={{ xs: 12, xl: 6 }} sx={{ textAlign: 'center' }} spacing={0}>
            <Divider variant='middle'>
              <Typography typography={{ xs: 'h6' }}>Overall</Typography>
            </Divider>
            <TeamStats team1={teamOne.team_name} team2={teamTwo.team_name} sort='' label='' textSize={{ xs: 'body2' }} decimals={0} />
            <Typography typography={{ xs: 'body1' }} sx={{ pt: 1 }}>
              Offense
            </Typography>
            <TeamStats
              team1={(+teamOne.offensive_rushes / (+teamOne.offensive_rushes + +teamOne.offensive_attempts + +teamOne.offensive_sacks)) * 100.0}
              team2={(+teamTwo.offensive_rushes / (+teamTwo.offensive_rushes + +teamTwo.offensive_attempts + +teamTwo.offensive_sacks)) * 100.0}
              sort=''
              label='Run %'
              textSize={{ xs: 'body2' }}
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
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats team1={+teamOne.offensive_points} team2={+teamTwo.offensive_points} sort='desc' label='Points' textSize={{ xs: 'body2' }} decimals={0} />
            <TeamStats
              team1={+teamOne.offensive_total_yards}
              team2={+teamTwo.offensive_total_yards}
              sort='desc'
              label='Total Yards'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.offensive_rushing_yards}
              team2={+teamTwo.offensive_rushing_yards}
              sort='desc'
              label='Rush Yards'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.offensive_rushing_yards / +teamOne.offensive_rushes}
              team2={+teamTwo.offensive_rushing_yards / +teamTwo.offensive_rushes}
              sort='desc'
              label='Rush YPC'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.offensive_passing_yards}
              team2={+teamTwo.offensive_passing_yards}
              sort='desc'
              label='Pass Yards'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.offensive_passing_yards / +teamOne.offensive_attempts}
              team2={+teamTwo.offensive_passing_yards / +teamTwo.offensive_attempts}
              sort='desc'
              label='Pass YPA'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats team1={+teamOne.offensive_sacks} team2={+teamTwo.offensive_sacks} sort='asc' label='Sacked' textSize={{ xs: 'body2' }} decimals={0} />
            <TeamStats
              team1={+teamOne.offensive_interceptions}
              team2={+teamTwo.offensive_interceptions}
              sort='asc'
              label='Ints'
              textSize={{ xs: 'body2' }}
              decimals={0}
            />
            <TeamStats
              team1={+teamOne.offensive_fumbles_lost}
              team2={+teamTwo.offensive_fumbles_lost}
              sort='asc'
              label='FL'
              textSize={{ xs: 'body2' }}
              decimals={0}
            />
            <Typography typography={{ xs: 'body1' }} sx={{ pt: 1 }}>
              Defense
            </Typography>
            <TeamStats
              team1={+teamOne.defensive_total_yards}
              team2={+teamTwo.defensive_total_yards}
              sort='asc'
              label='Total Yards'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.defensive_rushing_yards}
              team2={+teamTwo.defensive_rushing_yards}
              sort='asc'
              label='Rush Yards'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.defensive_rushing_yards / +teamOne.defensive_rushes}
              team2={+teamTwo.defensive_rushing_yards / +teamOne.defensive_rushes}
              sort='asc'
              label='Rush YPC'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.defensive_passing_yards}
              team2={+teamTwo.defensive_passing_yards}
              sort='asc'
              label='Pass Yards'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={+teamOne.defensive_passing_yards / +teamOne.defensive_attempts}
              team2={+teamTwo.defensive_passing_yards / +teamOne.defensive_attempts}
              sort='asc'
              label='Pass YPA'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats team1={+teamOne.defensive_sacks} team2={+teamTwo.defensive_sacks} sort='desc' label='Sacks' textSize={{ xs: 'body2' }} decimals={0} />
            <TeamStats
              team1={+teamOne.defensive_interceptions}
              team2={+teamTwo.defensive_interceptions}
              sort='desc'
              label='Ints'
              textSize={{ xs: 'body2' }}
              decimals={0}
            />
            <TeamStats
              team1={+teamOne.defensive_fumbles_lost}
              team2={+teamTwo.defensive_fumbles_lost}
              sort='desc'
              label='FF'
              textSize={{ xs: 'body2' }}
              decimals={0}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, xl: 6 }} sx={{ textAlign: 'center' }} spacing={0}>
            <Divider variant='middle'>
              <Typography typography={{ xs: 'h6' }}>VS Top Teams</Typography>
            </Divider>
            <TeamStats team1={teamOne.team_name} team2={teamTwo.team_name} sort='' label='' textSize={{ xs: 'body2' }} decimals={0} />
            <TeamStats
              team1={`${topTenTeamOneGames.wins}-${topTenTeamOneGames.losses}-${topTenTeamOneGames.ties}`}
              team2={`${topTenTeamTwoGames.wins}-${topTenTeamTwoGames.losses}-${topTenTeamTwoGames.ties}`}
              sort=''
              label='Record'
              textSize={{ xs: 'body2' }}
              decimals={0}
            />
            <Typography typography={{ xs: 'body1' }} sx={{ pt: 1 }}>
              Offense
            </Typography>
            <TeamStats
              team1={topTenTeamOneGames.offensive_points / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_points / topTenTeamTwoGames.games}
              sort='desc'
              label='PPG'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_total_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_total_yards / topTenTeamTwoGames.games}
              sort='desc'
              label='Total YPG'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_rushing_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_rushing_yards / topTenTeamTwoGames.games}
              sort='desc'
              label='Rush YPG'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_rushing_yards / topTenTeamOneGames.offensive_rushes}
              team2={topTenTeamTwoGames.offensive_rushing_yards / topTenTeamTwoGames.offensive_rushes}
              sort='desc'
              label='Rush YPC'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_passing_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_passing_yards / topTenTeamTwoGames.games}
              sort='desc'
              label='Pass YPG'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_passing_yards / topTenTeamOneGames.offensive_attempts}
              team2={topTenTeamTwoGames.offensive_passing_yards / topTenTeamTwoGames.offensive_attempts}
              sort='desc'
              label='Pass YPA'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_sacks / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_sacks / topTenTeamTwoGames.games}
              sort='asc'
              label='Sacked/Game'
              textSize={{ xs: 'body2' }}
              decimals={0}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_interceptions / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_interceptions / topTenTeamTwoGames.games}
              sort='asc'
              label='Ints/Game'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.offensive_fumbles_lost / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.offensive_fumbles_lost / topTenTeamTwoGames.games}
              sort='asc'
              label='Fumbles/Game'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <Typography typography={{ xs: 'body1' }} sx={{ pt: 1 }}>
              Defense
            </Typography>
            <TeamStats
              team1={topTenTeamOneGames.defensive_total_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.defensive_total_yards / topTenTeamTwoGames.games}
              sort='asc'
              label='Total YPG'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_rushing_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.defensive_rushing_yards / topTenTeamTwoGames.games}
              sort='asc'
              label='Rush YPG'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_rushing_yards / topTenTeamOneGames.defensive_rushes}
              team2={topTenTeamTwoGames.defensive_rushing_yards / topTenTeamTwoGames.defensive_rushes}
              sort='asc'
              label='Rush YPC'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_passing_yards / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.defensive_passing_yards / topTenTeamTwoGames.games}
              sort='asc'
              label='Pass YPG'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_passing_yards / topTenTeamOneGames.defensive_attempts}
              team2={topTenTeamTwoGames.defensive_passing_yards / topTenTeamTwoGames.defensive_attempts}
              sort='asc'
              label='Pass YPA'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_sacks / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.defensive_sacks / topTenTeamTwoGames.games}
              sort='desc'
              label='Sacks/Game'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_interceptions / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.defensive_interceptions / topTenTeamTwoGames.games}
              sort='desc'
              label='Ints/Game'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
            <TeamStats
              team1={topTenTeamOneGames.defensive_fumbles_lost / topTenTeamOneGames.games}
              team2={topTenTeamTwoGames.defensive_fumbles_lost / topTenTeamTwoGames.games}
              sort='desc'
              label='FF/Game'
              textSize={{ xs: 'body2' }}
              decimals={1}
            />
          </Grid2>
          {headToHeadGames && headToHeadGames.length > 0 && (
            <Grid2 size={{ xs: 12, xl: 6 }} sx={{ textAlign: 'center' }} spacing={1}>
              <Divider variant='middle'>
                <Typography typography={{ xs: 'h6' }}>H2H</Typography>
              </Divider>
              <TeamStats team1={teamOne.team_name} team2={teamTwo.team_name} sort='' label='' textSize={{ xs: 'body2' }} decimals={0} />
              {headToHeadGames.map((x) => (
                <Fragment key={x.id}>
                  <Box>
                    <TeamStats
                      team1={x.team_one_id === teamOne.id ? +x.team_one_points : +x.team_two_points}
                      team2={x.team_one_id === teamOne.id ? +x.team_two_points : +x.team_one_points}
                      sort='desc'
                      label='Score'
                      textSize={{ xs: 'body1' }}
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
                    textSize={{ xs: 'body2' }}
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
                    textSize={{ xs: 'body2' }}
                    decimals={1}
                  />
                  <TeamStats
                    team1={x.team_one_id === teamOne.id ? +x.team_one_rushing_yards : +x.team_two_rushing_yards}
                    team2={x.team_one_id === teamOne.id ? +x.team_two_rushing_yards : +x.team_one_rushing_yards}
                    sort='desc'
                    label='Rush Yards'
                    textSize={{ xs: 'body2' }}
                    decimals={1}
                  />
                  <TeamStats
                    team1={x.team_one_id === teamOne.id ? +x.team_one_passing_yards : +x.team_two_passing_yards}
                    team2={x.team_one_id === teamOne.id ? +x.team_two_passing_yards : +x.team_one_passing_yards}
                    sort='desc'
                    label='Pass Yards'
                    textSize={{ xs: 'body2' }}
                    decimals={1}
                  />
                  <TeamStats
                    team1={x.team_one_id === teamOne.id ? +x.team_two_sacks : +x.team_one_sacks}
                    team2={x.team_one_id === teamOne.id ? +x.team_one_sacks : +x.team_two_sacks}
                    sort='desc'
                    label='Sacks'
                    textSize={{ xs: 'body2' }}
                    decimals={0}
                  />
                  <TeamStats
                    team1={
                      x.team_one_id === teamOne.id ? +x.team_one_interceptions + +x.team_one_fumbles_lost : +x.team_two_interceptions + +x.team_two_fumbles_lost
                    }
                    team2={
                      x.team_one_id === teamOne.id ? +x.team_two_interceptions + +x.team_two_fumbles_lost : +x.team_one_interceptions + +x.team_one_fumbles_lost
                    }
                    sort='asc'
                    label='Turnovers'
                    textSize={{ xs: 'body2' }}
                    decimals={0}
                  />
                </Fragment>
              ))}
            </Grid2>
          )}
          {teamOneCommonGames && teamTwoCommonGames && (
            <Grid2 size={{ xs: 12, xl: 6 }} sx={{ textAlign: 'center' }} spacing={1}>
              <Divider variant='middle'>
                <Typography typography={{ xs: 'h6' }}>Common Opponents</Typography>
              </Divider>
              <TeamStats team1={teamOne.team_name} team2={teamTwo.team_name} sort='' label='' textSize={{ xs: 'body2' }} decimals={0} />
              <TeamStats
                team1={`${teamOneCommonGames.wins}-${teamOneCommonGames.losses}-${teamOneCommonGames.ties}`}
                team2={`${teamTwoCommonGames.wins}-${teamTwoCommonGames.losses}-${teamTwoCommonGames.ties}`}
                sort=''
                label='Record'
                textSize={{ xs: 'body2' }}
                decimals={0}
              />
              <Typography typography={{ xs: 'body1' }} sx={{ pt: 1 }}>
                Offense
              </Typography>
              <TeamStats
                team1={teamOneCommonGames.offensive_points / teamOneCommonGames.games}
                team2={teamTwoCommonGames.offensive_points / teamTwoCommonGames.games}
                sort='desc'
                label={'PPG'}
                textSize={{ xs: 'body2' }}
                decimals={1}
              />
              <TeamStats
                team1={teamOneCommonGames.offensive_total_yards / teamOneCommonGames.games}
                team2={teamTwoCommonGames.offensive_total_yards / teamTwoCommonGames.games}
                sort='desc'
                label={'Total YPG'}
                textSize={{ xs: 'body2' }}
                decimals={1}
              />
              <TeamStats
                team1={teamOneCommonGames.offensive_rushing_yards / teamOneCommonGames.games}
                team2={teamTwoCommonGames.offensive_rushing_yards / teamTwoCommonGames.games}
                sort='desc'
                label={'Rush YPG'}
                textSize={{ xs: 'body2' }}
                decimals={1}
              />
              <TeamStats
                team1={teamOneCommonGames.offensive_rushing_yards / teamOneCommonGames.offensive_rushes}
                team2={teamTwoCommonGames.offensive_rushing_yards / teamTwoCommonGames.offensive_rushes}
                sort='desc'
                label={'Rush YPC'}
                textSize={{ xs: 'body2' }}
                decimals={1}
              />
              <TeamStats
                team1={teamOneCommonGames.offensive_passing_yards / teamOneCommonGames.games}
                team2={teamTwoCommonGames.offensive_passing_yards / teamTwoCommonGames.games}
                sort='desc'
                label={'Pass YPG'}
                textSize={{ xs: 'body2' }}
                decimals={1}
              />
              <TeamStats
                team1={teamOneCommonGames.offensive_passing_yards / teamOneCommonGames.offensive_attempts}
                team2={teamTwoCommonGames.offensive_passing_yards / teamTwoCommonGames.offensive_attempts}
                sort='desc'
                label={'Pass YPA'}
                textSize={{ xs: 'body2' }}
                decimals={1}
              />
              <Typography typography={{ xs: 'body1' }} sx={{ pt: 1 }}>
                Defense
              </Typography>
              <TeamStats
                team1={teamOneCommonGames.defensive_points / teamOneCommonGames.games}
                team2={teamTwoCommonGames.defensive_points / teamTwoCommonGames.games}
                sort='desc'
                label={'PPG'}
                textSize={{ xs: 'body2' }}
                decimals={1}
              />
              <TeamStats
                team1={teamOneCommonGames.defensive_total_yards / teamOneCommonGames.games}
                team2={teamTwoCommonGames.defensive_total_yards / teamTwoCommonGames.games}
                sort='desc'
                label={'Total YPG'}
                textSize={{ xs: 'body2' }}
                decimals={1}
              />
              <TeamStats
                team1={teamOneCommonGames.defensive_rushing_yards / teamOneCommonGames.games}
                team2={teamTwoCommonGames.defensive_rushing_yards / teamTwoCommonGames.games}
                sort='desc'
                label={'Rush YPG'}
                textSize={{ xs: 'body2' }}
                decimals={1}
              />
              <TeamStats
                team1={teamOneCommonGames.defensive_rushing_yards / teamOneCommonGames.defensive_rushes}
                team2={teamTwoCommonGames.defensive_rushing_yards / teamTwoCommonGames.defensive_rushes}
                sort='desc'
                label={'Rush YPC'}
                textSize={{ xs: 'body2' }}
                decimals={1}
              />
              <TeamStats
                team1={teamOneCommonGames.defensive_passing_yards / teamOneCommonGames.games}
                team2={teamTwoCommonGames.defensive_passing_yards / teamTwoCommonGames.games}
                sort='desc'
                label={'Pass YPG'}
                textSize={{ xs: 'body2' }}
                decimals={1}
              />
              <TeamStats
                team1={teamOneCommonGames.defensive_passing_yards / teamOneCommonGames.defensive_attempts}
                team2={teamTwoCommonGames.defensive_passing_yards / teamTwoCommonGames.defensive_attempts}
                sort='desc'
                label={'Pass YPA'}
                textSize={{ xs: 'body2' }}
                decimals={1}
              />
            </Grid2>
          )}
        </Grid2>
      )}
    </Container>
  );
}
