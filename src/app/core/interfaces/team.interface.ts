/**
 * Team related interfaces
 */
import { MatchShort } from './match.interface';

/**
 * Simplified team interface
 */
export interface TeamShort {
  id: number;
  full_name: string;
  short_name: string;
}

/**
 * Complete team response from backend
 */
export interface TeamResponse {
  id: number;
  full_name: string;
  short_name: string;
  color: string;
  color2: string;
  shield: string;
  next_match_id?: number;
  next_match?: MatchShort;
  created_at: string;
  updated_at: string;
}

/**
 * Team creation request (for admin operations)
 */
export interface CreateTeamRequest {
  full_name: string;
  short_name: string;
  color: string;
  color2: string;
  shield: string;
  next_match_id?: number;
}

/**
 * Team update request (for admin operations)
 */
export interface UpdateTeamRequest {
  full_name?: string;
  short_name?: string;
  color?: string;
  color2?: string;
  shield?: string;
  next_match_id?: number;
}