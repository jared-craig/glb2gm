export const extractTeamData = (originalObject: any, keyword: string) => {
  const newObject: any = {};
  for (const property in originalObject) {
    if (property !== 'team_one_id' && property !== 'team_two_id' && property.includes(keyword)) {
      newObject[property.substring(keyword.length)] = originalObject[property];
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
  // Initialize sumObject with zeros
  properties.forEach((prop) => {
    sumObject[prop] = 0;
  });
  // Iterate through the array and sum up the properties
  arr.forEach((obj) => {
    properties.forEach((prop) => (sumObject[prop] += +obj[prop]));
  });
  return sumObject;
};
