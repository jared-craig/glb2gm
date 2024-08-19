'use client';

import { DataGridPro, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { PlayerReceivingData } from './playerReceivingData';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getReceivingDropsPerReception, getReceivingGmRating } from '../statCalculations';

export default function PlayerReceivingStats() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerReceivingData[]>([]);
  const [rows, setRows] = useState<PlayerReceivingData[]>([]);
  const [tier, setTier] = useState<string>(window.localStorage.getItem('tier') || 'Veteran');

  const fetchData = async () => {
    const res = await fetch('/api/receiving');
    const data = await res.json();
    setData(data);
    setRows(data.filter((x: PlayerReceivingData) => x.tier === tier));
    setFetched(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(data.filter((x: PlayerReceivingData) => x.tier === tier));
    window.localStorage.setItem('tier', tier);
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
          field: 'average',
          headerName: 'YPR',
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
          field: 'touchdowns',
          headerName: 'TD',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'receptions',
          headerName: 'REC',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'targets',
          headerName: 'TAR',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'catch_rate',
          headerName: 'REC%',
          width: 110,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row: GridRowModel) => {
            return +((row.receptions / row.targets) * 100.0).toFixed(1);
          },
          valueFormatter: (value) => `${value}%`,
          disableColumnMenu: true,
        },
        {
          field: 'receptions_per_touchdown',
          headerName: 'REC/TD',
          width: 110,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row: GridRowModel) => {
            return +(row.receptions / row.touchdowns).toFixed(2);
          },
          disableColumnMenu: true,
        },
        {
          field: 'targets_per_touchdown',
          headerName: 'TAR/TD',
          width: 110,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row: GridRowModel) => {
            return +(row.targets / row.touchdowns).toFixed(2);
          },
          disableColumnMenu: true,
        },
        {
          field: 'yards_after_catch',
          headerName: 'YAC',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'drops',
          headerName: 'DROPS',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'drops_per_receptions',
          headerName: 'D/REC',
          width: 110,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getReceivingDropsPerReception(row);
          },
          disableColumnMenu: true,
        },
        {
          field: 'fumbles',
          headerName: 'FUM',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'fumbles_lost',
          headerName: 'FUML',
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
            return getReceivingGmRating(row);
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
          field: 'yards',
          headerName: 'YARDS',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'average',
          headerName: 'YPR',
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
          field: 'touchdowns',
          headerName: 'TD',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'receptions',
          headerName: 'REC',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'targets',
          headerName: 'TAR',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'catch_rate',
          headerName: 'REC%',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row: GridRowModel) => {
            return +((row.receptions / row.targets) * 100.0).toFixed(1);
          },
          valueFormatter: (value) => `${value}%`,
        },
        {
          field: 'receptions_per_touchdown',
          headerName: 'REC/TD',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row: GridRowModel) => {
            return +(row.receptions / row.touchdowns).toFixed(2);
          },
        },
        {
          field: 'targets_per_touchdown',
          headerName: 'TAR/TD',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row: GridRowModel) => {
            return +(row.targets / row.touchdowns).toFixed(2);
          },
        },
        {
          field: 'yards_after_catch',
          headerName: 'YAC',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'drops',
          headerName: 'DROPS',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'drops_per_receptions',
          headerName: 'D/REC',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getReceivingDropsPerReception(row);
          },
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
            return getReceivingGmRating(row);
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
