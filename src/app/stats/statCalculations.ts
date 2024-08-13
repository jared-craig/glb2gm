import { GridRowModel } from '@mui/x-data-grid-pro';

export const getPassingGmRating = (row: GridRowModel): number => {
  return Math.round(0.2 * +row.yards + 5.0 * +row.touchdowns - 10.0 * +row.interceptions - +row.sacks);
};

export const getReceivingGmRating = (row: GridRowModel): number => {
  return Math.round(0.2 * +row.yards + 5.0 * +row.touchdowns - 100.0 - +row.drops - +row.fumbles_lost);
};

export const getRushingGmRating = (row: GridRowModel): number => {
  return Math.round(0.2 * +row.yards + 5.0 * +row.touchdowns + 100.0 * +row.average - +row.fumbles_lost);
};

export const getReceivingDropsPerReception = (row: GridRowModel): number => {
  return +(row.drops / row.receptions).toFixed(2);
};
