'use client';

import { DataGridPro, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
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
          headerName: 'YPC',
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'rushes',
          headerName: 'RUSH',
          width: 110,
          type: 'number',
          pinnable: false,
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
          field: 'rushes_per_touchdown',
          headerName: 'R/TD',
          width: 110,
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
          width: 110,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'broken_tackles_per_rush',
          headerName: 'BTK/R',
          width: 110,
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
          width: 110,
          type: 'number',
          pinnable: false,
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
            return getRushingGmRating(row);
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
          flex: 1,
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
          headerName: 'GM RATING',
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
              items: [{ field: 'rushes', operator: '>=', value: '100' }],
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
