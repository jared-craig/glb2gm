'use client';

import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  Menu,
  MenuItem,
  Popover,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Trait } from './trait';
import { TeamBuilderPlayer } from './teamBuilderPlayer';
import { SALARIES } from './salaries';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DataGridPro,
  GridActionsCellItem,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColDef,
  GridEventListener,
  GridPreProcessEditCellProps,
  GridRenderCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
  GridSlots,
  GridToolbarContainer,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';

function generateGuid() {
  return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function TeamBuilder() {
  const [traits, setTraits] = useState<Trait[]>();
  const [players, setPlayers] = useState<TeamBuilderPlayer[] | GridRowsProp>([]);
  const [capRemaining, setCapRemaining] = useState<number>(150000000);
  const [fetching, setFetching] = useState<boolean>(true);
  const [dataGridLoading, setDataGridLoading] = useState(false);

  const { user } = useUser();

  const getTraitClassName = (salaryMod: number) => {
    if (salaryMod > 1.0) return 'red-text';
    if (salaryMod > 0.5) return 'orange-text';
    if (salaryMod > 0) return 'yellow-text';
    return '';
  };

  const getContractClassName = (contract: string) => {
    if (contract === 'Low') return 'low-contract';
    if (contract === 'High') return 'high-contract';
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
      const id = generateGuid();
      setPlayers((oldRows: any) => [...oldRows, { id, name: '', position: '', trait1: '', trait2: '', trait3: '', contract: '', salary: 0, isNew: true }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit },
      }));
    };

    return (
      <GridToolbarContainer>
        <Stack direction='row' sx={{ width: '100%', justifyContent: 'space-between', p: 0.5 }}>
          <Stack direction='row' spacing={2}>
            <Button variant='contained' disabled={!user}>
              Load Team
            </Button>
            <Button variant='contained' disabled={!user || players.length <= 0}>
              Save Team
            </Button>
            {!user && (
              <Typography variant='body2' sx={{ color: 'yellow' }}>
                In order to load or save, please login.
              </Typography>
            )}
          </Stack>
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <Typography sx={{ color: capRemaining < 0 ? 'red' : '' }}>Cap Space: {capRemaining.toLocaleString()}</Typography>
            <Button color='secondary' startIcon={<AddIcon />} onClick={handleClick}>
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

  const handleDeleteClick = (id: GridRowId) => () => {
    setDataGridLoading(true);
    let newArr = [...players];
    newArr.splice(
      players.findIndex((x) => x.id === id),
      1
    );
    setPlayers(newArr);
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

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const playerColumns: GridColDef[] = [
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
        { value: 'WR', label: 'WR' },
      ],
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError = params.props.value === '';
        return { ...params.props, error: hasError };
      },
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
                !x.position_exclusions.includes(params.row.position) &&
                !x.conflicts.includes(params.row.trait2 === '' ? null : params.row.trait2) &&
                !x.conflicts.includes(params.row.trait3 === '' ? null : params.row.trait3)
            ) ?? [])
          : [],
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError = params.props.value === '';
        return { ...params.props, error: hasError };
      },
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
                !x.position_exclusions.includes(params.row.position) &&
                !x.conflicts.includes(params.row.trait1 === '' ? null : params.row.trait1) &&
                !x.conflicts.includes(params.row.trait3 === '' ? null : params.row.trait3)
            ) ?? [])
          : [],
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError = params.props.value === '';
        return { ...params.props, error: hasError };
      },
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
                !x.position_exclusions.includes(params.row.position) &&
                !x.conflicts.includes(params.row.trait1 === '' ? null : params.row.trait1) &&
                !x.conflicts.includes(params.row.trait2 === '' ? null : params.row.trait2)
            ) ?? [])
          : [],
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError = params.props.value === '';
        return { ...params.props, error: hasError };
      },
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
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError = params.props.value === '';
        return { ...params.props, error: hasError };
      },
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
          <GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={handleDeleteClick(id)} color='inherit' />,
        ];
        // <GridActionsCellItem icon={<EditIcon fontSize='small' />} onClick={() => handlePlayerEdit(params)} label='Edit' />,
        // <GridActionsCellItem icon={<ContentCopyIcon fontSize='small' />} onClick={() => handlePlayerClone(params.row)} label='Clone' />,
        // <GridActionsCellItem icon={<DeleteIcon fontSize='small' />} onClick={() => handlePlayerDelete(params.row.id)} label='Delete' />,
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

  const handlePlayerClone = (player: any) => {
    setDataGridLoading(true);
    const newPlayer = { ...player, id: generateGuid() };
    setPlayers([...players, newPlayer]);
    setTimeout(() => {
      setDataGridLoading(false);
    }, 250);
  };

  const calculateCap = () => {
    console.log('cap', players);
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
        <>
          <Stack spacing={1}>
            <DataGridPro
              rows={players}
              columns={playerColumns}
              loading={dataGridLoading}
              rowReordering
              density='compact'
              autoHeight
              disableColumnMenu
              editMode='row'
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              slots={{
                toolbar: EditToolbar as GridSlots['toolbar'],
              }}
              slotProps={{
                toolbar: { setPlayers, setRowModesModel },
              }}
            />
          </Stack>
        </>
      )}
    </Container>
  );
}
