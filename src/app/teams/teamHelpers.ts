import { GameData } from '../games/gameData';
import { TeamData } from './teamData';

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
  switch (tier) {
    case 'Rookie':
      return 10.0;
    case 'Sophomore':
      return 8.0;
    case 'Professional':
      return 8.0;
    case 'Veteran':
      return 10.0;
    default:
      return 10.0;
  }
};

export const getTopTeams = (currentTeam: TeamData, data: TeamData[]): TeamData[] => {
  let topTeams: TeamData[] = [];
  if (currentTeam.tier === 'Professional') {
    topTeams = [...data].filter(
      (x) =>
        ((x.tier === currentTeam.tier && x.tier_rank <= getTopTeamRank(currentTeam.tier)) ||
          (x.tier === 'Veteran' && (x.global_rank <= currentTeam.global_rank || x.global_rank <= 12.0))) &&
        x.team_id !== currentTeam.team_id
    );
  } else {
    topTeams = [...data].filter((x) => x.tier === currentTeam.tier && x.tier_rank <= getTopTeamRank(currentTeam.tier) && x.team_id !== currentTeam.team_id);
  }
  return topTeams;
};

export const getNotTopTeams = (currentTeam: TeamData, data: TeamData[]): TeamData[] => {
  let notTopTeams: TeamData[] = [];
  if (currentTeam.tier === 'Veteran') {
    notTopTeams = [...data].filter(
      (x) => ((x.tier === currentTeam.tier && x.tier_rank > getTopTeamRank(currentTeam.tier)) || x.tier === 'Professional') && x.team_id !== currentTeam.team_id
    );
  } else {
    notTopTeams = [...data].filter((x) => x.tier === currentTeam.tier && x.tier_rank > getTopTeamRank(currentTeam.tier) && x.team_id !== currentTeam.team_id);
  }
  return notTopTeams;
};
