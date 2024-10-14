import { GameData } from '../games/gameData';

export const extractTeamData = (originalObject: any, keyword: string) => {
  const newObject: any = {};
  for (const property in originalObject) {
    if (property !== 'team_one_id' && property !== 'team_two_id' && (property.includes('team_one_') || property.includes('team_two_'))) {
      if (keyword === 'team_one_') {
        newObject[property.replace('team_one_', 'offensive_')] = originalObject[property];
        newObject[property.replace('team_two_', 'defensive_')] = originalObject[property];
      }
      if (keyword === 'team_two_') {
        newObject[property.replace('team_one_', 'defensive_')] = originalObject[property];
        newObject[property.replace('team_two_', 'offensive_')] = originalObject[property];
      }
    }
  }
  return newObject;
};

export const sumArray = (arr: any[]) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null; // Handle empty or invalid input
  }

  const firstObject = arr[0]; // Get the structure of the first object
  const properties = Object.keys(firstObject);

  const sumObject: any = {};

  // Initialize sumObject with zeros for properties in the first object
  properties.forEach((prop) => {
    sumObject[prop] = 0;
  });

  // Iterate through the array and sum up the properties, adding new ones if needed
  arr.forEach((obj) => {
    Object.keys(obj).forEach((prop) => {
      if (prop in sumObject) {
        sumObject[prop] += +obj[prop];
      } else {
        // New property encountered, initialize it to 0 and add the value
        sumObject[prop] = 0;
        sumObject[prop] += +obj[prop];
      }
    });
  });

  return sumObject;
};

export const getRecord = (games: GameData[], teamId: number): { wins: number; losses: number; ties: number } => {
  return games.reduce(
    (acc, curr) => {
      if (curr.team_one_id === teamId) {
        if (curr.team_one_points > curr.team_two_points) {
          acc.wins++;
        } else if (curr.team_one_points < curr.team_two_points) {
          acc.losses++;
        } else {
          acc.ties++;
        }
        return acc;
      } else {
        if (curr.team_two_points > curr.team_one_points) {
          acc.wins++;
        } else if (curr.team_two_points < curr.team_one_points) {
          acc.losses++;
        } else {
          acc.ties++;
        }
        return acc;
      }
    },
    { wins: 0, losses: 0, ties: 0 }
  );
};

export const getTopTeamRank = (tier: string): number => {
  return tier === 'Professional' ? 6.0 : 10.0;
};
