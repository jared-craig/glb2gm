'use client';

import { DataGridPro, GridColDef, GridComparatorFn, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { TeamData } from './teamData';
import { getTeamGmRating } from '../stats/statCalculations';

export default function PlayerPassingStats() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<TeamData[]>([]);
  const [rows, setRows] = useState<TeamData[]>([]);
  const [tier, setTier] = useState<string>('All Tiers');

  const fetchData = async () => {
    const res = await fetch('/api/teams');
    const data = await res.json();
    setData(data);
    setRows(tier !== 'All Tiers' ? data.filter((x: TeamData) => x.tier === tier) : data);
    setFetched(true);
  };

  const recordComparator: GridComparatorFn<string> = (v1, v2) => +v1.substring(0, v1.indexOf('-')) - +v2.substring(0, v2.indexOf('-'));

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
            <Link href={`https://glb2.warriorgeneral.com/game/team/${params.row.id}`} target='_blank' style={{ color: 'inherit', textDecoration: 'inherit' }}>
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
        },
        {
          field: 'global_rank',
          headerName: 'GLOBAL',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
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
          field: 'gm_rating',
          headerName: 'GM RTG',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getTeamGmRating(row);
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
                href={`https://glb2.warriorgeneral.com/game/team/${params.row.id}`}
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
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'global_rank',
          headerName: 'GLOBAL',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'record',
          headerName: 'W-L-T',
          flex: 1,
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
          field: 'gm_rating',
          headerName: 'GM RTG',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getTeamGmRating(row);
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
          pagination: { paginationModel: { pageSize: !desktop ? 12 : 15 } },
          pinnedColumns: {
            left: ['team_name'],
          },
        }}
      />
    </Box>
  );
}
