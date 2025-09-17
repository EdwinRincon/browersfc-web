import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError, map } from 'rxjs';
import { 
  ArticleResponse, 
  ArticleShort,
  CreateArticleRequest, 
  UpdateArticleRequest
} from '../../core/interfaces/article.interface';
import { 
  ApiSuccessResponse, 
  PaginatedResponse 
} from '../../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly baseUrl = `${environment.API_URL}`;
  private readonly http = inject(HttpClient);

  // Signals for state management - using ArticleResponse for consistency
  private readonly articlesSignal = signal<ArticleResponse[]>([]);
  private readonly selectedArticleSignal = signal<ArticleResponse | null>(null);

  // Getters for the signals
  get articles() {
    return this.articlesSignal.asReadonly();
  }

  get selectedArticle() {
    return this.selectedArticleSignal.asReadonly();
  }

  /**
   * Get all articles with pagination (0-based as per backend API)
   * @param page - 0-based page number
   * @param pageSize - number of items per page
   * @param sort - optional sort field
   * @param order - optional sort order (asc/desc)
   */
  getAllArticles(page: number = 0, pageSize: number = 0, sort?: string, order?: 'asc' | 'desc'): Observable<ArticleResponse[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (sort) {
      params = params.set('sort', sort);
    }
    if (order) {
      params = params.set('order', order);
    }

    const finalUrl = `${this.baseUrl}/articles`;

    return this.http.get<ApiSuccessResponse<PaginatedResponse<ArticleResponse>>>(finalUrl, { params }).pipe(
      map(response => {
        const articles = response.data.items;
        this.setArticles(articles);
        return articles;
      }),
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  getArticleById(id: number): Observable<ArticleResponse> {
    return this.http.get<ApiSuccessResponse<ArticleResponse>>(`${this.baseUrl}/articles/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // Admin methods for future use
  createArticle(article: CreateArticleRequest): Observable<ArticleShort> {
    return this.http.post<ApiSuccessResponse<ArticleShort>>(`${this.baseUrl}/admin/articles`, article)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateArticle(id: number, article: UpdateArticleRequest): Observable<ArticleShort> {
    return this.http.put<ApiSuccessResponse<ArticleShort>>(`${this.baseUrl}/admin/articles/${id}`, article)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/articles/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update signals methods
  setArticles(articles: ArticleResponse[]) {
    this.articlesSignal.set(articles);
  }

  setSelectedArticle(article: ArticleResponse | null) {
    this.selectedArticleSignal.set(article);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}