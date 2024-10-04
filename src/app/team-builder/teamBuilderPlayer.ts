export interface TeamBuilderPlayer {
  id: string;
  player_name: string | undefined;
  position: string;
  contract: string;
  trait1: string;
  trait2: string;
  trait3: string;
  salary: number;
  is_new: boolean;
  order_index: number;
}
