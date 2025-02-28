'use client';

import { DataGridPremium, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-premium';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PlayerReturningData } from './playerReturningData';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getReturningGmRating } from '../statCalculations';

interface PlayerReturningStatsProps {
  tier: string;
  tierFilter: (tier: string) => void;
}

export default function PlayerReturningStats({ tier, tierFilter }: PlayerReturningStatsProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerReturningData[]>([]);
  const [rows, setRows] = useState<PlayerReturningData[]>([]);

  const fetchData = async () => {
    const res = await fetch('/api/returning');
    const data = await res.json();
    setData(data);
    setRows(data.filter((x: PlayerReturningData) => x.tier === tier));
    setFetched(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(data.filter((x: PlayerReturningData) => x.tier === tier));
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
          field: 'position',
          headerName: 'POS',
          width: 100,
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'kr_yards',
          headerName: 'KR YARDS',
          width: 120,
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'kr_average',
          headerName: 'KR AVG',
          width: 120,
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'kr_touchdowns',
          headerName: 'KR TD',
          width: 120,
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'krs',
          headerName: 'KRS',
          width: 120,
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'pr_yards',
          headerName: 'PR YARDS',
          width: 120,
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'pr_average',
          headerName: 'PR AVG',
          width: 120,
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'pr_touchdowns',
          headerName: 'PR TD',
          width: 120,
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'prs',
          headerName: 'PRS',
          width: 120,
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
            return getReturningGmRating(row);
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
          field: 'position',
          headerName: 'POS',
          flex: 0.5,
          pinnable: false,
        },
        {
          field: 'kr_yards',
          headerName: 'KR YARDS',
          flex: 1,
          pinnable: false,
        },
        {
          field: 'kr_average',
          headerName: 'KR AVG',
          flex: 1,
          pinnable: false,
        },
        {
          field: 'kr_touchdowns',
          headerName: 'KR TD',
          flex: 1,
          pinnable: false,
        },
        {
          field: 'krs',
          headerName: 'KRS',
          flex: 1,
          pinnable: false,
        },
        {
          field: 'pr_yards',
          headerName: 'PR YARDS',
          flex: 1,
          pinnable: false,
        },
        {
          field: 'pr_average',
          headerName: 'PR AVG',
          flex: 1,
          pinnable: false,
        },
        {
          field: 'pr_touchdowns',
          headerName: 'PR TD',
          flex: 1,
          pinnable: false,
        },
        {
          field: 'prs',
          headerName: 'PRS',
          flex: 1,
          pinnable: false,
        },
        {
          field: 'gm_rating',
          headerName: 'GM RTG',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (value, row) => {
            return getReturningGmRating(row);
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
