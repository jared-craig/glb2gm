'use client';

import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { PlayerRushingData } from './playerRushingData';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';

export default function PlayerStats() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [rows, setRows] = useState<PlayerRushingData[]>([]);

  const fetchData = async () => {
    const res = await fetch('/api/rushing');
    setRows(await res.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: GridColDef[] = !desktop
    ? [
        {
          field: 'player_name',
          headerName: 'NAME',
          width: 130,
          hideSortIcons: true,
        },
        {
          field: 'yards',
          headerName: 'YARDS',
          width: 120,
          type: 'number',
          hideSortIcons: true,
          pinnable: false,
        },
        {
          field: 'average',
          headerName: 'YPC',
          width: 120,
          type: 'number',
          hideSortIcons: true,
          pinnable: false,
        },
        {
          field: 'rushes',
          headerName: 'RUSH',
          width: 120,
          type: 'number',
          hideSortIcons: true,
          pinnable: false,
        },
        {
          field: 'touchdowns',
          headerName: 'TD',
          width: 120,
          type: 'number',
          hideSortIcons: true,
          pinnable: false,
        },
        {
          field: 'broken_tackles',
          headerName: 'BRTK',
          width: 120,
          type: 'number',
          hideSortIcons: true,
          pinnable: false,
        },
        {
          field: 'tackles_for_loss',
          headerName: 'TFL',
          width: 120,
          type: 'number',
          hideSortIcons: true,
          pinnable: false,
        },
        {
          field: 'fumbles',
          headerName: 'FUM',
          width: 120,
          type: 'number',
          hideSortIcons: true,
          pinnable: false,
        },
        {
          field: 'fumbles_lost',
          headerName: 'FUML',
          width: 120,
          type: 'number',
          hideSortIcons: true,
          pinnable: false,
        },
      ]
    : [
        {
          field: 'player_name',
          headerName: 'NAME',
          flex: 2,
        },
        {
          field: 'position',
          headerName: 'POS',
          flex: 1,
        },
        {
          field: 'rushes',
          headerName: 'RUSH',
          flex: 1,
          type: 'number',
        },
        {
          field: 'yards',
          headerName: 'YARDS',
          flex: 1,
          type: 'number',
        },
        {
          field: 'average',
          headerName: 'YPC',
          flex: 1,
          type: 'number',
        },
        {
          field: 'touchdowns',
          headerName: 'TD',
          flex: 1,
          type: 'number',
        },
        {
          field: 'broken_tackles',
          headerName: 'BRTK',
          flex: 1,
          type: 'number',
        },
        {
          field: 'yards_after_contact',
          headerName: 'YACON',
          flex: 1,
          type: 'number',
        },
        {
          field: 'tackles_for_loss',
          headerName: 'TFL',
          flex: 1,
          type: 'number',
        },
        {
          field: 'fumbles',
          headerName: 'FUM',
          flex: 1,
          type: 'number',
        },
        {
          field: 'fumbles_lost',
          headerName: 'FUML',
          flex: 1,
          type: 'number',
        },
      ];

  return (
    <Box>
      <DataGridPro
        rows={rows ?? []}
        columns={columns}
        loading={rows.length <= 0}
        autoHeight
        pagination
        pageSizeOptions={[15, 30, 50, 100]}
        density='compact'
        disableDensitySelector
        slots={{ toolbar: CustomGridToolbar }}
        initialState={{
          filter: {
            filterModel: {
              items: [{ field: 'rushes', operator: '>=', value: '100' }],
            },
          },
          pagination: { paginationModel: { pageSize: 15 } },
          pinnedColumns: {
            left: ['player_name'],
          },
        }}
      />
    </Box>
  );
}
