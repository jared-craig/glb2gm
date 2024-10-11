import { PlayerData } from '@/app/players/playerData';

export interface PlayerReceivingData extends PlayerData {
  targets: number;
  receptions: number;
  yards: number;
  average: number;
  yards_after_catch: number;
  touchdowns: number;
  drops: number;
  fumbles: number;
  fumbles_lost: number;
  tier: string;
}
