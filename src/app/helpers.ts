export const getRankColor = (rankString: string, maxRank: number, sort: string) => {
  if (rankString === 'N/A') return 'inherit';
  const rankStringNum = rankString.match(/\d+/);
  if (!rankStringNum) return 'inherit';
  const rank = +rankStringNum[0];
  const normalizedRank = (maxRank - rank) / (maxRank - 1);

  const red = Math.round(sort === 'asc' ? 255 * (1 - normalizedRank) : 255 * normalizedRank);
  const green = Math.round(sort === 'asc' ? 255 * normalizedRank : 255 * (1 - normalizedRank));
  const blue = 0;

  return `rgb(${red}, ${green}, ${blue})`;
};

export const formatWithOrdinal = (number: number): string => {
  const ordinals = ['th', 'st', 'nd', 'rd'];
  const lastTwoDigits = number % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return number + 'th';
  const lastDigit = number % 10;
  const ordinalSuffix = ordinals[lastDigit] || 'th';
  return number + ordinalSuffix;
};
