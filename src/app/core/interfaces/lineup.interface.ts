/**
 * Lineup related interfaces
 */
import { PlayerShort, PlayerPosition } from './player.interface';
import { MatchShort } from './match.interface';

/**
 * Simplified lineup interface for displaying match lineups
 */
export interface LineupShort {
  id: number;
  position: PlayerPosition;
  starting: boolean;
  player: PlayerShort;
}

/**
 * Complete lineup response from backend
 */
export interface LineupResponse {
  id: number;
  position: PlayerPosition;
  player_id: number;
  match_id: number;
  starting: boolean;
  created_at: string;
  updated_at: string;
  
  // Related entities
  player: PlayerShort;
  match: MatchShort;
}

/**
 * Lineup creation request (for admin operations)
 */
export interface CreateLineupRequest {
  position: PlayerPosition;
  player_id: number;
  match_id: number;
  starting: boolean;
}

/**
 * Lineup update request (for admin operations)
 */
export interface UpdateLineupRequest {
  position?: PlayerPosition;
  player_id?: number;
  match_id?: number;
  starting?: boolean;
}