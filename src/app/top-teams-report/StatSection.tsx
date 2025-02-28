'use client';

import { Fragment } from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { TeamData } from '@/app/teams/teamData';
import Link from 'next/link';

interface StatSectionParams {
  stat: string;
  title: string;
  filteredData: any[];
}

export default function StatSection({ stat, title, filteredData }: StatSectionParams) {
  const getStat = (teamData: any) => {
    switch (stat) {
      case 'total_yards_differential':
        return ((teamData.topTeamGames.offensive_total_yards - teamData.topTeamGames.defensive_total_yards) / teamData.topTeamGames.games).toFixed(1);
      case 'turnover_differential':
        return (
          (teamData.topTeamGames.defensive_interceptions +
            teamData.topTeamGames.defensive_fumbles_lost -
            teamData.topTeamGames.offensive_interceptions -
            teamData.topTeamGames.offensive_fumbles_lost) /
          teamData.topTeamGames.games
        ).toFixed(1);
      case 'defensive_turnovers':
        return ((teamData.topTeamGames.defensive_interceptions + teamData.topTeamGames.defensive_fumbles_lost) / teamData.topTeamGames.games).toFixed(1);
      case 'point_differential':
        return ((teamData.topTeamGames.offensive_points - teamData.topTeamGames.defensive_points) / teamData.topTeamGames.games).toFixed(1);
      default:
        return (teamData.topTeamGames[stat as keyof TeamData] / teamData.topTeamGames.games).toFixed(1);
    }
  };

  return (
    <>
      <Grid size={6}>
        <Typography variant='body1' color='secondary'>
          {title}
        </Typography>
      </Grid>
      <Grid size={2}>
        <Typography variant='body1'>Avg</Typography>
      </Grid>
      <Grid size={4} sx={{ textAlign: 'right' }}>
        <Typography variant='body1'>Top Games</Typography>
      </Grid>
      {filteredData.map((teamData) => (
        <Fragment key={teamData.id}>
          <Grid size={6}>
            <Typography variant='body2' noWrap>
              <Link
                href={`/team-details/${teamData.team_id}`}
                style={{ color: 'inherit', textDecoration: 'inherit', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
              >
                {teamData.team_name}
              </Link>
            </Typography>
          </Grid>
          <Grid size={2}>
            <Typography variant='body2'>{getStat(teamData)}</Typography>
          </Grid>
          <Grid size={4} sx={{ textAlign: 'right' }}>
            <Typography variant='body2'>{teamData.topTeamGames.games}</Typography>
          </Grid>
        </Fragment>
      ))}
    </>
  );
}
