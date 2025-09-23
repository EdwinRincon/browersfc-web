/**
 * Match related interfaces
 */
import { TeamShort } from './team.interface';
import { SeasonShort } from './season.interface';
import { PlayerShort } from './player.interface';

/**
 * Match status types
 */
export type MatchStatus = 'scheduled' | 'in_progress' | 'finished' | 'postponed' | 'cancelled';

/**
 * Simplified match interface
 */
export interface MatchShort {
  id: number;
  status: MatchStatus;
  kickoff: string;
  location: string;
  home_goals: number;
  away_goals: number;
}

/**
 * Complete match response from backend
 */
export interface MatchResponse {
  id: number;
  status: MatchStatus;
  kickoff: string;
  location: string;
  home_goals: number;
  away_goals: number;
  home_team_id: number;
  away_team_id: number;
  season_id: number;
  mvp_player_id?: number;
  created_at: string;
  updated_at: string;
  home_team?: TeamShort;
  away_team?: TeamShort;
  season?: SeasonShort;
  mvp_player?: PlayerShort;
}

/**
 * Match creation request (for admin operations)
 */
export interface CreateMatchRequest {
  status: MatchStatus;
  kickoff: string;
  location: string;
  home_team_id: number;
  away_team_id: number;
  season_id: number;
  home_goals?: number;
  away_goals?: number;
  mvp_player_id?: number;
}

/**
 * Match update request (for admin operations)
 */
export interface UpdateMatchRequest {
  status?: MatchStatus;
  kickoff?: string;
  location?: string;
  home_goals?: number;
  away_goals?: number;
  home_team_id?: number;
  away_team_id?: number;
  season_id?: number;
  mvp_player_id?: number;
}