/**
 * Article related interfaces
 */
import { SeasonShort } from './season.interface';

/**
 * Complete article response from backend
 */
export interface ArticleResponse {
  id: number;
  title: string;
  content: string;
  date: string;
  img_banner?: string;
  season: SeasonShort;
  created_at: string;
  updated_at: string;
}

/**
 * Simplified article interface
 */
export interface ArticleShort {
  id: number;
  title: string;
  date: string;
  season: SeasonShort;
}

/**
 * Article creation request (for admin operations)
 */
export interface CreateArticleRequest {
  title: string;
  content: string;
  date: string;
  season_id: number;
  img_banner?: string;
}

/**
 * Article update request (for admin operations)
 */
export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  date?: string;
  season_id?: number;
  img_banner?: string;
}