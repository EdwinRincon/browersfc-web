/**
 * Common API response interfaces
 * Used across all backend API responses to ensure consistency
 */

/**
 * Standard API success response wrapper
 */
export interface ApiSuccessResponse<T> {
  code: number;
  data: T;
  detail?: string;
}

/**
 * Paginated response interface for list endpoints
 */
export interface PaginatedResponse<T> {
  items: T[];
  total_count: number;
}

/**
 * Common pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Error response interface
 */
export interface ApiErrorResponse {
  code: number;
  message: string;
  detail?: string;
}