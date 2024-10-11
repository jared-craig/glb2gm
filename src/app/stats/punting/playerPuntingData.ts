import { PlayerData } from '@/app/players/playerData';

export interface PlayerPuntingData extends PlayerData {
  punts: number;
  yards: number;
  average: number;
  touchbacks: number;
  coffins: number;
  hangtime: number;
  inside_five: number;
  inside_ten: number;
  inside_twenty: number;
  tier: string;
}
