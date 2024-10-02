import { Trait } from './trait';

export interface TeamBuilderPlayer {
  id: string;
  player_name: string | undefined;
  position: string;
  contract: string;
  trait1: Trait;
  trait2: Trait;
  trait3: Trait;
  isNew: boolean;
}
