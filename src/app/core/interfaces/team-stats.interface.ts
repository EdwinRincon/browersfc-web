/**
 * Team Stats related interfaces
 */
import { TeamShort } from './team.interface';
import { SeasonShort } from './season.interface';

/**
 * Simplified team stats interface
 */
export interface TeamStatsShort {
  id: number;
  team: TeamShort;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  rank: number;
}

/**
 * Complete team stats response from backend
 */
export interface TeamStatsResponse {
  id: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  points: number;
  rank: number;
  season_id: number;
  team_id: number;
  created_at: string;
  updated_at: string;
  
  // Related entities
  team: TeamShort;
  season: SeasonShort;
}

/**
 * Team stats creation request (for admin operations)
 */
export interface CreateTeamStatsRequest {
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  points: number;
  rank: number;
  season_id: number;
  team_id: number;
}

/**
 * Team stats update request (for admin operations)
 */
export interface UpdateTeamStatsRequest {
  wins?: number;
  draws?: number;
  losses?: number;
  goals_for?: number;
  goals_against?: number;
  points?: number;
  rank?: number;
  season_id?: number;
  team_id?: number;
}