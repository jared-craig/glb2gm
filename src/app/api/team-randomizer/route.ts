import { generateGuid } from '@/app/helpers';
import { getSalary } from '@/app/players/salaries';
import { Trait } from '@/app/team-builder/trait';
import { TeamRandomizerPlayer } from '@/app/team-randomizer/teamRandomizerPlayer';
import { NextRequest } from 'next/server';

const getRandomPlayer = (optimalTeamComp: any) => {
  const cumulativeWeights: number[] = [];
  let totalWeight = 0;

  Object.entries(optimalTeamComp).forEach(([, value]: any) => {
    const weight = value.starPower;
    totalWeight += weight;
    cumulativeWeights.push(totalWeight);
  });

  const random = Math.random() * totalWeight;

  let low = 0;
  let high = cumulativeWeights.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (random < cumulativeWeights[mid]) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return Object.keys(optimalTeamComp)[low];
};

const shuffleTraits = (array: Trait[]): Trait[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

interface PostRequestProps {
  traits: Trait[];
  optimalTeamComp: any;
}

export async function POST(request: NextRequest) {
  const reqData: PostRequestProps = await request.json();
  const { traits, optimalTeamComp }: PostRequestProps = reqData;

  let cap = 150000000;

  const newPlayers: TeamRandomizerPlayer[] = [
    {
      id: generateGuid(),
      position: 'C',
      contract: 'Low',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'C',
      contract: 'Low',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'G',
      contract: 'Low',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'G',
      contract: 'Low',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'G',
      contract: 'Low',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'OT',
      contract: 'Low',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'OT',
      contract: 'Low',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'OT',
      contract: 'Low',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'QB',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'FB',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'HB',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'WR',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'WR',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'WR',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'TE',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'C',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'G',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'G',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'OT',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'OT',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'DT',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'DT',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'DE',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'DE',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'LB',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'LB',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'LB',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'CB',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'CB',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'FS',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'SS',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'K',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
    {
      id: generateGuid(),
      position: 'P',
      contract: 'Medium',
      trait1: '',
      trait2: '',
      trait3: '',
      salary: 0,
    },
  ];

  for (const np of newPlayers) {
    const trait1 = shuffleTraits(traits)
      .filter((x) => (np.contract === 'Low' ? x.salary_modifier <= 0 : optimalTeamComp[np.position].maxStars <= 0 ? !x.trait_key.includes('superstar') : true))
      .find((x) => !x.position_exclusions.includes(np.position))?.trait_key;
    const trait2 = shuffleTraits(traits)
      .filter((x) => (np.contract === 'Low' ? x.salary_modifier <= 0 : optimalTeamComp[np.position].maxStars <= 0 ? !x.trait_key.includes('superstar') : true))
      .find((x) => !x.position_exclusions.includes(np.position) && !x.conflicts.includes(trait1!) && x.trait_key !== trait1)?.trait_key;
    const trait3 = shuffleTraits(traits)
      .filter((x) => (np.contract === 'Low' ? x.salary_modifier <= 0 : optimalTeamComp[np.position].maxStars <= 0 ? !x.trait_key.includes('superstar') : true))
      .find(
        (x) =>
          !x.position_exclusions.includes(np.position) &&
          !x.conflicts.includes(trait1!) &&
          !x.conflicts.includes(trait2!) &&
          x.trait_key !== trait1 &&
          x.trait_key !== trait2
      )?.trait_key;
    np.trait1 = trait1!;
    np.trait2 = trait2!;
    np.trait3 = trait3!;
    const salary = getSalary(traits, np);
    np.salary = salary;
    cap -= salary;
  }

  let starTries = 0;
  while (starTries <= 50) {
    const starPosition = getRandomPlayer(optimalTeamComp);

    const numStarsAtPos = newPlayers.filter((x) => x.position === starPosition && x.trait1 === 'superstar_glam').length;
    const normiePlayerAtPosition = newPlayers.find((x) => x.position === starPosition && x.contract !== 'Low' && x.trait1 !== 'superstar_glam');

    if (!normiePlayerAtPosition || numStarsAtPos >= optimalTeamComp[starPosition].maxStars) {
      starTries++;
      continue;
    }

    const trait2 = shuffleTraits(traits).find(
      (x) => !x.position_exclusions.includes(starPosition) && !x.conflicts.includes('superstar_glam') && !x.trait_key.includes('superstar')
    )?.trait_key;
    const trait3 = shuffleTraits(traits).find(
      (x) =>
        !x.position_exclusions.includes(starPosition) &&
        !x.conflicts.includes('superstar_glam') &&
        !x.conflicts.includes(trait2!) &&
        !x.trait_key.includes('superstar') &&
        x.trait_key !== trait2
    )?.trait_key;

    const newStar = {
      id: generateGuid(),
      position: starPosition,
      contract: 'Medium',
      trait1: 'superstar_glam',
      trait2: trait2!,
      trait3: trait3!,
      salary: 0,
    };
    const salary = getSalary(traits, newStar);
    newStar.salary = salary;

    const numAtPos = newPlayers.filter((x) => x.position === starPosition).length;
    if (numAtPos < optimalTeamComp[starPosition].max && newPlayers.length < 36) {
      if (cap - salary < 0) {
        if (cap + normiePlayerAtPosition.salary - salary >= 0) {
          newPlayers.splice(newPlayers.indexOf(normiePlayerAtPosition), 1, newStar);
          cap = cap + normiePlayerAtPosition.salary - salary;
        }
      } else {
        cap -= salary;
        newPlayers.push(newStar);
      }
    } else {
      if (cap + normiePlayerAtPosition.salary - salary >= 0) {
        newPlayers.splice(newPlayers.indexOf(normiePlayerAtPosition), 1, newStar);
        cap = cap + normiePlayerAtPosition.salary - salary;
      }
    }
  }

  let normieTries = 0;
  while (normieTries <= 50 && newPlayers.length < 36) {
    const normiePosition = getRandomPlayer(optimalTeamComp);

    const numAtPos = newPlayers.filter((x) => x.position === normiePosition).length;
    if (numAtPos >= optimalTeamComp[normiePosition].max) {
      normieTries++;
      continue;
    }

    const trait1 = shuffleTraits(traits).find((x) => !x.position_exclusions.includes(normiePosition) && !x.trait_key.includes('superstar'))?.trait_key;
    const trait2 = shuffleTraits(traits).find(
      (x) => !x.position_exclusions.includes(normiePosition) && x.trait_key !== trait1 && !x.trait_key.includes('superstar')
    )?.trait_key;
    const trait3 = shuffleTraits(traits).find(
      (x) =>
        !x.position_exclusions.includes(normiePosition) &&
        !x.conflicts.includes(trait1!) &&
        !x.conflicts.includes(trait2!) &&
        !x.trait_key.includes('superstar') &&
        x.trait_key !== trait1 &&
        x.trait_key !== trait2
    )?.trait_key;
    const newNormie = {
      id: generateGuid(),
      position: normiePosition,
      contract: 'Medium',
      trait1: trait1!,
      trait2: trait2!,
      trait3: trait3!,
      salary: 0,
    };
    const salary = getSalary(traits, newNormie);
    newNormie.salary = salary;

    if (cap - salary < 0) {
      normieTries++;
      continue;
    }

    cap -= salary;
    newPlayers.push(newNormie);
  }

  let contractTries = 0;
  while (cap > 0 && contractTries <= 50) {
    const position = getRandomPlayer(optimalTeamComp);
    const player = newPlayers.sort((a, b) => b.salary - a.salary).find((x) => x.position === position && x.contract === 'Medium');
    if (!player) {
      contractTries++;
      continue;
    }
    const newPlayer = {
      ...player,
      contract: 'High',
    };
    const newSalary = getSalary(traits, newPlayer);
    newPlayer.salary = newSalary;
    if (cap + player.salary - newSalary >= 0) {
      newPlayers.splice(newPlayers.indexOf(player), 1, newPlayer);
      cap = cap + player.salary - newSalary;
    } else {
      contractTries++;
    }
  }

  return Response.json({ newPlayers });
}
