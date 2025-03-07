'use client';

import { DataGridPremium, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-premium';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { CustomGridToolbarWithTierAndSeason } from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getDefensiveGmRating } from '../statCalculations';
import { PlayerDefensiveData } from './playerDefensiveData';
import { PlayerData } from '@/app/players/playerData';

interface PlayerDefensiveStatsProps {
  tier: string;
  tierFilter: (tier: string) => void;
  tierOptions: string[];
  season: string;
  seasonFilter: (season: string) => void;
  seasonOptions: string[];
}

export default function PlayerDefensiveStats({ tier, tierFilter, tierOptions, season, seasonFilter, seasonOptions }: PlayerDefensiveStatsProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerDefensiveData[]>([]);
  const [rows, setRows] = useState<PlayerDefensiveData[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState<number>();

  const fetchData = async () => {
    const data = await fetch('/api/defensive').then((res) => res.json());
    setData(data);
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerDefensiveData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerDefensiveData) => x.tier === tier && x.season === +season)
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
        ? data.filter((x: PlayerDefensiveData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerDefensiveData) => x.tier === tier && x.season === +season)
    );
    setGamesPlayed(Math.max(...data.filter((x: PlayerData) => x.tier === tier && x.season === +season).map((x: PlayerData) => x.games_played)));
  }, [tier]);

  useEffect(() => {
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerDefensiveData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerDefensiveData) => x.tier === tier && x.season === +season)
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
          field: 'sacks',
          headerName: 'SACKS',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'tackles',
          headerName: 'TK',
          width: 120,
          type: 'number',
          pinnable: false,
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
          field: 'missed_tackles',
          headerName: 'MSTK',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'tackle_percentage',
          headerName: 'TACK%',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
          valueGetter: (_value, row: GridRowModel) => {
            return +((+row.tackles / (+row.tackles + +row.missed_tackles)) * 100.0).toFixed(2);
          },
        },
        {
          field: 'sticks',
          headerName: 'STICK',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'interceptions',
          headerName: 'INT',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'forced_fumbles',
          headerName: 'FF',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'fumble_recoveries',
          headerName: 'FUMR',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'hurries',
          headerName: 'HRY',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'reverse_pancakes',
          headerName: 'REVP',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'passes_defended',
          headerName: 'PD',
          width: 120,
          type: 'number',
          pinnable: false,
          disableColumnMenu: true,
        },
        {
          field: 'passes_knocked_loose',
          headerName: 'KL',
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
          disableColumnMenu: true,
          valueGetter: (_value, row: GridRowModel) => {
            const gm = getDefensiveGmRating(row, gamesPlayed);
            return gm === Number.MIN_SAFE_INTEGER ? null : gm;
          },
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
          field: 'tackle_percentage',
          headerName: 'TACK%',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row: GridRowModel) => {
            return +((+row.tackles / (+row.tackles + +row.missed_tackles)) * 100.0).toFixed(2);
          },
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
          field: 'reverse_pancakes',
          headerName: 'REVP',
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
          valueGetter: (_value, row) => {
            const gm = getDefensiveGmRating(row, gamesPlayed);
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
