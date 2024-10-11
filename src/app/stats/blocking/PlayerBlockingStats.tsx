'use client';

import { DataGridPro, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PlayerBlockingData } from './playerBlockingData';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getBlockingGmRating } from '../statCalculations';

export default function PlayerRushingStats() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerBlockingData[]>([]);
  const [rows, setRows] = useState<PlayerBlockingData[]>([]);
  const [tier, setTier] = useState<string>('Veteran');

  const fetchData = async () => {
    const res = await fetch('/api/blocking');
    const data = await res.json();
    setData(data);
    setRows(data.filter((x: PlayerBlockingData) => x.tier === tier));
    setFetched(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(data.filter((x: PlayerBlockingData) => x.tier === tier));
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
          field: 'pancakes',
          headerName: 'CAKE',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'reverse_pancaked',
          headerName: 'RCAKED',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'cake_ratio',
          headerName: 'C/R',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          valueGetter: (value, row: GridRowModel) => {
            return +(+row.pancakes / +row.reverse_pancaked).toFixed(2);
          },
        },
        {
          field: 'hurries_allowed',
          headerName: 'HALW',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'sacks_allowed',
          headerName: 'SALW',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'plays',
          headerName: 'PLAYS',
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
            return getBlockingGmRating(row);
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
          field: 'pancakes',
          headerName: 'CAKE',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'reverse_pancaked',
          headerName: 'RCAKED',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'cake_ratio',
          headerName: 'C/R',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row: GridRowModel) => {
            return +(+row.pancakes / +row.reverse_pancaked).toFixed(2);
          },
        },
        {
          field: 'hurries_allowed',
          headerName: 'HALW',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'sacks_allowed',
          headerName: 'SALW',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'plays',
          headerName: 'PLAYS',
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
            return getBlockingGmRating(row);
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
              items: [{ field: 'plays', operator: '>=', value: '25' }],
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
