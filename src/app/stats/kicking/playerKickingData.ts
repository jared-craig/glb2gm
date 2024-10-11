import { PlayerData } from '@/app/players/playerData';

export interface PlayerKickingData extends PlayerData {
  fg_made: number;
  fg_attempts: number;
  zero_to_nineteen_made: number;
  zero_to_nineteen_attempts: number;
  twenty_to_twenty_nine_made: number;
  twenty_to_twenty_nine_attempts: number;
  thirty_to_thirty_nine_made: number;
  thirty_to_thirty_nine_attempts: number;
  forty_to_forty_nine_made: number;
  forty_to_forty_nine_attempts: number;
  fifty_plus_made: number;
  fifty_plus_attempts: number;
  xp_made: number;
  xp_attempts: number;
  kickoffs: number;
  touchbacks: number;
  yards: number;
  average: number;
  tier: string;
}
