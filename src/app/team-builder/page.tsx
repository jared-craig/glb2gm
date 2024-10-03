'use client';

import { Box, Button, Container, Grid2, LinearProgress, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Trait } from './trait';
import { TeamBuilderPlayer } from './teamBuilderPlayer';
import { SALARIES } from './salaries';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  DataGridPro,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowOrderChangeParams,
  GridRowsProp,
  GridSlots,
  GridToolbarContainer,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';

function generateGuid() {
  return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function TeamBuilder() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [traits, setTraits] = useState<Trait[]>();
  const [players, setPlayers] = useState<TeamBuilderPlayer[] | GridRowsProp>([]);
  const [capRemaining, setCapRemaining] = useState<number>(150000000);
  const [fetching, setFetching] = useState<boolean>(true);
  const [dataGridLoading, setDataGridLoading] = useState(false);

  const { user } = useUser();

  const getTraitClassName = (traitKey: string) => {
    const salaryMod = traits?.find((x) => x.trait_key === traitKey)?.salary_modifier;
    if (!salaryMod) return '';
    if (salaryMod > 1.0) return 'red-text';
    if (salaryMod > 0.5) return 'orange-text';
    if (salaryMod > 0) return 'yellow-text';
    return '';
  };

  // Datagrid
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  interface EditToolbarProps {
    setPlayers: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
  }

  function EditToolbar(props: EditToolbarProps) {
    const { setPlayers, setRowModesModel } = props;

    const handleClick = () => {
      setDataGridLoading(true);
      const id = generateGuid();
      setPlayers((oldRows: any) => [
        ...oldRows,
        { id, player_name: '', position: '', trait1: '', trait2: '', trait3: '', contract: '', salary: 0, isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit },
      }));
      setTimeout(() => {
        setDataGridLoading(false);
      }, 250);
    };

    return (
      <GridToolbarContainer>
        <Stack direction='row' sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', p: 0.5 }}>
          <Stack>
            <Stack direction='row' spacing={2}>
              <Button variant='contained' size='small' disabled={!user || true}>
                Load Team (Soon)
              </Button>
              <Button variant='contained' size='small' disabled={!user || players.length <= 0 || true}>
                Save Team (Soon)
              </Button>
            </Stack>
            {!user && (
              <Typography variant='body2' sx={{ color: 'yellow', px: 1 }}>
                In order to load or save, please login.
              </Typography>
            )}
          </Stack>

          <Stack sx={{ flexGrow: 1, px: 4 }}>
            <Grid2 container spacing={1} columns={8}>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'QB').length > 2 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'QB').length}/2 QB
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'HB').length > 3 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'HB').length}/3 HB
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'FB').length > 2 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'FB').length}/2 FB
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'TE').length > 3 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'TE').length}/3 TE
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'WR').length > 8 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'WR').length}/8 WR
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'C').length > 3 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'C').length}/3 C
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'G').length > 5 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'G').length}/5 G
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'OT').length > 5 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'OT').length}/5 OT
                </Typography>
              </Grid2>
            </Grid2>
            <Grid2 container spacing={1} columns={8}>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'DT').length > 5 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'DT').length}/5 DT
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'DE').length > 5 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'DE').length}/5 DE
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'LB').length > 8 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'LB').length}/8 LB
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'CB').length > 8 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'CB').length}/8 CB
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'FS').length > 4 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'FS').length}/4 FS
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'SS').length > 4 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'SS').length}/4 SS
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'K').length > 1 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'K').length}/1 K
                </Typography>
              </Grid2>
              <Grid2 size={1}>
                <Typography variant='body2' sx={{ color: players.filter((x) => x.position === 'P').length > 1 ? 'red' : '' }}>
                  {players.filter((x) => x.position === 'P').length}/1 P
                </Typography>
              </Grid2>
            </Grid2>
          </Stack>
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <Typography sx={{ color: capRemaining < 0 ? 'red' : '' }}>Cap Space: {capRemaining.toLocaleString()}</Typography>
            <Button color='secondary' startIcon={<AddIcon />} onClick={handleClick} disabled={players.length >= 48}>
              Add Player
            </Button>
          </Stack>
        </Stack>
      </GridToolbarContainer>
    );
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCloneClick = (id: GridRowId) => () => {
    setDataGridLoading(true);
    const newPlayer = { ...players.find((x) => x.id === id), id: generateGuid(), isNew: true };
    setPlayers((oldRows: any) => [...oldRows, newPlayer]);
    setTimeout(() => {
      setDataGridLoading(false);
    }, 250);
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setDataGridLoading(true);
    setPlayers(players.filter((row) => row.id !== id));
    setTimeout(() => {
      setDataGridLoading(false);
    }, 250);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = players.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setPlayers(players.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setPlayers(players.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const updateRowPosition = (initialIndex: number, newIndex: number, rows: TeamBuilderPlayer[]): Promise<any> => {
    return new Promise((resolve) => {
      const rowsClone = [...rows];
      const row = rowsClone.splice(initialIndex, 1)[0];
      rowsClone.splice(newIndex, 0, row);
      resolve(rowsClone);
    });
  };

  const handleRowOrderChange = async (params: GridRowOrderChangeParams) => {
    setDataGridLoading(true);
    const newRows = await updateRowPosition(params.oldIndex, params.targetIndex, players as TeamBuilderPlayer[]);

    setPlayers(newRows);
    setTimeout(() => {
      setDataGridLoading(false);
    }, 250);
  };

  const playerColumns: GridColDef[] = !desktop
    ? [
        {
          field: 'player_name',
          headerName: 'Name',
          width: 120,
          pinnable: false,
          editable: true,
        },
        {
          field: 'position',
          headerName: 'Position',
          width: 100,
          pinnable: false,
          editable: true,
          type: 'singleSelect',
          valueOptions: [
            { value: 'QB', label: 'QB' },
            { value: 'HB', label: 'HB' },
            { value: 'FB', label: 'FB' },
            { value: 'TE', label: 'TE' },
            { value: 'WR', label: 'WR' },
            { value: 'C', label: 'C' },
            { value: 'G', label: 'G' },
            { value: 'OT', label: 'OT' },
            { value: 'DT', label: 'DT' },
            { value: 'DE', label: 'DE' },
            { value: 'LB', label: 'LB' },
            { value: 'CB', label: 'CB' },
            { value: 'FS', label: 'FS' },
            { value: 'SS', label: 'SS' },
            { value: 'K', label: 'K' },
            { value: 'P', label: 'P' },
          ],
        },
        {
          field: 'trait1',
          headerName: 'Trait 1',
          width: 140,
          pinnable: false,
          editable: true,
          type: 'singleSelect',
          getOptionValue: (value: any) => value.trait_key,
          getOptionLabel: (value: any) => value.trait_name,
          valueOptions: (params) =>
            params.row.position !== ''
              ? (traits?.filter(
                  (x) =>
                    x.trait_key !== params.row.trait2 &&
                    x.trait_key !== params.row.trait3 &&
                    !x.position_exclusions.split(',').includes(params.row.position) &&
                    !x.conflicts.split(',').includes(params.row.trait2 === '' ? null : params.row.trait2) &&
                    !x.conflicts.split(',').includes(params.row.trait3 === '' ? null : params.row.trait3)
                ) ?? [])
              : [],
          cellClassName: (params) => getTraitClassName(params.value),
        },
        {
          field: 'trait2',
          headerName: 'Trait 2',
          width: 140,
          pinnable: false,
          editable: true,
          type: 'singleSelect',
          getOptionValue: (value: any) => value.trait_key,
          getOptionLabel: (value: any) => value.trait_name,
          valueOptions: (params) =>
            params.row.position !== ''
              ? (traits?.filter(
                  (x) =>
                    x.trait_key !== params.row.trait1 &&
                    x.trait_key !== params.row.trait3 &&
                    !x.position_exclusions.split(',').includes(params.row.position) &&
                    !x.conflicts.split(',').includes(params.row.trait1 === '' ? null : params.row.trait1) &&
                    !x.conflicts.split(',').includes(params.row.trait3 === '' ? null : params.row.trait3)
                ) ?? [])
              : [],
          cellClassName: (params) => getTraitClassName(params.value),
        },
        {
          field: 'trait3',
          headerName: 'Trait 3',
          width: 140,
          pinnable: false,
          editable: true,
          type: 'singleSelect',
          getOptionValue: (value: any) => value.trait_key,
          getOptionLabel: (value: any) => value.trait_name,
          valueOptions: (params) =>
            params.row.position !== ''
              ? (traits?.filter(
                  (x) =>
                    x.trait_key !== params.row.trait1 &&
                    x.trait_key !== params.row.trait2 &&
                    !x.position_exclusions.split(',').includes(params.row.position) &&
                    !x.conflicts.split(',').includes(params.row.trait1 === '' ? null : params.row.trait1) &&
                    !x.conflicts.split(',').includes(params.row.trait2 === '' ? null : params.row.trait2)
                ) ?? [])
              : [],
          cellClassName: (params) => getTraitClassName(params.value),
        },
        {
          field: 'contract',
          headerName: 'Contract',
          width: 120,
          pinnable: false,
          editable: true,
          type: 'singleSelect',
          valueOptions: [
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
          ],
          renderCell: (params) => (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              {params.value === 'High' ? (
                <ArrowCircleUpIcon />
              ) : params.value === 'Medium' ? (
                <RemoveCircleOutlineIcon sx={{ opacity: 0.67 }} />
              ) : (
                <ArrowCircleDownIcon sx={{ opacity: 0.33 }} />
              )}
            </Box>
          ),
        },
        {
          field: 'salary',
          headerName: 'Salary',
          type: 'number',
          width: 120,
          pinnable: false,
          valueGetter: (value, row) => getSalary(row),
        },
        {
          field: 'actions',
          type: 'actions',
          width: 120,
          getActions: ({ id, row }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
              return [
                <GridActionsCellItem
                  icon={<SaveIcon />}
                  label='Save'
                  sx={{
                    color: 'primary.main',
                  }}
                  onClick={handleSaveClick(id)}
                />,
                <GridActionsCellItem icon={<CancelIcon />} label='Cancel' className='textPrimary' onClick={handleCancelClick(id)} color='inherit' />,
              ];
            }

            return [
              <GridActionsCellItem icon={<EditIcon />} label='Edit' className='textPrimary' onClick={handleEditClick(id)} color='inherit' />,
              <GridActionsCellItem icon={<ContentCopyIcon />} label='Clone' onClick={handleCloneClick(id)} color='inherit' />,
              <GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={handleDeleteClick(id)} color='inherit' />,
            ];
          },
        },
      ]
    : [
        {
          field: 'player_name',
          headerName: 'Name',
          flex: 1,
          pinnable: false,
          editable: true,
        },
        {
          field: 'position',
          headerName: 'Position',
          flex: 0.5,
          pinnable: false,
          editable: true,
          type: 'singleSelect',
          valueOptions: [
            { value: 'QB', label: 'QB' },
            { value: 'HB', label: 'HB' },
            { value: 'FB', label: 'FB' },
            { value: 'TE', label: 'TE' },
            { value: 'WR', label: 'WR' },
            { value: 'C', label: 'C' },
            { value: 'G', label: 'G' },
            { value: 'OT', label: 'OT' },
            { value: 'DT', label: 'DT' },
            { value: 'DE', label: 'DE' },
            { value: 'LB', label: 'LB' },
            { value: 'CB', label: 'CB' },
            { value: 'FS', label: 'FS' },
            { value: 'SS', label: 'SS' },
            { value: 'K', label: 'K' },
            { value: 'P', label: 'P' },
          ],
        },
        {
          field: 'trait1',
          headerName: 'Trait 1',
          flex: 1.5,
          pinnable: false,
          editable: true,
          type: 'singleSelect',
          getOptionValue: (value: any) => value.trait_key,
          getOptionLabel: (value: any) => value.trait_name,
          valueOptions: (params) =>
            params.row.position !== ''
              ? (traits?.filter(
                  (x) =>
                    x.trait_key !== params.row.trait2 &&
                    x.trait_key !== params.row.trait3 &&
                    !x.position_exclusions.split(',').includes(params.row.position) &&
                    !x.conflicts.split(',').includes(params.row.trait2 === '' ? null : params.row.trait2) &&
                    !x.conflicts.split(',').includes(params.row.trait3 === '' ? null : params.row.trait3)
                ) ?? [])
              : [],
          cellClassName: (params) => getTraitClassName(params.value),
        },
        {
          field: 'trait2',
          headerName: 'Trait 2',
          flex: 1.5,
          pinnable: false,
          editable: true,
          type: 'singleSelect',
          getOptionValue: (value: any) => value.trait_key,
          getOptionLabel: (value: any) => value.trait_name,
          valueOptions: (params) =>
            params.row.position !== ''
              ? (traits?.filter(
                  (x) =>
                    x.trait_key !== params.row.trait1 &&
                    x.trait_key !== params.row.trait3 &&
                    !x.position_exclusions.split(',').includes(params.row.position) &&
                    !x.conflicts.split(',').includes(params.row.trait1 === '' ? null : params.row.trait1) &&
                    !x.conflicts.split(',').includes(params.row.trait3 === '' ? null : params.row.trait3)
                ) ?? [])
              : [],
          cellClassName: (params) => getTraitClassName(params.value),
        },
        {
          field: 'trait3',
          headerName: 'Trait 3',
          flex: 1.5,
          pinnable: false,
          editable: true,
          type: 'singleSelect',
          getOptionValue: (value: any) => value.trait_key,
          getOptionLabel: (value: any) => value.trait_name,
          valueOptions: (params) =>
            params.row.position !== ''
              ? (traits?.filter(
                  (x) =>
                    x.trait_key !== params.row.trait1 &&
                    x.trait_key !== params.row.trait2 &&
                    !x.position_exclusions.split(',').includes(params.row.position) &&
                    !x.conflicts.split(',').includes(params.row.trait1 === '' ? null : params.row.trait1) &&
                    !x.conflicts.split(',').includes(params.row.trait2 === '' ? null : params.row.trait2)
                ) ?? [])
              : [],
          cellClassName: (params) => getTraitClassName(params.value),
        },
        {
          field: 'contract',
          headerName: 'Contract',
          flex: 0.75,
          pinnable: false,
          editable: true,
          type: 'singleSelect',
          valueOptions: [
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
          ],
          renderCell: (params) => (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              {params.value === 'High' ? (
                <ArrowCircleUpIcon />
              ) : params.value === 'Medium' ? (
                <RemoveCircleOutlineIcon sx={{ opacity: 0.67 }} />
              ) : (
                <ArrowCircleDownIcon sx={{ opacity: 0.33 }} />
              )}
            </Box>
          ),
        },
        {
          field: 'salary',
          headerName: 'Salary',
          type: 'number',
          flex: 1,
          pinnable: false,
          valueGetter: (value, row) => getSalary(row),
        },
        {
          field: 'actions',
          type: 'actions',
          flex: 1,
          getActions: ({ id, row }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
              return [
                <GridActionsCellItem
                  icon={<SaveIcon />}
                  label='Save'
                  sx={{
                    color: 'primary.main',
                  }}
                  onClick={handleSaveClick(id)}
                />,
                <GridActionsCellItem icon={<CancelIcon />} label='Cancel' className='textPrimary' onClick={handleCancelClick(id)} color='inherit' />,
              ];
            }

            return [
              <GridActionsCellItem icon={<EditIcon />} label='Edit' className='textPrimary' onClick={handleEditClick(id)} color='inherit' />,
              <GridActionsCellItem icon={<ContentCopyIcon />} label='Clone' onClick={handleCloneClick(id)} color='inherit' />,
              <GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={handleDeleteClick(id)} color='inherit' />,
            ];
          },
        },
      ];
  //

  const fetchData = async () => {
    setFetching(true);
    const traitsRes = await fetch('/api/traits');
    const traitsData: Trait[] = await traitsRes.json();
    setTraits(
      traitsData.sort((a, b) => {
        if (a.trait_name === 'Superstar') {
          return -1;
        } else if (b.trait_name === 'Superstar') {
          return 1;
        } else if (a.trait_name === 'Prodigy') {
          return -1;
        } else if (b.trait_name === 'Prodigy') {
          return 1;
        } else {
          return a.trait_name.localeCompare(b.trait_name);
        }
      })
    );
    setFetching(false);
  };

  const getSalary = (player: any): number => {
    if (!traits || !player.position || !player.contract || !player.trait1 || !player.trait2 || !player.trait3) return 0;
    let salary = SALARIES[player.position] * 0.52 * ((2 + Math.pow(25, 1.135)) / 2);
    let modifier = 0;
    let contractModifier = 0;
    switch (player.contract) {
      case 'Low':
        contractModifier = 0.875;
        break;
      case 'Medium':
        contractModifier = 1;
        break;
      case 'High':
        contractModifier = 1.2;
        break;
    }

    const t1 = traits.find((x) => x.trait_key === player.trait1)?.salary_modifier;
    const t2 = traits.find((x) => x.trait_key === player.trait2)?.salary_modifier;
    const t3 = traits.find((x) => x.trait_key === player.trait3)?.salary_modifier;
    modifier = +t1! + +t2! + +t3!;

    salary *= 1 + modifier;

    if (salary > 5000000) {
      salary = 25000 * Math.ceil(salary / 25000);
    } else if (salary > 1000000) {
      salary = 10000 * Math.ceil(salary / 10000);
    } else {
      salary = 5000 * Math.ceil(salary / 5000);
    }

    return (salary *= contractModifier);
  };

  const calculateCap = () => {
    setCapRemaining(150000000 - players.reduce((sum, player) => sum + (getSalary(player) || 0), 0));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateCap();
  }, [players]);

  if (fetching) return <LinearProgress sx={{ borderRadius: 2 }} />;

  return (
    <Container maxWidth='xl'>
      {traits && (
        <DataGridPro
          rows={players}
          columns={playerColumns}
          loading={dataGridLoading}
          density='compact'
          autoHeight
          disableColumnMenu
          disableRowSelectionOnClick
          rowReordering
          onRowOrderChange={handleRowOrderChange}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          getRowHeight={({ id, densityFactor }) => (!desktop ? 'auto' : 40 * densityFactor)}
          getRowClassName={(params) =>
            params.row.position === '' || params.row.trait1 === '' || params.row.trait2 === '' || params.row.trait3 === '' || params.row.contract === ''
              ? 'invalid-row'
              : 'valid-row'
          }
          slots={{
            toolbar: EditToolbar as GridSlots['toolbar'],
          }}
          slotProps={{
            toolbar: { setPlayers, setRowModesModel },
          }}
        />
      )}
    </Container>
  );
}
