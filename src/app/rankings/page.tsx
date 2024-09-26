'use client';

import { DataGridPro, GridColDef, GridComparatorFn, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { TeamData } from '../teams/teamData';
import { getTeamGmRating } from '../stats/statCalculations';
import { GameData } from '../games/gameData';

export default function PlayerPassingStats() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<TeamData[]>([]);
  const [allGamesData, setAllGamesData] = useState<GameData[]>([]);
  const [rows, setRows] = useState<TeamData[]>([]);
  const [tier, setTier] = useState<string>('All Tiers');

  const fetchData = async () => {
    const res = await fetch('/api/teams');
    const data: TeamData[] = await res.json();
    const gamesRes = await fetch(`/api/games`);
    const gamesData: GameData[] = await gamesRes.json();
    setData(data);
    setAllGamesData(gamesData);
    setRows(tier !== 'All Tiers' ? data.filter((x: TeamData) => x.tier === tier) : data);
    setFetched(true);
  };

  const recordComparator: GridComparatorFn<string> = (v1, v2) => +v1.substring(0, v1.indexOf('-')) - +v2.substring(0, v2.indexOf('-'));

  const getBonusData = (teamData: TeamData): number => {
    const allTeamGames = allGamesData.filter((x) => x.team_one_id === teamData.id || x.team_two_id === teamData.id);
    let topTeams: TeamData[] = [];
    if (teamData.tier === 'Professional') {
      topTeams = [...data].filter(
        (x) =>
          (x.tier === teamData.tier && x.tier_rank <= 6.0 && x.id !== teamData.id) ||
          (x.tier === 'Veteran' && (x.global_rank <= teamData.global_rank || x.global_rank <= 12.0) && x.id !== teamData.id)
      );
    } else {
      topTeams = [...data].filter((x) => x.tier === teamData.tier && x.tier_rank <= 10.0 && x.id !== teamData.id);
    }

    let notTopTeams: TeamData[] = [];
    if (teamData.tier === 'Professional') {
      notTopTeams = [...data].filter((x) => x.tier === teamData.tier && x.tier_rank > 6.0 && x.id !== teamData.id);
    } else if (teamData.tier === 'Veteran') {
      notTopTeams = [...data].filter((x) => (x.tier === teamData.tier && x.tier_rank > 10.0 && x.id !== teamData.id) || x.tier === 'Professional');
    } else {
      notTopTeams = [...data].filter((x) => x.tier === teamData.tier && x.tier_rank > 10.0 && x.id !== teamData.id);
    }

    const teamOneWins = [...allTeamGames].filter(
      (x) => x.team_one_id === teamData.id && topTeams.some((y) => y.id === x.team_two_id) && x.team_one_points > x.team_two_points
    );
    const teamTwoWins = [...allTeamGames].filter(
      (x) => x.team_two_id === teamData.id && topTeams.some((y) => y.id === x.team_one_id) && x.team_one_points < x.team_two_points
    );

    const teamOneTopTeamLosses = [...allTeamGames].filter(
      (x) => x.team_one_id === teamData.id && topTeams.some((y) => y.id === x.team_two_id) && x.team_one_points < x.team_two_points
    );
    const teamTwoTopTeamLosses = [...allTeamGames].filter(
      (x) => x.team_two_id === teamData.id && topTeams.some((y) => y.id === x.team_one_id) && x.team_one_points > x.team_two_points
    );

    const teamOneBadTeamLosses = [...allTeamGames].filter(
      (x) => x.team_one_id === teamData.id && notTopTeams.some((y) => y.id === x.team_two_id) && x.team_one_points < x.team_two_points
    );
    const teamTwoBadTeamLosses = [...allTeamGames].filter(
      (x) => x.team_two_id === teamData.id && notTopTeams.some((y) => y.id === x.team_one_id) && x.team_one_points > x.team_two_points
    );

    const topTeamWins = teamOneWins.length + teamTwoWins.length;
    const topTeamLosses = teamOneTopTeamLosses.length + teamTwoTopTeamLosses.length;
    const badTeamLosses = teamOneBadTeamLosses.length + teamTwoBadTeamLosses.length;

    const pointDif =
      teamOneWins.reduce((acc, cur) => acc + (cur.team_one_points - cur.team_two_points), 0) +
      teamTwoWins.reduce((acc, cur) => acc + (cur.team_two_points - cur.team_one_points), 0);

    let bonus = 0;
    switch (teamData.tier) {
      case 'Rookie':
        bonus = 5.0 * topTeamWins + 2.5 * topTeamLosses - 50.0 * badTeamLosses + pointDif;
        break;
      case 'Sophomore':
        bonus = 10.0 * topTeamWins + 5.0 * topTeamLosses - 50.0 * badTeamLosses + pointDif;
        break;
      case 'Professional':
        bonus = 15.0 * topTeamWins + 7.5 * topTeamLosses - 50.0 * badTeamLosses + pointDif;
        break;
      case 'Veteran':
        bonus = 20.0 * topTeamWins + 10.0 * topTeamLosses - 50.0 * badTeamLosses + pointDif;
        break;
    }

    return bonus;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(tier !== 'All Tiers' ? data.filter((x: TeamData) => x.tier === tier) : data);
  }, [tier]);

  const columns: GridColDef[] = !desktop
    ? [
        {
          field: 'team_name',
          headerName: 'TEAM',
          width: 140,
          renderCell: (params: GridRenderCellParams<any, string>) => (
            <Link href={`/team-details/${params.row.id}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>
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
          field: 'record',
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
        },
        {
          field: 'offensive_rushing_yards',
          headerName: 'OFF RUSH YDS',
          width: 140,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'offensive_passing_yards',
          headerName: 'OFF PASS YDS',
          width: 140,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
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
          flex: 2,
          renderCell: (params: GridRenderCellParams<any, string>) => (
            <Stack sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              <Link
                href={`/team-details/${params.row.id}`}
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
          flex: 0.5,
          type: 'number',
          pinnable: false,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'global_rank',
          headerName: 'GLOBAL',
          flex: 0.5,
          type: 'number',
          pinnable: false,
          sortingOrder: ['asc', 'desc'],
        },
        {
          field: 'record',
          headerName: 'W-L-T',
          flex: 0.5,
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
        },
        {
          field: 'offensive_rushing_yards',
          headerName: 'OFF RUSH YDS',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'offensive_passing_yards',
          headerName: 'OFF PASS YDS',
          flex: 1,
          type: 'number',
          pinnable: false,
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
    <Box>
      <DataGridPro
        rows={rows ?? []}
        columns={columns}
        loading={rows.length <= 0 && !fetched}
        autoHeight
        sortingOrder={['desc', 'asc']}
        pagination
        pageSizeOptions={[12, 24, 50, 100]}
        density='compact'
        getRowHeight={({ id, densityFactor }) => (desktop ? 'auto' : 52 * densityFactor)}
        disableRowSelectionOnClick
        disableDensitySelector
        getCellClassName={() => {
          return desktop ? 'desktop-text' : 'mobile-text';
        }}
        slots={{ toolbar: CustomGridToolbar }}
        slotProps={{ toolbar: { tierFilter: setTier, tierOptions: ['Rookie', 'Sophomore', 'Professional', 'Veteran', 'All Tiers'] } }}
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
