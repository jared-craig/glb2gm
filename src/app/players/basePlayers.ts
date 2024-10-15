import { Player } from './player';

export const getBasePlayers = (position: string): Player => {
  const basePlayers: { [key: string]: Player } = {
    QB: {
      position: 'QB',
      height: 78,
      weight: 232,
      strength: 1,
      speed: 1,
      agility: 10,
      stamina: 6,
      awareness: 7,
      confidence: 10,
      trait1: 'superstar_glam',
      trait2: 'qb_pocket_passer',
      trait3: 'early_bloomer',
    },
    HB: {
      position: 'HB',
      height: 66,
      weight: 188,
      strength: 10,
      speed: 1,
      agility: 10,
      stamina: 10,
      awareness: 3,
      confidence: 1,
      trait1: 'superstar_glam',
      trait2: 'hb_rushing_back',
      trait3: 'unpredictable',
    },
  };

  return basePlayers[position];
};
