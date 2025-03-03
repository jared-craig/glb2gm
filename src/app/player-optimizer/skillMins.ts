export const getSkillMins = (position: string) => {
  const positionFactors: { [pos: string]: { [key: string]: number } } = {
    QB: {
      pass_technique: 0.0,
      pass_accuracy: 0.0,
      pass_power: 0.0,
      pass_consistency: 0.0,
      pass_grip: 0.0,
      pass_evasiveness: 0.0,
      pass_carry_power: 0.0,
      pass_awareness: 0.0,
      carry_grip: 0.0,
      carry_power: 0.0,
      carry_elusiveness: 0.0,
      carry_awareness: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      heart: 0.0,
      intimidation: 0.0,
      leadership: 0.0,
    },
    HB: {
      carry_grip: 0.0,
      carry_power: 0.0,
      carry_elusiveness: 0.0,
      carry_awareness: 0.0,
      return_awareness: 0.0,
      route_technique: 0.0,
      route_elusiveness: 0.0,
      catch_hands: 0.0,
      catch_in_traffic: 0.0,
      catch_grip: 0.0,
      catch_awareness: 0.0,
      catch_consistency: 0.0,
      pass_block_technique: 0.0,
      pass_block_power: 0.0,
      pass_block_awareness: 0.0,
      run_block_technique: 0.0,
      run_block_power: 0.0,
      run_block_awareness: 0.0,
      lead_block_awareness: 0.0,
      block_consistency: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      vertical: 0.0,
      diving: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    FB: {
      pass_block_technique: 0.0,
      pass_block_power: 0.0,
      pass_block_awareness: 0.0,
      run_block_technique: 0.0,
      run_block_power: 0.0,
      run_block_awareness: 0.0,
      lead_block_awareness: 0.0,
      block_consistency: 0.0,
      route_technique: 0.0,
      route_elusiveness: 0.0,
      catch_hands: 0.0,
      catch_in_traffic: 0.0,
      catch_grip: 0.0,
      catch_awareness: 0.0,
      catch_consistency: 0.0,
      carry_grip: 0.0,
      carry_power: 0.0,
      carry_elusiveness: 0.0,
      carry_awareness: 0.0,
      return_awareness: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      vertical: 0.0,
      diving: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    TE: {
      route_technique: 0.0,
      route_elusiveness: 0.0,
      catch_hands: 0.0,
      catch_in_traffic: 0.0,
      catch_grip: 0.0,
      catch_awareness: 0.0,
      catch_consistency: 0.0,
      pass_block_technique: 0.0,
      pass_block_power: 0.0,
      pass_block_awareness: 0.0,
      run_block_technique: 0.0,
      run_block_power: 0.0,
      run_block_awareness: 0.0,
      lead_block_awareness: 0.0,
      block_consistency: 0.0,
      carry_grip: 0.0,
      carry_power: 0.0,
      carry_elusiveness: 0.0,
      carry_awareness: 0.0,
      return_awareness: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      vertical: 0.0,
      diving: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    WR: {
      route_technique: 0.0,
      route_elusiveness: 0.0,
      catch_hands: 0.0,
      catch_in_traffic: 0.0,
      catch_grip: 0.0,
      catch_awareness: 0.0,
      catch_consistency: 0.0,
      carry_grip: 0.0,
      carry_power: 0.0,
      carry_elusiveness: 0.0,
      carry_awareness: 0.0,
      return_awareness: 0.0,
      run_block_technique: 0.0,
      run_block_power: 0.0,
      run_block_awareness: 0.0,
      block_consistency: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      vertical: 0.0,
      diving: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    DT: {
      pass_rush_technique: 0.0,
      pass_rush_power: 0.0,
      pass_rush_deflection: 0.0,
      break_run_block: 0.0,
      blitz_awareness: 0.0,
      hold_ground: 0.0,
      tackle_awareness: 0.0,
      defense_consistency: 0.0,
      tackle_technique: 0.0,
      tackle_power: 0.0,
      tackle_strip: 0.0,
      tackle_grip: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      vertical: 0.0,
      diving: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    DE: {
      pass_rush_technique: 0.0,
      pass_rush_power: 0.0,
      pass_rush_deflection: 0.0,
      break_run_block: 0.0,
      blitz_awareness: 0.0,
      hold_ground: 0.0,
      tackle_awareness: 0.0,
      defense_consistency: 0.0,
      zone_coverage_awareness: 0.0,
      coverage_deflection: 0.0,
      coverage_interception: 0.0,
      tackle_technique: 0.0,
      tackle_power: 0.0,
      tackle_strip: 0.0,
      tackle_grip: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      vertical: 0.0,
      diving: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    LB: {
      tackle_technique: 0.0,
      tackle_power: 0.0,
      tackle_strip: 0.0,
      tackle_grip: 0.0,
      break_run_block: 0.0,
      blitz_awareness: 0.0,
      hold_ground: 0.0,
      tackle_awareness: 0.0,
      defense_consistency: 0.0,
      man_coverage_awareness: 0.0,
      zone_coverage_awareness: 0.0,
      coverage_technique: 0.0,
      coverage_deflection: 0.0,
      coverage_interception: 0.0,
      pass_rush_technique: 0.0,
      pass_rush_power: 0.0,
      pass_rush_deflection: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      vertical: 0.0,
      diving: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    CB: {
      man_coverage_awareness: 0.0,
      zone_coverage_awareness: 0.0,
      coverage_technique: 0.0,
      coverage_deflection: 0.0,
      coverage_interception: 0.0,
      tackle_technique: 0.0,
      tackle_power: 0.0,
      tackle_strip: 0.0,
      tackle_grip: 0.0,
      break_run_block: 0.0,
      blitz_awareness: 0.0,
      hold_ground: 0.0,
      tackle_awareness: 0.0,
      defense_consistency: 0.0,
      pass_rush_technique: 0.0,
      pass_rush_power: 0.0,
      pass_rush_deflection: 0.0,
      carry_grip: 0.0,
      carry_power: 0.0,
      carry_elusiveness: 0.0,
      return_awareness: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      vertical: 0.0,
      diving: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    SS: {
      man_coverage_awareness: 0.0,
      zone_coverage_awareness: 0.0,
      coverage_technique: 0.0,
      coverage_deflection: 0.0,
      coverage_interception: 0.0,
      tackle_technique: 0.0,
      tackle_power: 0.0,
      tackle_strip: 0.0,
      tackle_grip: 0.0,
      break_run_block: 0.0,
      blitz_awareness: 0.0,
      hold_ground: 0.0,
      tackle_awareness: 0.0,
      defense_consistency: 0.0,
      pass_rush_technique: 0.0,
      pass_rush_power: 0.0,
      pass_rush_deflection: 0.0,
      return_awareness: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      vertical: 0.0,
      diving: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    FS: {
      man_coverage_awareness: 0.0,
      zone_coverage_awareness: 0.0,
      coverage_technique: 0.0,
      coverage_deflection: 0.0,
      coverage_interception: 0.0,
      tackle_technique: 0.0,
      tackle_power: 0.0,
      tackle_strip: 0.0,
      tackle_grip: 0.0,
      break_run_block: 0.0,
      blitz_awareness: 0.0,
      hold_ground: 0.0,
      tackle_awareness: 0.0,
      defense_consistency: 0.0,
      pass_rush_technique: 0.0,
      pass_rush_power: 0.0,
      pass_rush_deflection: 0.0,
      return_awareness: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      vertical: 0.0,
      diving: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    C: {
      pass_block_technique: 0.0,
      pass_block_power: 0.0,
      pass_block_awareness: 0.0,
      run_block_technique: 0.0,
      run_block_power: 0.0,
      run_block_awareness: 0.0,
      block_consistency: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    G: {
      pass_block_technique: 0.0,
      pass_block_power: 0.0,
      pass_block_awareness: 0.0,
      run_block_technique: 0.0,
      run_block_power: 0.0,
      run_block_awareness: 0.0,
      lead_block_awareness: 0.0,
      block_consistency: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    OT: {
      pass_block_technique: 0.0,
      pass_block_power: 0.0,
      pass_block_awareness: 0.0,
      run_block_technique: 0.0,
      run_block_power: 0.0,
      run_block_awareness: 0.0,
      lead_block_awareness: 0.0,
      block_consistency: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    K: {
      kick_accuracy: 0.0,
      kick_power: 0.0,
      kick_consistency: 0.0,
      kickoff_power: 0.0,
      tackle_technique: 0.0,
      tackle_power: 0.0,
      tackle_strip: 0.0,
      tackle_grip: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      vertical: 0.0,
      diving: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
    P: {
      punt_hands: 0.0,
      punt_accuracy: 0.0,
      punt_power: 0.0,
      punt_consistency: 0.0,
      tackle_technique: 0.0,
      tackle_power: 0.0,
      tackle_strip: 0.0,
      tackle_grip: 0.0,
      balance: 0.0,
      footwork: 0.0,
      quickness: 0.0,
      sprinting: 0.0,
      vertical: 0.0,
      diving: 0.0,
      conditioning: 0.0,
      toughness: 0.0,
      snap_reaction: 0.0,
      heart: 0.0,
      intimidation: 0.0,
    },
  };
  return positionFactors[position];
};
