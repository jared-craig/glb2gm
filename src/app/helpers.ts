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

export const generateGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
