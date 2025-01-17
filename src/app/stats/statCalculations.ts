export const getBlockingGmRating = (x: any): number => {
  const gm = Math.round(
    10.0 * ((+x.pancakes / +x.plays) * 1000.0) -
      10.0 * ((+x.reverse_pancaked / +x.plays) * 1000.0) -
      0.5 * ((+x.hurries_allowed / +x.plays) * 1000.0) -
      (+x.sacks_allowed / +x.plays) * 1000.0
  );
  return gm;
};

export const getDefensiveGmRating = (x: any): number => {
  const gm = Math.round(
    1.0 * +x.tackles +
      1.0 * +x.tackles_for_loss -
      1.5 * +x.missed_tackles +
      (x.position === 'CB' || x.position === 'FS' || x.position === 'SS' ? 1.0 : 4.0) * +x.sacks +
      (x.position === 'CB' || x.position === 'FS' || x.position === 'SS' ? 0.1 : 0.25) * +x.hurries +
      5.0 * +x.interceptions +
      3.0 * +x.forced_fumbles +
      1.0 * +x.fumble_recoveries +
      2.0 * +x.passes_defended +
      2.0 * +x.passes_knocked_loose +
      0.1 * +x.interception_yards
  );
  return gm;
};

export const getKickingGmRating = (x: any): number => {
  const gm = Math.round(
    100.0 * +(+x.fg_made / +x.fg_attempts) +
      1.0 * +x.zero_to_nineteen_made -
      5.0 * (+x.zero_to_nineteen_attempts - +x.zero_to_nineteen_made) +
      2.0 * +x.twenty_to_twenty_nine_made -
      4.0 * (+x.twenty_to_twenty_nine_attempts - +x.twenty_to_twenty_nine_made) +
      3.0 * +x.thirty_to_thirty_nine_made -
      3.0 * (+x.thirty_to_thirty_nine_attempts - +x.thirty_to_thirty_nine_made) +
      4.0 * +x.forty_to_forty_nine_made -
      2.0 * (+x.forty_to_forty_nine_attempts - +x.forty_to_forty_nine_made) +
      5.0 * +x.fifty_plus_made -
      1.0 * (+x.fifty_plus_attempts - +x.fifty_plus_made) +
      10.0 * +(+x.touchbacks / +x.kickoffs)
  );
  return gm;
};

export const getPassingGmRating = (x: any): number => {
  const gm = Math.round(
    +(+x.yards / +x.games_played) +
      10.0 * +(+x.touchdowns / +x.games_played) -
      5.0 * +(+x.interceptions / +x.games_played) +
      (+x.rush_yards > 0 ? +(+x.rush_yards / +x.games_played) : 0.0) +
      (+x.rush_touchdowns > 0 ? 10.0 * +(+x.rush_touchdowns / +x.games_played) : 0.0)
  );
  return gm;
};

export const getPuntingGmRating = (x: any): number => {
  const gm = Math.round(
    10.0 * +x.average +
      100.0 * +x.hangtime +
      20.0 * +(+x.coffins / +x.punts) +
      20.0 * +(+x.inside_five / +x.punts) +
      10.0 * +(+x.inside_ten / +x.punts) +
      2.0 * +(+x.inside_twenty / +x.punts)
  );
  return gm;
};

export const getReceivingGmRating = (x: any): number => {
  const gm = Math.round(2.0 * +(+x.yards / +x.games_played) + 10.0 * +(+x.touchdowns / +x.games_played) - +x.drops - +x.fumbles_lost);
  return gm;
};

export const getReturningGmRating = (x: any): number => {
  let gm = 0.0;
  if (x.krs > 0) gm += 50.0 * +x.kr_average + 250.0 * (+x.kr_touchdowns / +x.krs);
  if (x.prs > 0) gm += 50.0 * +x.pr_average + 250.0 * (+x.pr_touchdowns / +x.prs);
  return Math.round(gm);
};

export const getRushingGmRating = (x: any): number => {
  const gm = Math.round(
    2.0 * +(+x.yards / +x.games_played) +
      10.0 * +(+x.touchdowns / +x.games_played) +
      100.0 * +x.average -
      +x.fumbles_lost +
      (+x.rec_yards > 0 ? +(+x.rec_yards / +x.games_played) : 0.0) +
      (+x.rec_touchdowns > 0 ? 10.0 * +(+x.rec_touchdowns / +x.games_played) : 0.0)
  );
  return gm;
};

export const getTeamGmRating = (x: any, bonus: number): number => {
  const gm = Math.round(25.0 * (100.0 - +x.global_rank) + bonus);
  return gm;
};

export const getReceivingDropsPerReception = (x: any): number => {
  return +(+x.drops / +x.receptions).toFixed(2);
};
