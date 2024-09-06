export const getBlockingGmRating = (x: any): number => {
  const gm = Math.round(10.0 * +x.pancakes - 10.0 * +x.reverse_pancaked - 0.5 * +x.hurries_allowed - +x.sacks_allowed);
  return gm > 0 ? gm : 0;
};

export const getDefensiveGmRating = (x: any): number => {
  const gm = Math.round(
    1.0 * +x.tackles +
      1.0 * +x.tackles_for_loss -
      1.5 * +x.missed_tackles +
      4.0 * +x.sacks +
      0.25 * +x.hurries +
      5.0 * +x.interceptions +
      3.0 * +x.forced_fumbles +
      1.0 * +x.fumble_recoveries +
      1.0 * +x.passes_defended +
      1.0 * +x.passes_knocked_loose +
      0.25 * +x.interception_yards
  );
  return gm > 0 ? gm : 0;
};

export const getPassingGmRating = (x: any): number => {
  const gm = Math.round(
    +(+x.yards / +x.games_played) +
      10.0 * +(+x.touchdowns / +x.games_played) -
      5.0 * +(+x.interceptions / +x.games_played) +
      (+x.rush_yards > 0 ? +(+x.rush_yards / +x.games_played) : 0.0) +
      (+x.rush_touchdowns > 0 ? 10.0 * +(+x.rush_touchdowns / +x.games_played) : 0.0)
  );
  return gm > 0 ? gm : 0;
};

export const getReceivingGmRating = (x: any): number => {
  const gm = Math.round(2.0 * +(+x.yards / +x.games_played) + 10.0 * +(+x.touchdowns / +x.games_played) - +x.drops - +x.fumbles_lost);
  return gm > 0 ? gm : 0;
};

export const getRushingGmRating = (x: any): number => {
  const gm = Math.round(
    +(+x.yards / +x.games_played) +
      10.0 * +(+x.touchdowns / +x.games_played) +
      100.0 * +x.average -
      +x.fumbles_lost +
      (+x.rec_yards > 0 ? +(+x.rec_yards / +x.games_played) : 0.0) +
      (+x.rec_touchdowns > 0 ? 10.0 * +(+x.rec_touchdowns / +x.games_played) : 0.0)
  );
  return gm > 0 ? gm : 0;
};

export const getReceivingDropsPerReception = (x: any): number => {
  return +(+x.drops / +x.receptions).toFixed(2);
};

export const GAMES_PLAYED = 2.0;
