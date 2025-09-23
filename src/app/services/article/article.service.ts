import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  ArticleResponse,
  ArticleShort,
  CreateArticleRequest,
  UpdateArticleRequest,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/articles`;
  private readonly adminBaseUrl = `${environment.API_URL}/admin/articles`;

  /**
   * Get paginated articles with sorting and filtering
   */
  getArticles(params: PaginationParams): Observable<PaginatedResponse<ArticleResponse>> {
    const queryParams = {
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sort: params.sort || 'date',
      order: params.order || 'desc'
    };

    return this.http.get<ApiSuccessResponse<PaginatedResponse<ArticleResponse>>>(
      this.baseUrl,
      { params: queryParams }
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get a specific article by ID
   */
  getArticleById(id: number): Observable<ArticleResponse> {
    return this.http.get<ApiSuccessResponse<ArticleResponse>>(
      `${this.baseUrl}/${id}`
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create a new article (admin only)
   */
  createArticle(articleData: CreateArticleRequest): Observable<ArticleShort> {
    return this.http.post<ApiSuccessResponse<ArticleShort>>(
      this.adminBaseUrl,
      articleData
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update an existing article (admin only)
   */
  updateArticle(id: number, articleData: UpdateArticleRequest): Observable<ArticleShort> {
    return this.http.put<ApiSuccessResponse<ArticleShort>>(
      `${this.adminBaseUrl}/${id}`,
      articleData
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Delete an article (admin only)
   */
  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

  /**
   * Get all articles for dropdown/select purposes
   */
  getAllArticles(): Observable<ArticleResponse[]> {
    return this.getArticles({ page: 0, pageSize: 6, sort: 'date', order: 'desc' }).pipe(
      map(response => response.items)
    );
  }
}