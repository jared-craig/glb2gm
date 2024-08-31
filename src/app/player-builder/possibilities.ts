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
