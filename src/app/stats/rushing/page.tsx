'use client';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { PlayerRushingData } from './playerRushingData';

export default function PlayerStats() {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [rows, setRows] = useState<PlayerRushingData[]>([]);

  const fetchData = async () => {
    const res = await fetch('/api/rushing');
    setRows(await res.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: GridColDef[] = smallScreen
    ? [
        {
          field: 'player_name',
          headerName: 'NAME',
          width: 120,
        },
        {
          field: 'rushes',
          headerName: 'RUSH',
          width: 120,
          type: 'number',
        },
        {
          field: 'yards',
          headerName: 'YARDS',
          width: 120,
          type: 'number',
        },
        {
          field: 'average',
          headerName: 'YPC',
          width: 120,
          type: 'number',
        },
        {
          field: 'touchdowns',
          headerName: 'TD',
          width: 120,
          type: 'number',
        },
        {
          field: 'broken_tackles',
          headerName: 'BRTK',
          width: 120,
          type: 'number',
        },
        {
          field: 'fumbles_lost',
          headerName: 'FUML',
          width: 120,
          type: 'number',
        },
      ]
    : [
        {
          field: 'player_name',
          headerName: 'NAME',
          width: 200,
        },
        {
          field: 'position',
          headerName: 'POS',
          width: 100,
        },
        {
          field: 'rushes',
          headerName: 'RUSH',
          width: 120,
          type: 'number',
        },
        {
          field: 'yards',
          headerName: 'YARDS',
          width: 120,
          type: 'number',
        },
        {
          field: 'average',
          headerName: 'YPC',
          width: 120,
          type: 'number',
        },
        {
          field: 'touchdowns',
          headerName: 'TD',
          width: 120,
          type: 'number',
        },
        {
          field: 'broken_tackles',
          headerName: 'BRTK',
          width: 120,
          type: 'number',
        },
        {
          field: 'yards_after_contact',
          headerName: 'YACON',
          width: 120,
          type: 'number',
        },
        {
          field: 'tackles_for_loss',
          headerName: 'TFL',
          width: 120,
          type: 'number',
        },
        {
          field: 'fumbles',
          headerName: 'FUM',
          width: 120,
          type: 'number',
        },
        {
          field: 'fumbles_lost',
          headerName: 'FUML',
          width: 120,
          type: 'number',
        },
      ];

  return (
    <Box>
      <DataGrid
        rows={rows ?? []}
        columns={columns}
        loading={rows.length <= 0}
        autoHeight
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: {
            sortModel: [{ field: 'average', sort: 'desc' }],
          },
        }}
      />
    </Box>
  );
}
