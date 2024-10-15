export const getPossibleHeightsWeights = (position: string): { height: number; weight: number }[] => {
  const combinations: { height: number; weight: number }[] = [];
  switch (position) {
    case 'QB':
      for (let height = 70; height <= 78; height++) {
        const minWeight = 165 + (height - 70) * 6;
        const maxWeight = 205 + (height - 70) * 6;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'HB':
      for (let height = 66; height <= 76; height++) {
        const minWeight = 180 + (height - 66) * 4;
        const maxWeight = 220 + (height - 66) * 4;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    default:
      return combinations;
  }
};

export const getPossibleAttributes = (): { strength: number; speed: number; agility: number; stamina: number; awareness: number; confidence: number }[] => {
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

const hasConflict = (traits: any, traitKey1: string, traitKey2: string): boolean => {
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

export const getPossibleTraits = (traits: any): string[][] => {
  const traitKeys = Object.keys(traits);

  const combinations = [];
  for (let i = 0; i < traitKeys.length - 2; i++) {
    for (let j = 1; j < traitKeys.length - 1; j++) {
      for (let k = j + 1; k < traitKeys.length; k++) {
        const traitKey1 = traitKeys[i];
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
  }
  return combinations;
};
