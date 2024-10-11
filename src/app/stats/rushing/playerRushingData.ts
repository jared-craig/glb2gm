import { PlayerData } from '@/app/players/playerData';

export interface PlayerRushingData extends PlayerData {
  rushes: number;
  yards: number;
  average: number;
  touchdowns: number;
  broken_tackles: number;
  yards_after_contact: number;
  tackles_for_loss: number;
  fumbles: number;
  fumbles_lost: number;
  rec_yards: number;
  rec_touchdowns: number;
}
