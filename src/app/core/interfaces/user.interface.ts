/**
 * User and Authentication related interfaces
 */

/**
 * User role interface
 */
export interface UserRole {
  id: number;
  name: string;
}

/**
 * Complete user response from backend
 */
export interface UserResponse {
  id: string;
  username: string;
  name: string;
  last_name: string;
  role: UserRole;
  img_profile?: string;
  img_banner?: string;
  birthdate?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Simplified user interface for basic display
 */
export interface UserShort {
  id: string;
  username: string;
}

/**
 * Google OAuth2 authentication URL response
 */
export interface GoogleAuthUrlResponse {
  url: string;
}

/**
 * User creation request (for admin operations)
 */
export interface CreateUserRequest {
  username: string;
  name: string;
  last_name: string;
  role_id: number;
}

/**
 * User update request (for admin operations)
 */
export interface UpdateUserRequest {
  username?: string;
  name?: string;
  last_name?: string;
  role_id?: number;
  img_profile?: string;
  img_banner?: string;
  birthdate?: string;
}