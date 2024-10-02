'use client';

import {
  Autocomplete,
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
  const [players, setPlayers] = useState<TeamBuilderPlayer[] | GridRowsProp>([
    {
      id: '123',
      player_name: 'test1',
      position: 'HB',
      contract: 'Medium',
      trait1: {
        trait_key: 'early_bloomer',
        trait_name: 'Early Bloomer',
        conflicts: 'hidden_potential',
        position_exclusions: '',
        salary_modifier: 0,
      },
      trait2: {
        trait_key: 'jittery',
        trait_name: 'Jittery',
        conflicts: '',
        position_exclusions: '',
        salary_modifier: 0,
      },
      trait3: {
        trait_key: 'strong_base',
        trait_name: 'Strong Base',
        conflicts: '',
        position_exclusions: '',
        salary_modifier: 0,
      },
      isNew: false,
    },
  ]);
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
      setPlayers((oldRows: any) => [
        ...oldRows,
        { id, player_name: '', position: '', trait1: undefined, trait2: undefined, trait3: undefined, contract: '', salary: 0, isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'player_name' },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
          Add Player
        </Button>
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
    setPlayers(players.filter((row) => row.id !== id));
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
      valueOptions: traits ?? [],
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
      valueOptions: traits ?? [],
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
      valueOptions: traits ?? [],
    },
    {
      field: 'contract',
      headerName: 'Contract',
      flex: 0.75,
      pinnable: false,
      editable: true,
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
      getActions: ({ id }) => {
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

  // Popover
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverData, setPopoverData] = useState<any>();
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    const field = event.currentTarget.dataset.field!;
    const id = event.currentTarget.parentElement!.dataset.id!;
    const player = players.find((r) => r.id === id)!;
    if (field !== 'trait1' && field !== 'trait2' && field !== 'trait3') return;
    setPopoverData(field === 'trait1' ? player.trait1 : field === 'trait2' ? player.trait2 : player.trait3);
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const popoverOpen = Boolean(anchorEl);
  //

  //Dialog
  const [open, setOpen] = useState(false);
  const [availableTraits, setAvailableTraits] = useState<Trait[]>([]);
  const [newPlayerData, setNewPlayerData] = useState<TeamBuilderPlayer>();
  const [selectedName, setSelectedName] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [selectedTraits, setSelectedTraits] = useState<Trait[]>([]);
  const [traitsInputValue, setTraitsInputValue] = useState('');
  const [editIndex, setEditIndex] = useState<number>(-1);

  const handleOpen = () => setOpen(true);
  const handleClose = (r?: 'backdropClick' | 'escapeKeyDown') => {
    if (r && r === 'backdropClick') return null;
    setSelectedName('');
    setSelectedPosition('');
    setSelectedContract('');
    setSelectedTraits([]);
    setOpen(false);
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedName(event.target.value);
  };
  const handlePositionChange = (event: SelectChangeEvent) => {
    setSelectedPosition(event.target.value as string);
  };
  const handleContractChange = (event: SelectChangeEvent) => {
    setSelectedContract(event.target.value as string);
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
    modifier = +player.trait1.salary_modifier + +player.trait2.salary_modifier + +player.trait3.salary_modifier;

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

  const isFormValid = () => {
    if (selectedPosition === '' || selectedContract === '' || selectedTraits.length !== 3) return false;
    return true;
  };
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

  const handlePlayerEdit = (player: any) => {
    setDataGridLoading(true);
    // setSelectedName(player.player_name ?? '');
    // setSelectedPosition(player.position);
    // setSelectedContract(player.contract);
    // setSelectedTraits(player.traits);
    // setEditIndex(player.id);
    // handleOpen();
    setTimeout(() => {
      setDataGridLoading(false);
    }, 250);
  };

  const handlePlayerClone = (player: any) => {
    setDataGridLoading(true);
    const newPlayer = { ...player, id: generateGuid() };
    setPlayers([...players, newPlayer]);
    setTimeout(() => {
      setDataGridLoading(false);
    }, 250);
  };

  const handlePlayerDelete = (id: string) => {
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!traits) return;
    selectedPosition !== '' ? setAvailableTraits([...traits].filter((x) => !x.position_exclusions.includes(selectedPosition))) : setAvailableTraits([]);
  }, [selectedPosition]);

  useEffect(() => {
    const eligibleTraits = selectedPosition !== '' ? (traits?.filter((x) => !x.position_exclusions.includes(selectedPosition)) ?? []) : [];
    setAvailableTraits(eligibleTraits?.filter((x) => !selectedTraits!.some((y) => x.conflicts.includes(y.trait_key))));
  }, [selectedTraits]);

  useEffect(() => {
    if (!newPlayerData) return;
    if (editIndex === -1) {
      setPlayers([...players, newPlayerData]);
    } else {
      setPlayers([...players.slice(0, editIndex), newPlayerData, ...players.slice(editIndex + 1)]);
    }
  }, [newPlayerData]);

  useEffect(() => {
    setCapRemaining(150000000 - players.reduce((sum, player) => sum + (getSalary(player) || 0), 0));
  }, [players]);

  if (fetching) return <LinearProgress sx={{ borderRadius: 2 }} />;

  return (
    <Container maxWidth='xl'>
      {traits && (
        <>
          <Stack spacing={1}>
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
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
            <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>Cap Space: {capRemaining.toLocaleString()}</Typography>
              <Button variant='contained' onClick={() => handleOpen()}>
                New Player
              </Button>
            </Stack>
            <Divider sx={{ my: 1 }} />
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
              processRowUpdate={processRowUpdate}
              slots={{
                toolbar: EditToolbar as GridSlots['toolbar'],
              }}
              slotProps={{
                cell: {
                  onMouseEnter: handlePopoverOpen,
                  onMouseLeave: handlePopoverClose,
                },
                toolbar: { setPlayers, setRowModesModel },
              }}
            />
          </Stack>
          <Dialog
            open={open}
            onClose={(e, r) => handleClose(r)}
            fullWidth
            PaperProps={{
              component: 'form',
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                const player: TeamBuilderPlayer = {
                  id: generateGuid(),
                  player_name: selectedName,
                  position: selectedPosition,
                  contract: selectedContract,
                  trait1: selectedTraits[0],
                  trait2: selectedTraits[1],
                  trait3: selectedTraits[2],
                  isNew: false,
                };
                setNewPlayerData(player);
                handleClose();
              },
            }}
          >
            <DialogTitle>New Player</DialogTitle>
            <DialogContent dividers sx={{ height: '100vh' }}>
              <Stack spacing={2}>
                <TextField
                  margin='dense'
                  id='player_name'
                  name='player_name'
                  label='Name'
                  type='string'
                  fullWidth
                  variant='standard'
                  value={selectedName}
                  onChange={handleNameChange}
                />
                <FormControl required fullWidth>
                  <InputLabel id='position-label'>Position</InputLabel>
                  <Select labelId='position-label' id='position' name='position' label='Position' value={selectedPosition} onChange={handlePositionChange}>
                    <MenuItem value={'QB'}>QB</MenuItem>
                    <MenuItem value={'HB'}>HB</MenuItem>
                    <MenuItem value={'WR'}>WR</MenuItem>
                  </Select>
                </FormControl>
                <FormControl required fullWidth>
                  <InputLabel id='contract-label'>Contract</InputLabel>
                  <Select labelId='contract-label' id='contract' name='contract' label='Contract' value={selectedContract} onChange={handleContractChange}>
                    <MenuItem value={'Low'}>Low</MenuItem>
                    <MenuItem value={'Medium'}>Medium</MenuItem>
                    <MenuItem value={'High'}>High</MenuItem>
                  </Select>
                </FormControl>
                <Autocomplete
                  multiple
                  limitTags={3}
                  disableCloseOnSelect
                  disablePortal
                  options={availableTraits}
                  getOptionKey={(x) => x.trait_key}
                  getOptionLabel={(x) => x.trait_name}
                  renderOption={(props, option) => (
                    <Typography {...props} key={option.trait_key} variant='body2'>
                      {option.trait_name} {option.salary_modifier * 100.0}%
                    </Typography>
                  )}
                  renderInput={(params) => <TextField {...params} label='Traits' />}
                  value={selectedTraits}
                  onChange={(event: any, newValue: Trait[]) => {
                    setSelectedTraits(newValue);
                  }}
                  inputValue={traitsInputValue}
                  onInputChange={(event, newInputValue) => {
                    setTraitsInputValue(newInputValue);
                  }}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose()}>Cancel</Button>
              <Button type='submit' disabled={!isFormValid()}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
          <Popover
            id='mouse-over-popover'
            sx={{ pointerEvents: 'none' }}
            open={popoverOpen}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            {popoverData && (
              <Stack spacing={1} sx={{ px: 2, py: 1 }}>
                <Typography variant='caption'>Salary Modifier: {popoverData.salary_modifier * 100.0}%</Typography>
              </Stack>
            )}
          </Popover>
        </>
      )}
    </Container>
  );
}
