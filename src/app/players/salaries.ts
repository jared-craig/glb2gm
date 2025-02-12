import { Trait } from '../team-builder/trait';

interface SalaryLookup {
  [key: string]: number;
}

export const SALARIES: SalaryLookup = {
  QB: 370000,
  HB: 360000,
  FB: 200000,
  WR: 265000,
  C: 195000,
  G: 200000,
  OT: 205000,
  TE: 280000,
  DT: 260000,
  DE: 270000,
  LB: 300000,
  CB: 260000,
  FS: 240000,
  SS: 240000,
  K: 120000,
  P: 120000,
};

export const getSalary = (traits: Trait[], player: any): number => {
  if (!traits || !player.position) return 0;
  let salary = SALARIES[player.position] * 0.52 * ((2 + Math.pow(25, 1.135)) / 2);
  let modifier = 0;
  let contractModifier = 1;
  switch (player.contract) {
    case 'Low':
      contractModifier = 0.875;
      break;
    case 'Medium':
      contractModifier = 1;
      break;
    case 'High':
      contractModifier = 1.2;
      break;
  }

  const t1 = traits.find((x) => x.trait_key === player.trait1)?.salary_modifier ?? 0;
  const t2 = traits.find((x) => x.trait_key === player.trait2)?.salary_modifier ?? 0;
  const t3 = traits.find((x) => x.trait_key === player.trait3)?.salary_modifier ?? 0;
  modifier = +t1! + +t2! + +t3!;

  salary *= 1 + modifier;

  if (salary > 5000000) {
    salary = 25000 * Math.ceil(salary / 25000);
  } else if (salary > 1000000) {
    salary = 10000 * Math.ceil(salary / 10000);
  } else {
    salary = 5000 * Math.ceil(salary / 5000);
  }

  return (salary *= contractModifier);
};
