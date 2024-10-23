import { Player } from '../players/player';

export interface PlayerBuilderPlayer extends Player {
  skills: { key: string; sp: number }[];
}
