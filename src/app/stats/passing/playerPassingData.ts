import { PlayerData } from '@/app/players/playerData';

export interface PlayerPassingData extends PlayerData {
  completions: number;
  attempts: number;
  yards: number;
  completion_percentage: number;
  yards_per_attempt: number;
  hurries: number;
  sacks: number;
  sack_yards: number;
  interceptions: number;
  touchdowns: number;
  tier: string;
  rush_yards: number;
  rush_touchdowns: number;
}
