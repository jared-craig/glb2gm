import { PlayerDefensiveData } from '../stats/defensive/playerDefensiveData';
import { PlayerPassingData } from '../stats/passing/playerPassingData';
import { PlayerReceivingData } from '../stats/receiving/playerReceivingData';
import { PlayerRushingData } from '../stats/rushing/playerRushingData';

export interface AllStarOffenseTeam {
  qb: PlayerPassingData;
  fb: PlayerRushingData;
  hb: PlayerRushingData;
  te: PlayerReceivingData;
  wr1: PlayerReceivingData;
  wr2: PlayerReceivingData;
}

export interface AllStarDefenseTeam {
  dt1: PlayerDefensiveData;
  dt2: PlayerDefensiveData;
  de1: PlayerDefensiveData;
  de2: PlayerDefensiveData;
  lb1: PlayerDefensiveData;
  lb2: PlayerDefensiveData;
  lb3: PlayerDefensiveData;
  cb1: PlayerDefensiveData;
  cb2: PlayerDefensiveData;
  s1: PlayerDefensiveData;
  s2: PlayerDefensiveData;
}
