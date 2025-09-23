/**
 * Player Stats related interfaces
 */
import { PlayerShort, PlayerPosition } from './player.interface';
import { MatchShort } from './match.interface';
import { SeasonShort } from './season.interface';
import { TeamShort } from './team.interface';

/**
 * Simplified player stats interface
 */
export interface PlayerStatsShort {
  id: number;
  player: PlayerShort;
  goals: number;
  assists: number;
  rating: number;
  is_mvp: boolean;
}

/**
 * Complete player stats response from backend
 */
export interface PlayerStatsResponse {
  id: number;
  player_id: number;
  match_id: number;
  season_id: number;
  team_id?: number;
  goals: number;
  assists: number;
  saves: number;
  yellow_cards: number;
  red_cards: number;
  rating: number;
  is_starting: boolean;
  minutes_played: number;
  is_mvp: boolean;
  position: PlayerPosition;
  created_at: string;
  updated_at: string;
  player?: PlayerShort;
  match?: MatchShort;
  season?: SeasonShort;
  team?: TeamShort;
}

/**
 * Player stats creation request (for admin operations)
 */
export interface CreatePlayerStatsRequest {
  player_id: number;
  match_id: number;
  season_id: number;
  team_id?: number;
  goals: number;
  assists: number;
  saves: number;
  yellow_cards: number;
  red_cards: number;
  rating: number;
  is_starting: boolean;
  minutes_played: number;
  is_mvp: boolean;
  position: PlayerPosition;
}

/**
 * Player stats update request (for admin operations)
 */
export interface UpdatePlayerStatsRequest {
  player_id?: number;
  match_id?: number;
  season_id?: number;
  team_id?: number;
  goals?: number;
  assists?: number;
  saves?: number;
  yellow_cards?: number;
  red_cards?: number;
  rating?: number;
  is_starting?: boolean;
  minutes_played?: number;
  is_mvp?: boolean;
  position?: PlayerPosition;
}