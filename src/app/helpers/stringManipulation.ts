export function separateAndCapitalize(camelCaseString: string): string {
  // Split the string on uppercase letters preceded by lowercase letters
  let words = camelCaseString.split(/(?=[A-Z][a-z])/);

  // Capitalize the first letter of each word
  return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}
