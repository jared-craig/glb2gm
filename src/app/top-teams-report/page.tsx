'use client';

import { useEffect, useState } from 'react';
import { Container, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { TeamData } from '@/app/teams/teamData';
import { GameData } from '@/app/games/gameData';
import { extractTeamData, getRecord, getTopTeamRank, sumArray } from '@/app/teams/teamHelpers';
import StatSection from './StatSection';

export default function TopTeamsReport() {
  const [data, setData] = useState<TeamData[]>([]);
  const [extraData, setExtraData] = useState<any[]>([]);
  const [allGamesData, setAllGamesData] = useState<GameData[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);

  const fetchData = async () => {
    const res = await fetch('/api/teams');
    const data: TeamData[] = await res.json();
    const gamesRes = await fetch(`/api/games`);
    const gamesData: GameData[] = await gamesRes.json();
    setData(data);
    setAllGamesData(gamesData);
    setGamesPlayed(data[0].wins + data[0].losses + data[0].ties);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (allGamesData.length <= 0) return;

    let extraTeamData: any[] = [];
    data.forEach((teamData) => {
      const allTeamGames = allGamesData.filter((x) => x.team_one_id === teamData.id || x.team_two_id === teamData.id);
      let topTeams: TeamData[] = [];
      if (teamData.tier === 'Professional') {
        topTeams = [...data].filter(
          (x) =>
            (x.tier === teamData.tier && x.tier_rank <= getTopTeamRank(teamData.tier) && x.id !== teamData.id) ||
            (x.tier === 'Veteran' && (x.global_rank <= teamData.global_rank || x.global_rank <= 10.0) && x.id !== teamData.id)
        );
      } else {
        topTeams = [...data].filter((x) => x.tier === teamData.tier && x.tier_rank <= getTopTeamRank(teamData.tier) && x.id !== teamData.id);
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
    setExtraData(extraTeamData);
  }, [allGamesData]);

  return (
    <Container maxWidth={false}>
      {extraData.length > 0 && (
        <Grid container sx={{ mb: 1 }} spacing={2} columnSpacing={4}>
          {['Rookie', 'Sophomore', 'Professional', 'Veteran'].map((tier) => (
            <Grid key={tier} container size={{ xs: 12, md: 6, xl: 3 }} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
              <Grid size={12}>
                <Typography variant='h6'>{tier}</Typography>
              </Grid>
              <StatSection
                stat='total_yards_differential'
                title='Total Yards Diff'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort(
                    (a, b) =>
                      (b.topTeamGames?.offensive_total_yards - b.topTeamGames?.defensive_total_yards) / b.topTeamGames?.games -
                      (a.topTeamGames?.offensive_total_yards - a.topTeamGames?.defensive_total_yards) / a.topTeamGames?.games
                  )
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='offensive_total_yards'
                title='Offensive Total Yards'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort((a, b) => b.topTeamGames?.offensive_total_yards / b.topTeamGames?.games - a.topTeamGames?.offensive_total_yards / a.topTeamGames?.games)
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='offensive_passing_yards'
                title='Offensive Pass Yards'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort(
                    (a, b) => b.topTeamGames?.offensive_passing_yards / b.topTeamGames?.games - a.topTeamGames?.offensive_passing_yards / a.topTeamGames?.games
                  )
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='offensive_rushing_yards'
                title='Offensive Rush Yards'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort(
                    (a, b) => b.topTeamGames?.offensive_rushing_yards / b.topTeamGames?.games - a.topTeamGames?.offensive_rushing_yards / a.topTeamGames?.games
                  )
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='defensive_total_yards'
                title='Defensive Total Yards'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort((a, b) => a.topTeamGames?.defensive_total_yards / a.topTeamGames?.games - b.topTeamGames?.defensive_total_yards / b.topTeamGames?.games)
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='defensive_passing_yards'
                title='Defensive Pass Yards'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort(
                    (a, b) => a.topTeamGames?.defensive_passing_yards / a.topTeamGames?.games - b.topTeamGames?.defensive_passing_yards / b.topTeamGames?.games
                  )
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='defensive_rushing_yards'
                title='Defensive Rush Yards'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort(
                    (a, b) => a.topTeamGames?.defensive_rushing_yards / a.topTeamGames?.games - b.topTeamGames?.defensive_rushing_yards / b.topTeamGames?.games
                  )
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='defensive_sacks'
                title='Sacks'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort((a, b) => b.topTeamGames?.defensive_sacks / b.topTeamGames?.games - a.topTeamGames?.defensive_sacks / a.topTeamGames?.games)
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='turnover_differential'
                title='Turnover Diff'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort(
                    (a, b) =>
                      (b.topTeamGames?.defensive_interceptions +
                        b.topTeamGames?.defensive_fumbles_lost -
                        b.topTeamGames?.offensive_interceptions -
                        b.topTeamGames?.offensive_fumbles_lost) /
                        b.topTeamGames?.games -
                      (a.topTeamGames?.defensive_interceptions +
                        a.topTeamGames?.defensive_fumbles_lost -
                        a.topTeamGames?.offensive_interceptions -
                        a.topTeamGames?.offensive_fumbles_lost) /
                        a.topTeamGames?.games
                  )
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='defensive_turnovers'
                title='Turnovers'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort(
                    (a, b) =>
                      (b.topTeamGames?.defensive_interceptions + b.topTeamGames?.defensive_fumbles_lost) / b.topTeamGames?.games -
                      (a.topTeamGames?.defensive_interceptions + a.topTeamGames?.defensive_fumbles_lost) / a.topTeamGames?.games
                  )
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='defensive_interceptions'
                title='Interceptions'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort(
                    (a, b) => b.topTeamGames?.defensive_interceptions / b.topTeamGames?.games - a.topTeamGames?.defensive_interceptions / a.topTeamGames?.games
                  )
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='defensive_fumbles'
                title='Forced Fumbles'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort((a, b) => b.topTeamGames?.defensive_fumbles / b.topTeamGames?.games - a.topTeamGames?.defensive_fumbles / a.topTeamGames?.games)
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='point_differential'
                title='Point Diff'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort(
                    (a, b) =>
                      (b.topTeamGames?.offensive_points - b.topTeamGames?.defensive_points) / b.topTeamGames?.games -
                      (a.topTeamGames?.offensive_points - a.topTeamGames?.defensive_points) / a.topTeamGames?.games
                  )
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='offensive_points'
                title='Points Scored'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort((a, b) => b.topTeamGames?.offensive_points / b.topTeamGames?.games - a.topTeamGames?.offensive_points / a.topTeamGames?.games)
                  .slice(0, 5)}
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <StatSection
                stat='defensive_points'
                title='Points Allowed'
                filteredData={extraData
                  .filter((x) => x.tier === tier && x.topTeamGames?.games / gamesPlayed >= 0.33)
                  .sort((a, b) => a.topTeamGames?.defensive_points / a.topTeamGames?.games - b.topTeamGames?.defensive_points / b.topTeamGames?.games)
                  .slice(0, 5)}
              />
            </Grid>
          ))}
          <Grid size={12}>
            <Typography variant='body2' color='secondary' sx={{ mt: 1 }}>
              * Teams eligible are those that have played at least 33% of their games against Top Teams
            </Typography>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
