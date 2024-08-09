'use client';

import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { PlayerPassingData } from './playerPassingData';
import CustomGridToolbar from '@/app/components/CustomGridToolBar';

export default function PlayerPassingStats() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('xl'));

  const [data, setData] = useState<PlayerPassingData[]>([]);
  const [rows, setRows] = useState<PlayerPassingData[]>([]);
  const [tier, setTier] = useState<string>('Veteran');

  const fetchData = async () => {
    const res = await fetch('/api/passing');
    const data = await res.json();
    setData(data);
    setRows(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRows(data.filter((x: PlayerPassingData) => x.tier === tier));
  }, [tier]);

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
          field: 'yards_per_attempt',
          headerName: 'YPA',
          width: 120,
          type: 'number',
          hideSortIcons: true,
          pinnable: false,
        },
        {
          field: 'completion_percentage',
          headerName: 'PCT',
          width: 120,
          type: 'number',
          hideSortIcons: true,
          pinnable: false,
          valueFormatter: (value) => `${value}%`,
        },
        {
          field: 'attempts',
          headerName: 'ATT',
          width: 120,
          type: 'number',
          hideSortIcons: true,
          pinnable: false,
        },
        {
          field: 'completions',
          headerName: 'COMP',
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
          field: 'interceptions',
          headerName: 'INT',
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
          field: 'yards',
          headerName: 'YARDS',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'yards_per_attempt',
          headerName: 'YPA',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'completion_percentage',
          headerName: 'PCT',
          flex: 1,
          type: 'number',
          pinnable: false,
          valueFormatter: (value) => `${value}%`,
        },
        {
          field: 'attempts',
          headerName: 'ATT',
          flex: 1,
          type: 'number',
          pinnable: false,
        },
        {
          field: 'completions',
          headerName: 'YARDS',
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
          field: 'interceptions',
          headerName: 'INT',
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
          field: 'sacks',
          headerName: 'SACK',
          flex: 1,
          type: 'number',
          pinnable: false,
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
        slotProps={{ toolbar: { tierFilter: setTier } }}
        initialState={{
          filter: {
            filterModel: {
              items: [{ field: 'attempts', operator: '>=', value: '100' }],
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
