'use client';

import { DataGridPremium, GridColDef, GridRenderCellParams } from '@mui/x-data-grid-premium';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PlayerPuntingData } from './playerPuntingData';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getPuntingGmRating } from '../statCalculations';

interface PlayerPuntingStatsProps {
  tier: string;
  tierFilter: (tier: string) => void;
}

export default function PlayerPuntingStats({ tier, tierFilter }: PlayerPuntingStatsProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerPuntingData[]>([]);
  const [rows, setRows] = useState<PlayerPuntingData[]>([]);

  const fetchData = async () => {
    const res = await fetch('/api/punting');
    const data = await res.json();
    setData(data);
    setRows(data.filter((x: PlayerPuntingData) => x.tier === tier));
    setFetched(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(data.filter((x: PlayerPuntingData) => x.tier === tier));
  }, [tier]);

  const columns: GridColDef[] = !desktop
    ? [
        {
          field: 'player_name',
          headerName: 'NAME',
          width: 140,
          renderCell: (params: GridRenderCellParams<any, string>) => (
            <Link href={`/player-details/${params.row.player_id}`} target='_blank' rel='noopener' style={{ color: 'inherit', textDecoration: 'inherit' }}>
              <strong>{params.value}</strong>
            </Link>
          ),
          disableColumnMenu: true,
        },
        {
          field: 'punts',
          headerName: 'PUNTS',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'average',
          headerName: 'AVG',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'hangtime',
          headerName: 'HANG',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'coffins',
          headerName: 'COFFIN%',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          valueGetter: (value, row) => {
            return ((value / row.punts) * 100.0).toFixed(2);
          },
        },
        {
          field: 'inside_five',
          headerName: 'INS 5%',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          valueGetter: (value, row) => {
            return ((value / row.punts) * 100.0).toFixed(2);
          },
        },
        {
          field: 'inside_ten',
          headerName: 'INS 10%',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          valueGetter: (value, row) => {
            return ((value / row.punts) * 100.0).toFixed(2);
          },
        },
        {
          field: 'inside_twenty',
          headerName: 'INS 20%',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'touchbacks',
          headerName: 'TB%',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          valueGetter: (value, row) => {
            return ((value / row.punts) * 100.0).toFixed(2);
          },
        },
        {
          field: 'gm_rating',
          headerName: 'GM RTG',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getPuntingGmRating(row);
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
                href={`/player-details/${params.row.player_id}`}
                target='_blank'
                rel='noopener'
                style={{ color: 'inherit', textDecoration: 'inherit', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
              >
                <strong>{params.value}</strong>
              </Link>
              <Typography variant='caption'>{params.row.team_name}</Typography>
            </Stack>
          ),
        },
        {
          field: 'punts',
          headerName: 'PUNTS',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'average',
          headerName: 'AVG',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'hangtime',
          headerName: 'HANG',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'coffins',
          headerName: 'COFFIN%',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return ((value / row.punts) * 100.0).toFixed(2);
          },
        },
        {
          field: 'inside_five',
          headerName: 'INS 5%',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return ((value / row.punts) * 100.0).toFixed(2);
          },
        },
        {
          field: 'inside_ten',
          headerName: 'INS 10%',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return ((value / row.punts) * 100.0).toFixed(2);
          },
        },
        {
          field: 'inside_twenty',
          headerName: 'INS 20%',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return ((value / row.punts) * 100.0).toFixed(2);
          },
        },
        {
          field: 'touchbacks',
          headerName: 'TB%',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return ((value / row.punts) * 100.0).toFixed(2);
          },
        },
        {
          field: 'gm_rating',
          headerName: 'GM RTG',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getPuntingGmRating(row);
          },
        },
      ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <DataGridPremium
        rows={rows ?? []}
        columns={columns}
        loading={rows.length <= 0 && !fetched}
        sortingOrder={['desc', 'asc']}
        pagination
        pageSizeOptions={[12, 24, 50, 100]}
        density='compact'
        getRowHeight={({ densityFactor }) => (desktop ? 'auto' : 52 * densityFactor)}
        disableRowSelectionOnClick
        disableDensitySelector
        getCellClassName={() => {
          return desktop ? 'desktop-text' : 'mobile-text';
        }}
        slots={{ toolbar: CustomGridToolbar }}
        slotProps={{ toolbar: { tier, tierFilter, tierOptions: ['Rookie', 'Sophomore', 'Professional', 'Veteran'] } }}
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
