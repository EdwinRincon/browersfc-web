/**
 * Season related interfaces
 */

/**
 * Simplified season interface
 */
export interface SeasonShort {
  id: number;
  year: number;
}

/**
 * Complete season response from backend
 */
export interface SeasonResponse {
  id: number;
  year: number;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Season creation request (for admin operations)
 */
export interface CreateSeasonRequest {
  year: number;
  start_date: string;
  end_date: string;
  is_current?: boolean;
}

/**
 * Season update request (for admin operations)
 */
export interface UpdateSeasonRequest {
  year?: number;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
}