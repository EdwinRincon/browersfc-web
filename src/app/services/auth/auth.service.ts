import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserResponse, GoogleAuthUrlResponse, ApiSuccessResponse } from '../../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.API_URL;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Reactive state signals
  private readonly userSignal = signal<UserResponse | null>(null);
  private readonly authenticatedSignal = signal<boolean>(false);

  // Exposed state
  readonly isAuthenticated = computed(() => this.authenticatedSignal());
  readonly isAdmin = computed(() => this.userSignal()?.role?.name === 'admin');
  readonly currentUser = computed(() => this.userSignal());

  constructor() {

  }

  /**
   * Initialize authentication state - should be called after app bootstrap
   */
  public init(): void {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    this.checkAuthStatus().subscribe({
      next: () => {},
      error: () => {
        // No-op: unauthenticated is valid
      }
    });
  }

  /**
   * Fetch Google OAuth URL from backend
   */
  getGoogleAuthUrl(): Observable<GoogleAuthUrlResponse> {
    if (!this.baseUrl) {
      return throwError(() => new Error('API URL is not configured'));
    }

    return this.http.get<ApiSuccessResponse<GoogleAuthUrlResponse>>(`${this.baseUrl}/users/auth/google`).pipe(
      timeout(10000), // 10 second timeout
      map((res) => res.data),
      catchError(this.handleError)
    );
  }

  /**
   * Start login with Google
   */
  loginWithGoogle(): Observable<void> {
    return this.getGoogleAuthUrl().pipe(
      tap(({ url }) => {
        if (!url) {
          throw new Error('Google OAuth URL is undefined');
        }
        window.location.href = url;
      }),
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  /**
   * Check authentication status (calls backend /users/me)
   */
  checkAuthStatus(): Observable<UserResponse> {
    if (!this.baseUrl) {
      this.setUnauthenticated();
      return throwError(() => new Error('API URL is not configured'));
    }

    return this.http.get<ApiSuccessResponse<UserResponse>>(`${this.baseUrl}/users/me`).pipe(
      map((response) => response.data),
      tap((user) => this.setAuthenticated(user)),
      catchError((error) => {
        this.setUnauthenticated();
        return this.handleError(error);
      })
    );
  }

  /**
   * Logout and clear state
   */
  logout(): void {
    this.setUnauthenticated();

    // Expire cookies for token and OAuth state
    ['token', 'oauth_state'].forEach(
      (cookie) => (document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`)
    );

    this.router.navigate(['/home']);
  }

  // --- State management ---

  private setAuthenticated(user: UserResponse): void {
    this.userSignal.set(user);
    this.authenticatedSignal.set(true);
  }

  private setUnauthenticated(): void {
    this.userSignal.set(null);
    this.authenticatedSignal.set(false);
  }

  // --- Centralized error handling ---

  private handleError(error: any): Observable<never> {
    let message = 'An unexpected error occurred';
    let errorType = 'unknown';

    if (error.name === 'TimeoutError') {
      message = 'Timeout: The request took too long to complete';
      errorType = 'timeout';
    } else if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      message = `Network error: ${error.error.message}`;
      errorType = 'network';
    } else if (error.status === 0) {
      // Backend is down or unreachable
      message = 'Unable to connect to server. Please check your internet connection.';
      errorType = 'network';
    } else if (error.status) {
      // Backend returned an error response
      const statusText = error.statusText || 'Unknown error';
      const serverMessage = error.error?.message || '';
      message = `Server error: ${error.status} - ${statusText} ${serverMessage}`.trim();
      errorType = error.status >= 500 ? 'server' : 'client';
    } else if (error.message) {
      message = error.message;
    }

    console.error('[AuthService Error]', message, error);
    return throwError(() => ({ 
      message, 
      originalError: error,
      errorType 
    }));
  }
}
