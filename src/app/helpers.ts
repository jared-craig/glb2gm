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
