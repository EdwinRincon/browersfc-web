/**
 * Player related interfaces
 */

/**
 * Player positions enum
 */
export type PlayerPosition = 'por' | 'ceni' | 'cend' | 'lati' | 'latd' | 'med' | 'del' | 'deli' | 'deld';

/**
 * Player foot preference
 */
export type PlayerFoot = 'L' | 'R';

/**
 * Simplified player interface
 */
export interface PlayerShort {
  id: number;
  nick_name: string;
  squad_number: number;
  position: PlayerPosition;
  rating: number;
}

/**
 * Complete player response from backend
 */
export interface PlayerResponse {
  id: number;
  nick_name: string;
  height: number;
  country: string;
  country2: string;
  foot: PlayerFoot;
  age: number;
  squad_number: number;
  rating: number;
  matches: number;
  y_cards: number;
  r_cards: number;
  goals: number;
  assists: number;
  saves: number;
  position: PlayerPosition;
  injured: boolean;
  career_summary: string;
  mvp_count: number;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Player creation request (for admin operations)
 */
export interface CreatePlayerRequest {
  nick_name: string;
  height: number;
  country: string;
  country2: string;
  foot: PlayerFoot;
  age: number;
  squad_number: number;
  rating: number;
  position: PlayerPosition;
  injured?: boolean;
  career_summary?: string;
  user_id?: string;
}

/**
 * Player update request (for admin operations)
 */
export interface UpdatePlayerRequest {
  nick_name?: string;
  height?: number;
  country?: string;
  country2?: string;
  foot?: PlayerFoot;
  age?: number;
  squad_number?: number;
  rating?: number;
  matches?: number;
  y_cards?: number;
  r_cards?: number;
  goals?: number;
  assists?: number;
  saves?: number;
  position?: PlayerPosition;
  injured?: boolean;
  career_summary?: string;
  mvp_count?: number;
  user_id?: string;
}