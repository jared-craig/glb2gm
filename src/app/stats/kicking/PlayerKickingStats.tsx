'use client';

import { DataGridPro, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PlayerKickingData } from './playerKickingData';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getKickingGmRating } from '../statCalculations';

export default function PlayerPassingStats() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerKickingData[]>([]);
  const [rows, setRows] = useState<PlayerKickingData[]>([]);
  const [tier, setTier] = useState<string>('Veteran');

  const fetchData = async () => {
    const res = await fetch('/api/kicking');
    const data = await res.json();
    setData(data);
    setRows(data.filter((x: PlayerKickingData) => x.tier === tier));
    setFetched(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(data.filter((x: PlayerKickingData) => x.tier === tier));
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
          field: 'fg_made',
          headerName: 'FGM',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'fg_attempts',
          headerName: 'FGA',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'accuracy',
          headerName: 'FG%',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          valueGetter: (value, row: GridRowModel) => {
            return +((+row.fg_made / +row.fg_attempts) * 100.0).toFixed(1);
          },
          valueFormatter: (value) => `${value}%`,
        },
        {
          field: 'forty_to_forty_nine_made',
          headerName: '40-49',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'fifty_plus_made',
          headerName: '50+',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'touchbacks',
          headerName: 'TB',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'kickoffs',
          headerName: 'KO',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'touchback_percent',
          headerName: 'TB%',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          valueGetter: (value, row: GridRowModel) => {
            return +((+row.touchbacks / +row.kickoffs) * 100.0).toFixed(1);
          },
          valueFormatter: (value) => `${value}%`,
        },
        {
          field: 'gm_rating',
          headerName: 'GM RTG',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getKickingGmRating(row);
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
                href={`https://glb2.warriorgeneral.com/game/player/${params.row.id}`}
                target='_blank'
                style={{ color: 'inherit', textDecoration: 'inherit', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
              >
                <strong>{params.value}</strong>
              </Link>
              <Typography variant='caption'>{params.row.team_name}</Typography>
            </Stack>
          ),
        },
        {
          field: 'fg_made',
          headerName: 'FGM',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'fg_attempts',
          headerName: 'FGA',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'accuracy',
          headerName: 'FG%',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row: GridRowModel) => {
            return +((+row.fg_made / +row.fg_attempts) * 100.0).toFixed(1);
          },
          valueFormatter: (value) => `${value}%`,
        },
        {
          field: 'forty_to_forty_nine_made',
          headerName: '40-49',
          flex: 1,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'fifty_plus_made',
          headerName: '50+',
          flex: 1,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'touchbacks',
          headerName: 'TB',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'kickoffs',
          headerName: 'KO',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'touchback_percent',
          headerName: 'TB%',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row: GridRowModel) => {
            return +((+row.touchbacks / +row.kickoffs) * 100.0).toFixed(1);
          },
          valueFormatter: (value) => `${value}%`,
        },
        {
          field: 'gm_rating',
          headerName: 'GM RTG',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getKickingGmRating(row);
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
          pagination: { paginationModel: { pageSize: 12 } },
          pinnedColumns: {
            left: ['player_name'],
          },
        }}
      />
    </Box>
  );
}
