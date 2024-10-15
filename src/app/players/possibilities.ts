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
    case 'FB':
      for (let height = 70; height <= 76; height++) {
        const minWeight = 220 + (height - 70) * 2;
        const maxWeight = 250 + (height - 70) * 2;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'TE':
      for (let height = 72; height <= 80; height++) {
        const minWeight = 230 + (height - 72) * 2;
        const maxWeight = 260 + (height - 72) * 2;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'WR':
      for (let height = 68; height <= 78; height++) {
        const minWeight = 165 + (height - 68) * 3;
        const maxWeight = 205 + (height - 68) * 3;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'C':
      for (let height = 72; height <= 78; height++) {
        const minWeight = 230 + (height - 72) * 5;
        const maxWeight = 300 + (height - 72) * 5;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'G':
      for (let height = 74; height <= 79; height++) {
        const minWeight = 290 + (height - 74) * 6;
        const maxWeight = 325 + (height - 74) * 6;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'OT':
      for (let height = 74; height <= 81; height++) {
        const minWeight = 280 + (height - 74) * 4;
        const maxWeight = 320 + (height - 74) * 4;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'DT':
      for (let height = 72; height <= 80; height++) {
        const minWeight = 250 + (height - 72) * 8;
        const maxWeight = 300 + (height - 72) * 8;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'DE':
      for (let height = 71; height <= 80; height++) {
        const minWeight = 240 + (height - 71) * 5;
        const maxWeight = 280 + (height - 71) * 5;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'LB':
      for (let height = 70; height <= 78; height++) {
        const minWeight = 220 + (height - 70) * 2;
        const maxWeight = 250 + (height - 70) * 2;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'CB':
      for (let height = 68; height <= 75; height++) {
        const minWeight = 170 + (height - 68) * 2;
        const maxWeight = 200 + (height - 68) * 2;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'FS':
      for (let height = 68; height <= 76; height++) {
        const minWeight = 185 + (height - 68) * 2;
        const maxWeight = 205 + (height - 68) * 2;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'SS':
      for (let height = 69; height <= 77; height++) {
        const minWeight = 195 + (height - 69) * 1;
        const maxWeight = 225 + (height - 69) * 1;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'K':
      for (let height = 69; height <= 77; height++) {
        const minWeight = 170 + (height - 69) * 1;
        const maxWeight = 220 + (height - 69) * 1;
        for (let weight = minWeight; weight <= maxWeight; weight++) {
          combinations.push({ height, weight });
        }
      }
      return combinations;
    case 'P':
      for (let height = 71; height <= 77; height++) {
        const minWeight = 180 + (height - 71) * 4;
        const maxWeight = 230 + (height - 71) * 4;
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
