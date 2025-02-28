'use client';

import { DataGridPremium, GridColDef, GridComparatorFn, GridRenderCellParams } from '@mui/x-data-grid-premium';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { TeamData } from '../teams/teamData';
import { getTeamGmRating } from '../stats/statCalculations';
import { GameData } from '../games/gameData';
import { getNotTopTeams, getTopTeams } from '../teams/teamHelpers';

export default function Rankings() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<TeamData[]>([]);
  const [allGamesData, setAllGamesData] = useState<GameData[]>([]);
  const [rows, setRows] = useState<TeamData[]>([]);
  const [tier, setTier] = useState<string>('Veteran');

  const fetchData = async () => {
    const res = await fetch('/api/teams');
    const data: TeamData[] = await res.json();
    const gamesRes = await fetch(`/api/games`);
    const gamesData: GameData[] = await gamesRes.json();
    setData(data);
    setAllGamesData(gamesData);
    setRows(data.filter((x: TeamData) => x.tier === tier));
    setFetched(true);
  };

  const recordComparator: GridComparatorFn<string> = (v1, v2) => +v1.substring(0, v1.indexOf('-')) - +v2.substring(0, v2.indexOf('-'));

  const getBonusData = (teamData: TeamData): number => {
    const allTeamGames = allGamesData.filter((x) => x.team_one_id === teamData.team_id || x.team_two_id === teamData.team_id);
    const topTeams: TeamData[] = getTopTeams(teamData, data);

    const notTopTeams: TeamData[] = getNotTopTeams(teamData, data);

    const teamOneTopTeamWins = [...allTeamGames].filter(
      (x) => x.team_one_id === teamData.team_id && topTeams.some((y) => y.team_id === x.team_two_id) && x.team_one_points > x.team_two_points
    );
    const teamTwoTopTeamWins = [...allTeamGames].filter(
      (x) => x.team_two_id === teamData.team_id && topTeams.some((y) => y.team_id === x.team_one_id) && x.team_one_points < x.team_two_points
    );

    const teamOneBadTeamLosses = [...allTeamGames].filter(
      (x) => x.team_one_id === teamData.team_id && notTopTeams.some((y) => y.team_id === x.team_two_id) && x.team_one_points < x.team_two_points
    );
    const teamTwoBadTeamLosses = [...allTeamGames].filter(
      (x) => x.team_two_id === teamData.team_id && notTopTeams.some((y) => y.team_id === x.team_one_id) && x.team_one_points > x.team_two_points
    );

    const topTeamWins = teamOneTopTeamWins.length + teamTwoTopTeamWins.length;
    const badTeamLosses = teamOneBadTeamLosses.length + teamTwoBadTeamLosses.length;

    const pointDiff = teamData.offensive_points - teamData.defensive_points;
    const yardDiff = teamData.offensive_total_yards - teamData.defensive_total_yards;

    const bonusFactor = 100.0;

    const gamesPlayed = teamData.wins + teamData.losses + teamData.ties;

    const bonus =
      bonusFactor * topTeamWins -
      (bonusFactor / 10.0) * badTeamLosses +
      Math.round(((pointDiff / 100.0) * 10.0) / gamesPlayed) +
      Math.round(yardDiff / 1000.0 / gamesPlayed);

    return bonus;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(data.filter((x: TeamData) => x.tier === tier));
  }, [tier]);

  const columns: GridColDef[] = !desktop
    ? [
        {
          field: 'team_name',
          headerName: 'TEAM',
          width: 140,
          renderCell: (params: GridRenderCellParams<any, string>) => (
            <Link href={`/team-details/${params.row.team_id}`} target='_blank' style={{ color: 'inherit', textDecoration: 'inherit' }}>
              <strong>{params.value}</strong>
            </Link>
          ),
          disableColumnMenu: true,
        },
        {
          field: 'tier_rank',
          headerName: 'TIER',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'global_rank',
          headerName: 'GLOBAL',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'overall_record',
          headerName: 'W-L-T',
          width: 120,
          pinnable: false,
          disableColumnMenu: true,
          valueGetter: (value, row) => {
            return `${row.wins}-${row.losses}-${row.ties}`;
          },
          sortComparator: recordComparator,
          headerAlign: 'right',
          align: 'right',
        },
        {
          field: 'offensive_total_yards',
          headerName: 'OFF TOTAL YDS',
          width: 140,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          sortingOrder: ['desc', 'asc'],
        },
        {
          field: 'offensive_rushing_yards',
          headerName: 'OFF RUSH YDS',
          width: 140,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          sortingOrder: ['desc', 'asc'],
        },
        {
          field: 'offensive_passing_yards',
          headerName: 'OFF PASS YDS',
          width: 140,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          sortingOrder: ['desc', 'asc'],
        },
        {
          field: 'offensive_points',
          headerName: 'OFF POINTS',
          width: 140,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          sortingOrder: ['desc', 'asc'],
        },
        {
          field: 'defensive_total_yards',
          headerName: 'DEF TOTAL YDS',
          width: 140,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'defensive_rushing_yards',
          headerName: 'DEF RUSH YDS',
          width: 140,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'defensive_passing_yards',
          headerName: 'DEF PASS YDS',
          width: 140,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'defensive_points',
          headerName: 'PTS ALLOWED',
          width: 140,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'yard_dif',
          headerName: 'YARD DIF',
          width: 140,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          sortingOrder: ['desc', 'asc'],
          valueGetter: (value, row) => {
            return row.offensive_total_yards - row.defensive_total_yards;
          },
        },
        {
          field: 'point_dif',
          headerName: 'POINT DIF',
          width: 140,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          sortingOrder: ['desc', 'asc'],
          valueGetter: (value, row) => {
            return row.offensive_points - row.defensive_points;
          },
        },
        {
          field: 'gm_rating',
          headerName: 'GM RTG',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getTeamGmRating(row, getBonusData(row));
          },
          disableColumnMenu: true,
        },
      ]
    : [
        {
          field: 'team_name',
          headerName: 'TEAM',
          flex: 1.5,
          renderCell: (params: GridRenderCellParams<any, string>) => (
            <Stack sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              <Link
                href={`/team-details/${params.row.team_id}`}
                target='_blank'
                style={{ color: 'inherit', textDecoration: 'inherit', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
              >
                <strong>{params.value}</strong>
              </Link>
              <Typography variant='caption'>{params.row.owner}</Typography>
            </Stack>
          ),
        },
        {
          field: 'tier_rank',
          headerName: 'TIER',
          flex: 0.6,
          type: 'number',
          pinnable: false,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'global_rank',
          headerName: 'GLOBAL',
          flex: 0.6,
          type: 'number',
          pinnable: false,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'overall_record',
          headerName: 'Overall',
          flex: 0.6,
          pinnable: false,
          valueGetter: (value, row) => {
            return `${row.wins}-${row.losses}-${row.ties}`;
          },
          sortComparator: recordComparator,
          headerAlign: 'right',
          align: 'right',
        },
        {
          field: 'offensive_total_yards',
          headerName: 'OFF TOTAL YDS',
          flex: 1,
          type: 'number',
          pinnable: false,
          sortingOrder: ['desc', 'asc'],
        },
        {
          field: 'offensive_rushing_yards',
          headerName: 'OFF RUSH YDS',
          flex: 1,
          type: 'number',
          pinnable: false,
          sortingOrder: ['desc', 'asc'],
        },
        {
          field: 'offensive_passing_yards',
          headerName: 'OFF PASS YDS',
          flex: 1,
          type: 'number',
          pinnable: false,
          sortingOrder: ['desc', 'asc'],
        },
        {
          field: 'offensive_points',
          headerName: 'OFF POINTS',
          flex: 1,
          type: 'number',
          pinnable: false,
          sortingOrder: ['desc', 'asc'],
        },
        {
          field: 'defensive_total_yards',
          headerName: 'DEF TOTAL YDS',
          flex: 1,
          type: 'number',
          pinnable: false,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'defensive_rushing_yards',
          headerName: 'DEF RUSH YDS',
          flex: 1,
          type: 'number',
          pinnable: false,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'defensive_passing_yards',
          headerName: 'DEF PASS YDS',
          flex: 1,
          type: 'number',
          pinnable: false,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'defensive_points',
          headerName: 'PTS ALLOWED',
          flex: 1,
          type: 'number',
          pinnable: false,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'yard_dif',
          headerName: 'YARD DIF',
          flex: 1,
          type: 'number',
          pinnable: false,
          sortingOrder: ['desc', 'asc'],
          valueGetter: (value, row) => {
            return row.offensive_total_yards - row.defensive_total_yards;
          },
        },
        {
          field: 'point_dif',
          headerName: 'POINT DIF',
          flex: 1,
          type: 'number',
          pinnable: false,
          sortingOrder: ['desc', 'asc'],
          valueGetter: (value, row) => {
            return row.offensive_points - row.defensive_points;
          },
        },
        {
          field: 'gm_rating',
          headerName: 'GM RTG',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getTeamGmRating(row, getBonusData(row));
          },
        },
      ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <DataGridPremium
        rows={rows ?? []}
        columns={columns}
        loading={rows.length <= 0 && !fetched}
        sortingOrder={['desc', 'asc']}
        pagination
        pageSizeOptions={[12, 24, 50, 100]}
        density='compact'
        getRowHeight={({ densityFactor }) => (desktop ? 'auto' : 52 * densityFactor)}
        disableRowSelectionOnClick
        disableDensitySelector
        getCellClassName={() => {
          return desktop ? 'desktop-text' : 'mobile-text';
        }}
        slots={{ toolbar: CustomGridToolbar }}
        slotProps={{ toolbar: { tier, tierFilter: setTier, tierOptions: ['Rookie', 'Sophomore', 'Professional', 'Veteran'] } }}
        initialState={{
          sorting: { sortModel: [{ field: 'gm_rating', sort: 'desc' }] },
          pagination: { paginationModel: { pageSize: 12 } },
          pinnedColumns: {
            left: ['team_name'],
          },
        }}
      />
    </Box>
  );
}
