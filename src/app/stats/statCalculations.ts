import { GridRowModel } from '@mui/x-data-grid-pro';
import { PlayerPassingData } from './passing/playerPassingData';

export const getPassingGmRating = (row: GridRowModel): number => {
  return Math.round(0.2 * +row.yards + 5.0 * +row.touchdowns - 5.0 * +row.interceptions - +row.sacks);
};

export const getReceivingGmRating = (row: GridRowModel): number => {
  return Math.round(0.2 * +row.yards + 5.0 * +row.touchdowns - 100.0 - +row.drops - +row.fumbles_lost);
};

export const getRushingGmRating = (row: GridRowModel): number => {
  return Math.round(0.2 * +row.yards + 5.0 * +row.touchdowns + 100.0 * +row.average - 10.0 * +row.fumbles_lost);
};

export const getReceivingDropsPerReception = (row: GridRowModel): number => {
  return +(row.drops / row.receptions).toFixed(2);
};

// export const getRating = (data: PlayerPassingData | undefined) => {
//   if (!data) return 0;
//   return (
//     (((data.completions / data.attempts - 0.3) * 5.0 +
//       (data.yards / data.attempts - 3.0) * 0.25 +
//       (data.touchdowns / data.attempts) * 20.0 +
//       (2.375 - (data.interceptions / data.attempts) * 25.0)) /
//       6.0) *
//     100.0
//   ).toFixed(1);
// };
