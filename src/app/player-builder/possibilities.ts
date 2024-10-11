import { Trait } from '../team-builder/trait';

export const getPossibleHeights = (position: string) => {
  switch (position) {
    case 'HB':
      return [66, 76];
  }
};

export const getPossibleWeights = (position: string) => {
  switch (position) {
    case 'HB':
      return [180, 220];
  }
};

export const getPossibleAttributes = () => {
  const combinations = [];
  for (let strength = 1; strength <= 10; strength++) {
    for (let speed = 1; speed <= 10; speed++) {
      for (let agility = 1; agility <= 10; agility++) {
        for (let stamina = 1; stamina <= 10; stamina++) {
          for (let awareness = 1; awareness <= 10; awareness++) {
            for (let confidence = 1; confidence <= 10; confidence++) {
              if (strength + speed + agility + stamina + awareness + confidence === 35) {
                combinations.push({ strength: strength, speed: speed, agility: agility, stamina: stamina, awareness: awareness, confidence: confidence });
              }
            }
          }
        }
      }
    }
  }
  return combinations;
};

const hasConflict = (traits: any, traitKey1: string, traitKey2: string) => {
  if (traitKey1 === traitKey2) return true;
  const trait1 = traits[traitKey1];
  const trait2 = traits[traitKey2];

  return (trait1.conflicts && trait1.conflicts.includes(traitKey2)) || (trait2.conflicts && trait2.conflicts.includes(traitKey1));
};

const isDuplicate = (combinations: any, combination: any) => {
  for (let i = 0; i < combinations.length; i++) {
    if (combinations[i].join(',') === combination.join(',')) {
      return true;
    }
  }
  return false;
};

export const getPossibleTraits = (traits: any, canUseSuperstar: boolean, canUseProdigy: boolean) => {
  const traitKeys = canUseSuperstar
    ? Object.keys(traits)
    : canUseProdigy
      ? Object.keys(traits).filter((x) => !x.includes('superstar'))
      : Object.keys(traits).filter((x) => !x.includes('superstar') && !x.includes('prodigy'));

  const combinations = [];
  for (let j = 1; j < traitKeys.length - 1; j++) {
    for (let k = j + 1; k < traitKeys.length; k++) {
      const traitKey1 = 'superstar_glam';
      const traitKey2 = traitKeys[j];
      const traitKey3 = traitKeys[k];

      if (!hasConflict(traits, traitKey1, traitKey2) && !hasConflict(traits, traitKey1, traitKey3) && !hasConflict(traits, traitKey2, traitKey3)) {
        const combination = [traitKey1, traitKey2, traitKey3].sort();
        if (!isDuplicate(combinations, combination)) {
          combinations.push(combination);
        }
      }
    }
  }
  return combinations;
};
