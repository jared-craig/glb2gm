'use client';

import { DataGridPro, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { PlayerPassingData } from './playerPassingData';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getPassingGmRating } from '../statCalculations';

export default function PlayerPassingStats() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerPassingData[]>([]);
  const [rows, setRows] = useState<PlayerPassingData[]>([]);
  const [tier, setTier] = useState<string>('Veteran');

  const fetchData = async () => {
    const res = await fetch('/api/passing');
    const data = await res.json();
    setData(data);
    setRows(data.filter((x: PlayerPassingData) => x.tier === tier));
    setFetched(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(data.filter((x: PlayerPassingData) => x.tier === tier));
  }, [tier]);

  const columns: GridColDef[] = !desktop
    ? [
        {
          field: 'player_name',
          headerName: 'NAME',
          width: 140,
          renderCell: (params: GridRenderCellParams<any, string>) => (
            <Link href={`https://glb2.warriorgeneral.com/game/player/${params.row.id}`} target='_blank' style={{ color: 'inherit', textDecoration: 'inherit' }}>
              <strong>{params.value}</strong>
            </Link>
          ),
          disableColumnMenu: true,
        },
        {
          field: 'yards',
          headerName: 'YARDS',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'yards_per_attempt',
          headerName: 'YPA',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'yards_per_game',
          headerName: 'YPG',
          width: 110,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row: GridRowModel) => {
            return +(+row.yards / +row.games_played).toFixed(1);
          },
          disableColumnMenu: true,
        },
        {
          field: 'completion_percentage',
          headerName: 'PCT',
          width: 110,
          type: 'number',
          pinnable: false,
          valueFormatter: (value: number) => `${value}%`,
          disableColumnMenu: true,
        },
        {
          field: 'touchdowns',
          headerName: 'TD',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'attempts_per_touchdowns',
          headerName: 'A/TD',
          width: 110,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return +(row.attempts / row.touchdowns).toFixed(2);
          },
          disableColumnMenu: true,
        },
        {
          field: 'interceptions',
          headerName: 'INT',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'attempts',
          headerName: 'ATT',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'completions',
          headerName: 'COMP',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'gm_rating',
          headerName: 'GM RTG',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getPassingGmRating(row);
          },
          disableColumnMenu: true,
        },
      ]
    : [
        {
          field: 'player_name',
          headerName: 'NAME',
          flex: 1.5,
          renderCell: (params: GridRenderCellParams<any, string>) => (
            <Link href={`https://glb2.warriorgeneral.com/game/player/${params.row.id}`} target='_blank' style={{ color: 'inherit', textDecoration: 'inherit' }}>
              <strong>{params.value}</strong>
            </Link>
          ),
        },
        {
          field: 'yards',
          headerName: 'YARDS',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'yards_per_attempt',
          headerName: 'YPA',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'yards_per_game',
          headerName: 'YPG',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row: GridRowModel) => {
            return +(+row.yards / +row.games_played).toFixed(1);
          },
        },
        {
          field: 'completion_percentage',
          headerName: 'PCT',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueFormatter: (value) => `${value}%`,
        },
        {
          field: 'touchdowns',
          headerName: 'TD',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'attempts_per_touchdowns',
          headerName: 'ATT/TD',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return +(row.attempts / row.touchdowns).toFixed(2);
          },
        },
        {
          field: 'interceptions',
          headerName: 'INT',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'attempts',
          headerName: 'ATT',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'completions',
          headerName: 'COMP',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'hurries',
          headerName: 'HRY',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'sacks',
          headerName: 'SACK',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'gm_rating',
          headerName: 'GM RATING',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getPassingGmRating(row);
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
        pageSizeOptions={[15, 30, 50, 100]}
        density='compact'
        disableRowSelectionOnClick
        disableDensitySelector
        slots={{ toolbar: CustomGridToolbar }}
        slotProps={{ toolbar: { tierFilter: setTier } }}
        initialState={{
          sorting: { sortModel: [{ field: 'gm_rating', sort: 'desc' }] },
          filter: {
            filterModel: {
              items: [{ field: 'attempts', operator: '>=', value: '100' }],
            },
          },
          pagination: { paginationModel: { pageSize: 15 } },
          pinnedColumns: {
            left: ['player_name'],
          },
        }}
      />
    </Box>
  );
}
