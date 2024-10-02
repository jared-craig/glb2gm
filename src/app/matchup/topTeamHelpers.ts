export const extractTeamData = (originalObject: any, keyword: string) => {
  const newObject: any = {};
  for (const property in originalObject) {
    if (property !== 'team_one_id' && property !== 'team_two_id' && (property.includes('team_one_') || property.includes('team_two_'))) {
      if (keyword === 'team_one_') {
        newObject[property.replace('team_one_', 'offensive_')] = originalObject[property];
        newObject[property.replace('team_two_', 'defensive_')] = originalObject[property];
      }
      if (keyword === 'team_two_') {
        newObject[property.replace('team_one_', 'defensive')] = originalObject[property];
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
