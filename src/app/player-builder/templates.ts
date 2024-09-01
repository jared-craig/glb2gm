export interface Template {
  position: string;
  templateName: string;
  height: number;
  weight: number;
  strength: number;
  speed: number;
  agility: number;
  stamina: number;
  awareness: number;
  confidence: number;
  trait1: string;
  trait2: string;
  trait3: string;
}

export const getTemplates = (position: string): Template[] => {
  const templates: Template[] = [
    // QB
    {
      position: 'QB',
      templateName: 'Pocket',
      height: 78,
      weight: 253,
      strength: 5,
      speed: 1,
      agility: 10,
      stamina: 5,
      awareness: 4,
      confidence: 10,
      trait1: 'superstar_glam',
      trait2: 'qb_pocket_passer',
      trait3: 'qb_precision_passer',
    },
    // HB
    {
      position: 'HB',
      templateName: 'Slombo',
      height: 66,
      weight: 184,
      strength: 9,
      speed: 1,
      agility: 9,
      stamina: 9,
      awareness: 6,
      confidence: 1,
      trait1: 'superstar_glam',
      trait2: 'hb_rushing_back',
      trait3: 'unpredictable',
    },
    {
      position: 'HB',
      templateName: 'Elusive',
      height: 73,
      weight: 228,
      strength: 1,
      speed: 6,
      agility: 10,
      stamina: 9,
      awareness: 8,
      confidence: 1,
      trait1: 'superstar_glam',
      trait2: 'hb_rushing_back',
      trait3: 'egotist',
    },
    {
      position: 'HB',
      templateName: 'Power',
      height: 76,
      weight: 260,
      strength: 10,
      speed: 1,
      agility: 10,
      stamina: 6,
      awareness: 1,
      confidence: 7,
      trait1: 'superstar_glam',
      trait2: 'meathead',
      trait3: 'bruiser',
    },
    {
      position: 'HB',
      templateName: 'Speed',
      height: 66,
      weight: 180,
      strength: 1,
      speed: 10,
      agility: 10,
      stamina: 10,
      awareness: 1,
      confidence: 3,
      trait1: 'superstar_glam',
      trait2: 'early_bloomer',
      trait3: 'egotist',
    },
    // TE
    {
      position: 'TE',
      templateName: 'Possession',
      height: 80,
      weight: 276,
      strength: 1,
      speed: 2,
      agility: 7,
      stamina: 5,
      awareness: 10,
      confidence: 10,
      trait1: 'superstar_avg',
      trait2: 'te_receiver',
      trait3: 'nerves_of_steel',
    },
    // WR
    {
      position: 'WR',
      templateName: 'Possession',
      height: 78,
      weight: 195,
      strength: 1,
      speed: 1,
      agility: 7,
      stamina: 6,
      awareness: 10,
      confidence: 10,
      trait1: 'superstar_avg',
      trait2: 'soft_hands',
      trait3: 'wr_shifty',
    },
    // DE
    {
      position: 'DE',
      templateName: 'Spin',
      height: 71,
      weight: 240,
      strength: 1,
      speed: 6,
      agility: 10,
      stamina: 5,
      awareness: 10,
      confidence: 3,
      trait1: 'superstar_nonglam',
      trait2: 'dl_technique_man',
      trait3: 'jittery',
    },
  ];

  return templates.filter((x) => x.position === position);
};
