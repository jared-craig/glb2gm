'use client';

import { DataGridPremium, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-premium';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PlayerReceivingData } from './playerReceivingData';
import { CustomGridToolbarWithTierAndSeason } from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getReceivingGmRating } from '../statCalculations';
import { PlayerData } from '@/app/players/playerData';

interface PlayerReceivingStatsProps {
  tier: string;
  tierFilter: (tier: string) => void;
  tierOptions: string[];
  season: string;
  seasonFilter: (season: string) => void;
  seasonOptions: string[];
}

export default function PlayerReceivingStats({ tier, tierFilter, tierOptions, season, seasonFilter, seasonOptions }: PlayerReceivingStatsProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerReceivingData[]>([]);
  const [rows, setRows] = useState<PlayerReceivingData[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState<number>();

  const fetchData = async () => {
    const data = await fetch('/api/receiving').then((res) => res.json());
    setData(data);
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerReceivingData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerReceivingData) => x.tier === tier && x.season === +season)
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
        ? data.filter((x: PlayerReceivingData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerReceivingData) => x.tier === tier && x.season === +season)
    );
    setGamesPlayed(Math.max(...data.filter((x: PlayerData) => x.tier === tier && x.season === +season).map((x: PlayerData) => x.games_played)));
  }, [tier]);

  useEffect(() => {
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerReceivingData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerReceivingData) => x.tier === tier && x.season === +season)
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
          headerName: 'YPR',
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
          field: 'catch_rate',
          headerName: 'REC%',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row: GridRowModel) => {
            return +((row.receptions / row.targets) * 100.0).toFixed(1);
          },
          valueFormatter: (value) => `${value}%`,
          disableColumnMenu: true,
        },
        {
          field: 'yards_per_target',
          headerName: 'Y/TAR',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row: GridRowModel) => {
            return +(row.yards / row.targets).toFixed(2);
          },
          disableColumnMenu: true,
        },
        {
          field: 'receptions_per_touchdown',
          headerName: 'REC/TD',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row: GridRowModel) => {
            return +(row.receptions / row.touchdowns).toFixed(2);
          },
          disableColumnMenu: true,
        },
        {
          field: 'targets_per_touchdown',
          headerName: 'TAR/TD',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row: GridRowModel) => {
            return +(row.targets / row.touchdowns).toFixed(2);
          },
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
          headerName: 'D/REC',
          width: 120,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row) => {
            return (row.drops / row.receptions).toFixed(2);
          },
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
            const gm = getReceivingGmRating(row, gamesPlayed);
            return gm === Number.MIN_SAFE_INTEGER ? null : gm;
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
          valueGetter: (_value, row: GridRowModel) => {
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
          valueGetter: (_value, row: GridRowModel) => {
            return +((row.receptions / row.targets) * 100.0).toFixed(1);
          },
          valueFormatter: (value) => `${value}%`,
        },
        {
          field: 'yards_per_target',
          headerName: 'Y/TAR',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row: GridRowModel) => {
            return +(row.yards / row.targets).toFixed(2);
          },
        },
        {
          field: 'receptions_per_touchdown',
          headerName: 'REC/TD',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row: GridRowModel) => {
            return +(row.receptions / row.touchdowns).toFixed(2);
          },
        },
        {
          field: 'targets_per_touchdown',
          headerName: 'TAR/TD',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row: GridRowModel) => {
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
          valueGetter: (_value, row) => {
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
          headerName: 'GM RTG',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueGetter: (_value, row) => {
            const gm = getReceivingGmRating(row, gamesPlayed);
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
