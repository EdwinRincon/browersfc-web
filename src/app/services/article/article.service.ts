import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ArticleResponse,
  ArticleShort,
  CreateArticleRequest,
  UpdateArticleRequest,
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
   * Get paginated articles with optional sorting
   */
  getArticles(params: PaginationParams): Observable<PaginatedResponse<ArticleResponse>> {
    const queryParams = {
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sort: params.sort || 'date',
      order: params.order || 'desc'
    };

    return this.http.get<PaginatedResponse<ArticleResponse>>(
      this.baseUrl, { params: queryParams }
    );
  }

  /**
   * Get a specific article by ID
   */
  getArticleById(id: number): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new article (admin only)
   */
  createArticle(articleData: CreateArticleRequest): Observable<ArticleShort> {
    return this.http.post<ArticleShort>(this.adminBaseUrl,articleData);
  }

  /**
   * Update an existing article (admin only)
   */
  updateArticle(id: number, articleData: UpdateArticleRequest): Observable<ArticleShort> {
    return this.http.put<ArticleShort>(`${this.adminBaseUrl}/${id}`,articleData);
  }

  /**
   * Delete an article (admin only)
   */
  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

  /**
   * Get all articles
   */
  /**
   * Use this.articlesResource.value()?.data?.items to access articles
   */
  readonly articlesResource = httpResource<{ data: PaginatedResponse<ArticleResponse> }>(() => ({
    url: this.baseUrl,
    params: { page: '0', pageSize: '6', sort: 'date', order: 'desc' }
  }));


  /**
 * Factory for signal-powered paginated articles resource
 */
  getArticlesResource(paginationParams: Signal<PaginationParams>) {
    return httpResource<{ data: PaginatedResponse<ArticleResponse> }>(() => ({
      url: this.baseUrl,
      method: 'GET',
      params: {
        page: paginationParams().page.toString(),
        pageSize: paginationParams().pageSize.toString(),
        sort: paginationParams().sort ?? 'date',
        order: paginationParams().order ?? 'desc'
      }
    }));
  }

}
