'use client';

import { DataGridPremium, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-premium';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PlayerKickingData } from './playerKickingData';
import { CustomGridToolbarWithTierAndSeason } from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getKickingGmRating } from '../statCalculations';
import { PlayerData } from '@/app/players/playerData';

interface PlayerKickingStatsProps {
  tier: string;
  tierFilter: (tier: string) => void;
  tierOptions: string[];
  season: string;
  seasonFilter: (season: string) => void;
  seasonOptions: string[];
}

export default function PlayerKickingStats({ tier, tierFilter, tierOptions, season, seasonFilter, seasonOptions }: PlayerKickingStatsProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerKickingData[]>([]);
  const [rows, setRows] = useState<PlayerKickingData[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState<number>();

  const fetchData = async () => {
    const data = await fetch('/api/kicking').then((res) => res.json());
    setData(data);
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerKickingData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerKickingData) => x.tier === tier && x.season === +season)
    );
    setGamesPlayed(Math.max(...data.filter((x: PlayerData) => x.tier === tier && x.season === +season).map((x: PlayerData) => x.games_played)));
    setFetched(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerKickingData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerKickingData) => x.tier === tier && x.season === +season)
    );
    setGamesPlayed(Math.max(...data.filter((x: PlayerData) => x.tier === tier && x.season === +season).map((x: PlayerData) => x.games_played)));
  }, [tier]);

  useEffect(() => {
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerKickingData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerKickingData) => x.tier === tier && x.season === +season)
    );
    setGamesPlayed(Math.max(...data.filter((x: PlayerData) => x.tier === tier && x.season === +season).map((x: PlayerData) => x.games_played)));
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
          valueGetter: (_value, row: GridRowModel) => {
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
          valueGetter: (_value, row: GridRowModel) => {
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
          valueGetter: (_value, row) => {
            const gm = getKickingGmRating(row, gamesPlayed);
            return gm === Number.MIN_SAFE_INTEGER ? null : gm;
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
          valueGetter: (_value, row: GridRowModel) => {
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
          valueGetter: (_value, row: GridRowModel) => {
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
          valueGetter: (_value, row) => {
            const gm = getKickingGmRating(row, gamesPlayed);
            return gm === Number.MIN_SAFE_INTEGER ? null : gm;
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
