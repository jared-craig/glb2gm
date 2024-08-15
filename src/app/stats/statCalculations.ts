import { GridRowModel } from '@mui/x-data-grid-pro';

export const getPassingGmRating = (row: GridRowModel): number => {
  return Math.round(0.2 * +row.yards + 2.0 * +row.touchdowns - 2.0 * +row.interceptions + 100.0 * +row.yards_per_attempt - +row.sacks);
};

export const getReceivingGmRating = (row: GridRowModel): number => {
  return Math.round(0.2 * +row.yards + 2.0 * +row.touchdowns - 10.0 * +row.drops - +row.fumbles_lost);
};

export const getRushingGmRating = (row: GridRowModel): number => {
  return Math.round(0.1 * +row.yards + 2.0 * +row.touchdowns + 100.0 * +row.average - 10.0 * +row.fumbles_lost);
};

export const getReceivingDropsPerReception = (row: GridRowModel): number => {
  return +(row.drops / row.receptions).toFixed(2);
};
