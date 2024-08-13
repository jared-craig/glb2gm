'use client';

import { DataGridPro, GridColDef, GridRenderCellParams, GridValueGetter } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { PlayerReceivingData } from './playerReceivingData';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';
import Link from 'next/link';

export default function PlayerReceivingStats() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerReceivingData[]>([]);
  const [rows, setRows] = useState<PlayerReceivingData[]>([]);
  const [tier, setTier] = useState<string>('Veteran');

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
  }, [tier]);

  const columns: GridColDef[] = !desktop
    ? [
        {
          field: 'player_name',
          headerName: 'NAME',
          width: 130,
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
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'average',
          headerName: 'YPR',
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
          field: 'receptions',
          headerName: 'REC',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'targets',
          headerName: 'TAR',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'yards_after_catch',
          headerName: 'YAC',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'drops',
          headerName: 'DROPS',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'drops_per_receptions',
          headerName: 'DPR',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return (row.drops / row.receptions).toFixed(2);
          },
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
          headerName: 'GM Rating',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return Math.round(0.2 * +row.yards + 10.0 * +row.touchdowns - 100.0 * +(+row.drops / +row.receptions) - +row.fumbles_lost);
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
          headerName: 'YPR',
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
          headerName: 'DPR',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return (row.drops / row.receptions).toFixed(2);
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
          headerName: 'GM Rating',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return Math.round(0.2 * +row.yards + 10.0 * +row.touchdowns - 100.0 * +(+row.drops / +row.receptions) - +row.fumbles_lost);
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
