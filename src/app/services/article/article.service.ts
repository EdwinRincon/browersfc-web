import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError, map, of } from 'rxjs';
import { Article } from './article.interface';
import { CacheService } from '../cache/cache.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'  // Change to root to maintain singleton instance
})
export class ArticleService {
  private readonly baseUrl = `${environment.apiUrl}/api/articles`;
  private readonly CACHE_KEY = 'articles_cache';
  private _isCached = false;

  constructor(
    private readonly http: HttpClient,
    private readonly cacheService: CacheService
  ) {}

  // Signals for state management
  private readonly articlesSignal = signal<Article[]>([]);
  private readonly selectedArticleSignal = signal<Article | null>(null);

  // Getters for the signals
  get articles() {
    return this.articlesSignal.asReadonly();
  }

  get selectedArticle() {
    return this.selectedArticleSignal.asReadonly();
  }

  // getter for isCached
  get isCached(): boolean {
    return this._isCached;
  }

  getAllArticles(page: number = 1, pageSize: number = 10): Observable<Article[]> {
    const cacheKey = `${this.CACHE_KEY}_${page}_${pageSize}`;
    const cachedData = this.cacheService.get<Article[]>(cacheKey);

    if (cachedData) {
      this._isCached = true;


      // Check if needs background refresh
      const entry = this.cacheService.getEntry<Article[]>(cacheKey);
      if (entry && (entry.expiresAt - Date.now()) < 60_000) { // 1 minute left
        this.createRequestObservable(cacheKey, page, pageSize).subscribe();
      }

      this.setArticles(cachedData);
      return of(cachedData);
    }

    return this.createRequestObservable(cacheKey, page, pageSize);
  }

  private createRequestObservable(cacheKey: string, page: number, pageSize: number): Observable<Article[]> {
    this._isCached = false;
    

    return this.http.get<{data: Article[]}>(this.baseUrl, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(
      map(response => response.data),
      tap(articles => {
        
        this.cacheService.set(cacheKey, articles);
        this.setArticles(articles);
      }),
      catchError(this.handleError)
    );
  }

  // Update the invalidateCache method
  invalidateCache(clearAll: boolean = false): void {
    if (clearAll) {
      console.log('Clearing all cache');
      this.cacheService.clear();
    } else {
      console.log('Clearing only article cache');
      Object.keys(localStorage)
        .filter(key => key.includes(this.CACHE_KEY))
        .forEach(key => {
          console.log(`Removing cache for: ${key}`);
          this.cacheService.delete(key);
        });
    }
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Observable<Article> {
    return this.http.post<Article>(this.baseUrl, article)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateArticle(id: number, article: Partial<Article>): Observable<Article> {
    return this.http.put<Article>(`${this.baseUrl}/${id}`, article)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update signals methods
  setArticles(articles: Article[]) {
    this.articlesSignal.set(articles);
  }

  setSelectedArticle(article: Article | null) {
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

  refreshArticles(clearAll: boolean = false): Observable<Article[]> {
    this.invalidateCache(clearAll);
    return this.getAllArticles();
  }
}