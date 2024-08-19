export const getDefensiveGmRating = (x: any): number => {
  const passDef = +x.passes_defended + +x.passes_knocked_loose - +x.receptions_allowed;
  return Math.round(
    1.0 * +x.tackles +
      1.0 * +x.tackles_for_loss +
      5.0 * +x.sacks +
      0.25 * +x.hurries +
      5.0 * +x.interceptions +
      3.0 * +x.forced_fumbles +
      2.0 * +x.fumble_recoveries +
      (passDef > 0 ? 10.0 * passDef : 0.0)
  );
};

export const getPassingGmRating = (x: any): number => {
  return Math.round(
    +(+x.yards / +x.games_played) +
      2.0 * +x.touchdowns -
      2.0 * +x.interceptions +
      10.0 * +x.yards_per_attempt -
      0.5 * +x.sacks +
      (+x.rush_yards > 0 && +x.rush_touchdowns > 0 ? +(+x.rush_yards / +x.games_played) + 2.0 * +x.rush_touchdowns : 0.0)
  );
};

export const getReceivingGmRating = (x: any): number => {
  return Math.round(2.0 * +(+x.yards / +x.games_played) + 2.0 * +x.touchdowns - +x.drops - +x.fumbles_lost);
};

export const getRushingGmRating = (x: any): number => {
  return Math.round(
    +(+x.yards / +x.games_played) +
      2.0 * +x.touchdowns +
      150.0 * +x.average -
      +x.fumbles_lost +
      (+x.rec_yards > 0 && +x.rec_touchdowns > 0 ? +(+x.rec_yards / +x.games_played) + 2.0 * +x.rec_touchdowns : 0.0)
  );
};

export const getReceivingDropsPerReception = (x: any): number => {
  return +(+x.drops / +x.receptions).toFixed(2);
};
