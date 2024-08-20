'use client';

import { DataGridPro, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getDefensiveGmRating } from '../statCalculations';
import { PlayerDefensiveData } from './playerDefensiveData';

export default function PlayerRushingStats() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerDefensiveData[]>([]);
  const [rows, setRows] = useState<PlayerDefensiveData[]>([]);
  const [tier, setTier] = useState<string>(typeof window !== 'undefined' ? localStorage.getItem('tier') || 'Veteran' : 'Veteran');

  const fetchData = async () => {
    const res = await fetch('/api/defensive');
    const data = await res.json();
    setData(data);
    setRows(data.filter((x: PlayerDefensiveData) => x.tier === tier));
    setFetched(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(data.filter((x: PlayerDefensiveData) => x.tier === tier));
    if (typeof window !== 'undefined') localStorage.setItem('tier', tier);
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
          field: 'sacks',
          headerName: 'SACKS',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'tackles',
          headerName: 'TK',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'tackles_for_loss',
          headerName: 'TFL',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'missed_tackles',
          headerName: 'MSTK',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'sticks',
          headerName: 'STICK',
          width: 110,
          type: 'number',
          pinnable: false,
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
          field: 'forced_fumbles',
          headerName: 'FF',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'fumble_recoveries',
          headerName: 'FUMR',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'hurries',
          headerName: 'HRY',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'passes_defended',
          headerName: 'PD',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'passes_knocked_loose',
          headerName: 'KL',
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
          valueGetter: (value, row: GridRowModel) => {
            return getDefensiveGmRating(row);
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
          field: 'position',
          headerName: 'POS',
          flex: 0.5,
          pinnable: false,
        },
        {
          field: 'sacks',
          headerName: 'SACKS',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'tackles',
          headerName: 'TK',
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
          field: 'missed_tackles',
          headerName: 'MSTK',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'sticks',
          headerName: 'STICK',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'interceptions',
          headerName: 'INT',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'forced_fumbles',
          headerName: 'FF',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'fumble_recoveries',
          headerName: 'FUMR',
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
          field: 'passes_defended',
          headerName: 'PD',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'passes_knocked_loose',
          headerName: 'KL',
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
            return getDefensiveGmRating(row);
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
          pagination: { paginationModel: { pageSize: 15 } },
          pinnedColumns: {
            left: ['player_name'],
          },
        }}
      />
    </Box>
  );
}
