import { PlayerData } from '@/app/players/playerData';

export interface PlayerReturningData extends PlayerData {
  krs: number;
  kr_yards: number;
  kr_average: number;
  kr_touchdowns: number;
  prs: number;
  pr_yards: number;
  pr_average: number;
  pr_touchdowns: number;
}
