import { PlayerPassingData } from '../stats/passing/playerPassingData';
import { PlayerReceivingData } from '../stats/receiving/playerReceivingData';
import { PlayerRushingData } from '../stats/rushing/playerRushingData';

export interface AllStarTeam {
  qb: PlayerPassingData;
  fb: PlayerRushingData;
  hb: PlayerRushingData;
  te: PlayerReceivingData;
  wr1: PlayerReceivingData;
  wr2: PlayerReceivingData;
}
