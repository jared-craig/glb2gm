export interface PlayerSkill {
  priority: number;
  position_base_price: PositionBasePrice;
  name: string;
  height: number;
  group: string;
  position_multiplier: PositionMultiplier;
  desc: string;
  weight: number;
  positions: string[];
  base_price: number;
  attributes: Attributes;
  full_name?: string;
  exponent?: number;
}

interface PositionMultiplier {
  [position: string]: number;
}

interface PositionBasePrice {
  [position: string]: number;
}

interface Attributes {
  stamina: number;
  awareness: number;
  speed: number;
  agility: number;
  confidence: number;
  strength: number;
}
