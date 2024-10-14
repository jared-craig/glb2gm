import { PlayerData } from '@/app/players/playerData';

export interface PlayerBlockingData extends PlayerData {
  plays: number;
  pancakes: number;
  reverse_pancaked: number;
  hurries_allowed: number;
  sacks_allowed: number;
  tier: string;
}
