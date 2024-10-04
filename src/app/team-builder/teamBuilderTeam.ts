import { TeamBuilderPlayer } from './teamBuilderPlayer';

export interface TeamBuilderTeam {
  id: string;
  user_email: string;
  team_name: string;
  players: TeamBuilderPlayer[];
}
