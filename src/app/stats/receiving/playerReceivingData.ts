export interface PlayerReceivingData {
  id: number;
  player_name: string;
  team_name: string;
  position: string;
  games_played: number;
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
