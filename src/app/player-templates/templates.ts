export interface Template {
  position: string;
  templateName: string;
  height: number;
  weight: number;
  strength: number;
  speed: number;
  agility: number;
  stamina: number;
  awareness: number;
  confidence: number;
  trait1: string;
  trait2: string;
  trait3: string;
  skills: { [key: string]: number };
}

export const getTemplates = (position: string): Template[] => {
  const templates: Template[] = [
    // HB
    {
      position: 'HB',
      templateName: 'Cerberus',
      height: 76,
      weight: 260,
      strength: 10,
      speed: 1,
      agility: 10,
      stamina: 10,
      awareness: 3,
      confidence: 1,
      trait1: 'superstar_glam',
      trait2: 'hb_rushing_back',
      trait3: 'unpredictable',
      skills: {
        carry_grip: 60.0,
        carry_power: 100.0,
        carry_elusiveness: 80.0,
        carry_awareness: 80.0,
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
        balance: 80.0,
        footwork: 50.0,
        quickness: 40.0,
        sprinting: 40.0,
        vertical: 0.0,
        diving: 0.0,
        conditioning: 100.0,
        toughness: 60.0,
        snap_reaction: 0.0,
        heart: 30.0,
        intimidation: 40.0,
      },
    },
    {
      position: 'HB',
      templateName: 'Slombo',
      height: 66,
      weight: 188,
      strength: 10,
      speed: 1,
      agility: 10,
      stamina: 10,
      awareness: 3,
      confidence: 1,
      trait1: 'superstar_glam',
      trait2: 'hb_rushing_back',
      trait3: 'unpredictable',
      skills: {
        carry_grip: 80.0,
        carry_power: 95.0,
        carry_elusiveness: 80.0,
        carry_awareness: 80.0,
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
        balance: 80.0,
        footwork: 75.0,
        quickness: 40.0,
        sprinting: 40.0,
        vertical: 0.0,
        diving: 0.0,
        conditioning: 96.0,
        toughness: 40.0,
        snap_reaction: 0.0,
        heart: 30.0,
        intimidation: 0.0,
      },
    },
  ];

  return templates.filter((x) => x.position === position);
};