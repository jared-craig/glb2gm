'use client';

import { DataGridPremium, GridColDef, GridRenderCellParams } from '@mui/x-data-grid-premium';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PlayerPuntingData } from './playerPuntingData';
import { CustomGridToolbarWithTierAndSeason } from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getPuntingGmRating } from '../statCalculations';

interface PlayerPuntingStatsProps {
  tier: string;
  tierFilter: (tier: string) => void;
  tierOptions: string[];
  season: string;
  seasonFilter: (season: string) => void;
  seasonOptions: string[];
}

export default function PlayerPuntingStats({ tier, tierFilter, tierOptions, season, seasonFilter, seasonOptions }: PlayerPuntingStatsProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerPuntingData[]>([]);
  const [rows, setRows] = useState<PlayerPuntingData[]>([]);

  const fetchData = async () => {
    const data = await fetch('/api/punting').then((res) => res.json());
    setData(data);
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerPuntingData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerPuntingData) => x.tier === tier && x.season === +season)
    );
    setFetched(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerPuntingData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerPuntingData) => x.tier === tier && x.season === +season)
    );
  }, [tier]);

  useEffect(() => {
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerPuntingData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerPuntingData) => x.tier === tier && x.season === +season)
    );
  }, [season]);

  const columns: GridColDef[] = !desktop
    ? [
        {
          field: 'player_name',
          headerName: 'NAME',
          width: 140,
          renderCell: (params: GridRenderCellParams<any, string>) => (
            <Link
              href={`/player-details/${params.row.player_id}/${season}`}
              target='_blank'
              rel='noopener'
              style={{ color: 'inherit', textDecoration: 'inherit' }}
            >
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
          valueGetter: (_value, row) => {
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
                href={`/player-details/${params.row.player_id}/${season}`}
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
          valueGetter: (_value, row) => {
            return getPuntingGmRating(row);
          },
        },
      ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {data.length > 0 && (
        <DataGridPremium
          rows={rows ?? []}
          columns={columns}
          loading={rows.length <= 0 && !fetched}
          sortingOrder={['desc', 'asc']}
          pagination
          pageSizeOptions={[10]}
          density='compact'
          getRowHeight={({ densityFactor }) => (desktop ? 'auto' : 52 * densityFactor)}
          disableRowSelectionOnClick
          disableDensitySelector
          getCellClassName={() => {
            return desktop ? 'desktop-text' : 'mobile-text';
          }}
          slots={{ toolbar: CustomGridToolbarWithTierAndSeason }}
          slotProps={{ toolbar: { tier, tierFilter, tierOptions, season, seasonFilter, seasonOptions } }}
          initialState={{
            sorting: { sortModel: [{ field: 'gm_rating', sort: 'desc' }] },
            pagination: { paginationModel: { pageSize: 10 } },
            pinnedColumns: {
              left: ['player_name'],
            },
          }}
        />
      )}
    </Box>
  );
}
