/**
 * Role related interfaces
 */

/**
 * Role name constants
 */
export type RoleName = 'admin' | 'player' | 'coach';

/**
 * Simplified role interface
 */
export interface RoleShort {
  id: number;
  name: string;
  description: string;
}