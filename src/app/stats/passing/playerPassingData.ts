export interface PlayerPassingData {
  id: number;
  player_name: string;
  team_name: string;
  position: string;
  games_played: number;
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
