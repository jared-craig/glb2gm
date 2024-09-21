'use client';

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
          <Typography sx={{ width: '400px', typography: textSize, fontWeight: 'bolder' }}>{team1 ?? 'N/A'}</Typography>
          <Typography sx={{ width: '400px', typography: textSize }}>{label}</Typography>
          <Typography sx={{ width: '400px', typography: textSize }}>{team2 ?? 'N/A'}</Typography>
        </>
      )}
      {typeof team1 === 'number' && typeof team2 === 'number' && team1 > team2 && (
        <>
          <Typography sx={{ width: '400px', typography: textSize, color: sort === 'asc' ? '' : 'green' }}>{team1 ?? 'N/A'}</Typography>
          <Typography sx={{ width: '400px', typography: textSize }}>{label}</Typography>
          <Typography sx={{ width: '400px', typography: textSize, color: sort === 'asc' ? 'green' : '' }}>{team2 ?? 'N/A'}</Typography>
        </>
      )}
      {typeof team1 === 'number' && typeof team2 === 'number' && team1 < team2 && (
        <>
          <Typography sx={{ width: '400px', typography: textSize, color: sort === 'asc' ? 'green' : '' }}>{team1 ?? 'N/A'}</Typography>
          <Typography sx={{ width: '400px', typography: textSize }}>{label}</Typography>
          <Typography sx={{ width: '400px', typography: textSize, color: sort === 'asc' ? '' : 'green' }}>{team2 ?? 'N/A'}</Typography>
        </>
      )}
    </Stack>
  );
}

export default function Matchup({ params }: { params: { teamIds: number[] } }) {
  const [teamOne, setTeamOne] = useState<TeamData>();
  const [teamTwo, setTeamTwo] = useState<TeamData>();
  const [fetching, setFetching] = useState<boolean>(true);

  const fetchData = async () => {
    const res = await fetch('/api/teams');
    const data: TeamData[] = await res.json();
    console.log(data.sort((a, b) => a.id - b.id));
    const team1 = data.find((x: TeamData) => x.id === +params.teamIds[0]);
    const team2 = data.find((x: TeamData) => x.id === +params.teamIds[1]);
    console.log(team1?.team_name, team2?.team_name);
    setTeamOne(team1);
    setTeamTwo(team2);
    setFetching(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (params.teamIds.length !== 2) return notFound();

  if (fetching) return <LinearProgress sx={{ height: 32, borderRadius: 2 }} />;

  return (
    <Container maxWidth='lg'>
      {(!teamOne || !teamTwo) && <Typography>Teams not found.</Typography>}
      {teamOne && teamTwo && (
        <Stack sx={{ textAlign: 'center' }} spacing={1}>
          <TeamStats team1={teamOne.team_name} team2={teamTwo.team_name} sort='asc' label='vs' textSize={{ xs: 'body2', sm: 'body1', md: 'h6' }} />
          <TeamStats
            team1={+teamOne.offensive_total_yards}
            team2={+teamTwo.offensive_total_yards}
            sort='desc'
            label='Offensive Yards'
            textSize={{ xs: 'body2', sm: 'body1' }}
          />
          <TeamStats
            team1={+teamOne.offensive_rushing_yards}
            team2={+teamTwo.offensive_rushing_yards}
            sort='desc'
            label='Rushing Yards'
            textSize={{ xs: 'body2', sm: 'body1' }}
          />
          <TeamStats
            team1={+teamOne.offensive_passing_yards}
            team2={+teamTwo.offensive_passing_yards}
            sort='desc'
            label='Passing Yards'
            textSize={{ xs: 'body2', sm: 'body1' }}
          />
          <TeamStats
            team1={+teamOne.defensive_total_yards}
            team2={+teamTwo.defensive_total_yards}
            sort='asc'
            label='Defensive Yards'
            textSize={{ xs: 'body2', sm: 'body1' }}
          />
          <TeamStats
            team1={+teamOne.defensive_rushing_yards}
            team2={+teamTwo.defensive_rushing_yards}
            sort='asc'
            label='Rushing Yards'
            textSize={{ xs: 'body2', sm: 'body1' }}
          />
          <TeamStats
            team1={+teamOne.defensive_passing_yards}
            team2={+teamTwo.defensive_passing_yards}
            sort='asc'
            label='Passing Yards'
            textSize={{ xs: 'body2', sm: 'body1' }}
          />
        </Stack>
      )}
    </Container>
  );
}
