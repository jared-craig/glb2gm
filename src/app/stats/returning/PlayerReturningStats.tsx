'use client';

import { DataGridPremium, GridColDef, GridRenderCellParams, GridRowModel } from '@mui/x-data-grid-premium';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PlayerReturningData } from './playerReturningData';
import { CustomGridToolbarWithTierAndSeason } from '@/app/components/CustomGridToolBar';
import Link from 'next/link';
import { getReturningGmRating } from '../statCalculations';
import { PlayerData } from '@/app/players/playerData';

interface PlayerReturningStatsProps {
  tier: string;
  tierFilter: (tier: string) => void;
  tierOptions: string[];
  season: string;
  seasonFilter: (season: string) => void;
  seasonOptions: string[];
}

export default function PlayerReturningStats({ tier, tierFilter, tierOptions, season, seasonFilter, seasonOptions }: PlayerReturningStatsProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [fetched, setFetched] = useState<boolean>(false);
  const [data, setData] = useState<PlayerReturningData[]>([]);
  const [rows, setRows] = useState<PlayerReturningData[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState<number>();

  const fetchData = async () => {
    const data = await fetch('/api/returning').then((res) => res.json());
    setData(data);
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerReturningData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerReturningData) => x.tier === tier && x.season === +season)
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
        ? data.filter((x: PlayerReturningData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerReturningData) => x.tier === tier && x.season === +season)
    );
    setGamesPlayed(Math.max(...data.filter((x: PlayerData) => x.tier === tier && x.season === +season).map((x: PlayerData) => x.games_played)));
  }, [tier]);

  useEffect(() => {
    setRows(
      season === process.env.CURRENT_SEASON
        ? data.filter((x: PlayerReturningData) => !x.retired && x.team_name !== 'N/A' && x.tier === tier && x.season === +season)
        : data.filter((x: PlayerReturningData) => x.tier === tier && x.season === +season)
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
          valueGetter: (_value, row: GridRowModel) => {
            const gm = getReturningGmRating(row, gamesPlayed);
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
          valueGetter: (_value, row) => {
            const gm = getReturningGmRating(row, gamesPlayed);
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
