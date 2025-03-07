'use client';

import { DataGridPremium, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-premium';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PlayerRushingData } from './playerRushingData';
import { CustomGridToolbarWithTierAndSeason } from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getRushingGmRating } from '../statCalculations';
import { PlayerData } from '@/app/players/playerData';

interface PlayerRushingStatsProps {
  tier: string;
  tierFilter: (tier: string) => void;
  tierOptions: string[];
  season: string;
  seasonFilter: (season: string) => void;
  seasonOptions: string[];
}

export default function PlayerRushingStats({ tier, tierFilter, tierOptions, season, seasonFilter, seasonOptions }: PlayerRushingStatsProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerRushingData[]>([]);
  const [rows, setRows] = useState<PlayerRushingData[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState<number>();

  const fetchData = async () => {
    const data = await fetch('/api/rushing').then((res) => res.json());
    setData(data);
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerRushingData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerRushingData) => x.tier === tier && x.season === +season)
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
        ? data.filter((x: PlayerRushingData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerRushingData) => x.tier === tier && x.season === +season)
    );
    setGamesPlayed(Math.max(...data.filter((x: PlayerData) => x.tier === tier && x.season === +season).map((x: PlayerData) => x.games_played)));
  }, [tier]);

  useEffect(() => {
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerRushingData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerRushingData) => x.tier === tier && x.season === +season)
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
          field: 'position',
          headerName: 'POS',
          width: 100,
          pinnable: false,
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
          headerName: 'YPC',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'yards_per_game',
          headerName: 'YPG',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row: GridRowModel) => {
            return +(+row.yards / +row.games_played).toFixed(1);
          },
          disableColumnMenu: true,
        },
        {
          field: 'rushes',
          headerName: 'RUSH',
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
          field: 'rushes_per_touchdown',
          headerName: 'R/TD',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row) => {
            return +(row.rushes / row.touchdowns).toFixed(2);
          },
          disableColumnMenu: true,
        },
        {
          field: 'broken_tackles',
          headerName: 'BTK',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'broken_tackles_per_rush',
          headerName: 'BTK/R',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row) => {
            return +(row.broken_tackles / row.rushes).toFixed(2);
          },
          disableColumnMenu: true,
        },
        {
          field: 'tackles_for_loss',
          headerName: 'TFL',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
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
          headerName: 'GM RTG',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row: GridRowModel) => {
            const gm = getRushingGmRating(row, gamesPlayed);
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
          headerName: 'YPC',
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
          valueGetter: (_value, row: GridRowModel) => {
            return +(+row.yards / +row.games_played).toFixed(1);
          },
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
          valueGetter: (_value, row) => {
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
          valueGetter: (_value, row) => {
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
          headerName: 'GM RTG',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row) => {
            const gm = getRushingGmRating(row, gamesPlayed);
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
