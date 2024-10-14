'use client';

import { DataGridPro, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PlayerRushingData } from './playerRushingData';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getRushingGmRating } from '../statCalculations';

export default function PlayerRushingStats() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerRushingData[]>([]);
  const [rows, setRows] = useState<PlayerRushingData[]>([]);
  const [tier, setTier] = useState<string>('Veteran');

  const fetchData = async () => {
    const res = await fetch('/api/rushing');
    const data = await res.json();
    setData(data);
    setRows(data.filter((x: PlayerRushingData) => x.tier === tier));
    setFetched(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(data.filter((x: PlayerRushingData) => x.tier === tier));
  }, [tier]);

  const columns: GridColDef[] = !desktop
    ? [
        {
          field: 'player_name',
          headerName: 'NAME',
          width: 140,
          renderCell: (params: GridRenderCellParams<any, string>) => (
            <Link href={`/player-details/${params.row.id}`} style={{ color: 'inherit', textDecoration: 'inherit' }}>
              <strong>{params.value}</strong>
            </Link>
          ),
          disableColumnMenu: true,
        },
        {
          field: 'position',
          headerName: 'POS',
          width: 100,
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'yards',
          headerName: 'YARDS',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'average',
          headerName: 'YPC',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'yards_per_game',
          headerName: 'YPG',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row: GridRowModel) => {
            return +(+row.yards / +row.games_played).toFixed(1);
          },
          disableColumnMenu: true,
        },
        {
          field: 'rushes',
          headerName: 'RUSH',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'touchdowns',
          headerName: 'TD',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'rushes_per_touchdown',
          headerName: 'R/TD',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return +(row.rushes / row.touchdowns).toFixed(2);
          },
          disableColumnMenu: true,
        },
        {
          field: 'broken_tackles',
          headerName: 'BTK',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'broken_tackles_per_rush',
          headerName: 'BTK/R',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return +(row.broken_tackles / row.rushes).toFixed(2);
          },
          disableColumnMenu: true,
        },
        {
          field: 'tackles_for_loss',
          headerName: 'TFL',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'fumbles',
          headerName: 'FUM',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'fumbles_lost',
          headerName: 'FUML',
          width: 120,
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
          valueGetter: (value, row: GridRowModel) => {
            return getRushingGmRating(row);
          },
          disableColumnMenu: true,
        },
      ]
    : [
        {
          field: 'player_name',
          headerName: 'NAME',
          flex: 2,
          renderCell: (params: GridRenderCellParams<any, string>) => (
            <Stack sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              <Link
                href={`/player-details/${params.row.id}`}
                style={{ color: 'inherit', textDecoration: 'inherit', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
              >
                <strong>{params.value}</strong>
              </Link>
              <Typography variant='caption'>{params.row.team_name}</Typography>
            </Stack>
          ),
        },
        {
          field: 'position',
          headerName: 'POS',
          flex: 0.5,
          pinnable: false,
        },
        {
          field: 'yards',
          headerName: 'YARDS',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'average',
          headerName: 'YPC',
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
          field: 'rushes',
          headerName: 'RUSH',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'touchdowns',
          headerName: 'TD',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'rushes_per_touchdown',
          headerName: 'RUSH/TD',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return +(row.rushes / row.touchdowns).toFixed(2);
          },
        },
        {
          field: 'broken_tackles',
          headerName: 'BTK',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'broken_tackles_per_rush',
          headerName: 'BTK/RUSH',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return +(row.broken_tackles / row.rushes).toFixed(2);
          },
        },
        {
          field: 'yards_after_contact',
          headerName: 'YACON',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'tackles_for_loss',
          headerName: 'TFL',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'fumbles',
          headerName: 'FUM',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'fumbles_lost',
          headerName: 'FUML',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'gm_rating',
          headerName: 'GM RTG',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getRushingGmRating(row);
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
        slotProps={{ toolbar: { tierFilter: setTier, tierOptions: ['Rookie', 'Sophomore', 'Professional', 'Veteran'] } }}
        initialState={{
          sorting: { sortModel: [{ field: 'gm_rating', sort: 'desc' }] },
          filter: {
            filterModel: {
              items: [{ field: 'rushes', operator: '>=', value: '10' }],
            },
          },
          pagination: { paginationModel: { pageSize: 12 } },
          pinnedColumns: {
            left: ['player_name'],
          },
        }}
      />
    </Box>
  );
}
