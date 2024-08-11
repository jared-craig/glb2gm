export interface PlayerRushingData {
  playerName: string;
  position: string;
  rushes: number;
  yards: number;
  average: number;
  touchdowns: number;
  brokenTackles: number;
  yardsAfterContact: number;
  tacklesForLoss: number;
  fumbles: number;
  fumblesLost: number;
  tier: string;
}

export interface PlayerPassingData {
  playerName: string;
  completions: number;
  attempts: number;
  yards: number;
  completionPercentage: number;
  yardsPerAttempt: number;
  hurries: number;
  sacks: number;
  sackYards: number;
  interceptions: number;
  touchdowns: number;
  tier: string;
}
