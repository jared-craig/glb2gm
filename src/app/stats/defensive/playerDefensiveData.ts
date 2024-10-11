import { PlayerData } from '@/app/players/playerData';

export interface PlayerDefensiveData extends PlayerData {
  tackles: number;
  tackle_assists: number;
  missed_tackles: number;
  sticks: number;
  forced_fumbles: number;
  fumble_recoveries: number;
  tackles_for_loss: number;
  defensive_touchdowns: number;
  times_pancaked: number;
  reverse_pancakes: number;
  sacks: number;
  sack_yards: number;
  hurries: number;
  targets: number;
  receptions_allowed: number;
  passes_defended: number;
  passes_knocked_loose: number;
  interceptions: number;
  interception_yards: number;
  tier: string;
}
