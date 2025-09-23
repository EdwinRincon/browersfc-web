/**
 * Player Team related interfaces
 */
import { PlayerShort } from './player.interface';
import { TeamShort } from './team.interface';
import { SeasonShort } from './season.interface';

/**
 * Complete player team response from backend
 */
export interface PlayerTeamResponse {
  id: number;
  player_id: number;
  team_id: number;
  season_id: number;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  player?: PlayerShort;
  team?: TeamShort;
  season?: SeasonShort;
}

/**
 * Player team creation request (for admin operations)
 */
export interface CreatePlayerTeamRequest {
  player_id: number;
  team_id: number;
  season_id: number;
  start_date: string;
  end_date?: string;
}

/**
 * Player team update request (for admin operations)
 */
export interface UpdatePlayerTeamRequest {
  start_date?: string;
  end_date?: string;
}