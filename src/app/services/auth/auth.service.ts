import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
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
      map((res) => res.data),
      catchError(this.handleError)
    );
  }

  /**
   * Start login with Google
   */
  loginWithGoogle(): void {
    this.getGoogleAuthUrl().subscribe({
      next: ({ url }) => {
        if (!url) {
          this.handleError(new Error('Google OAuth URL is missing'));
          return;
        }
        window.location.href = url;
      },
      error: (err) => this.handleError(err)
    });
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

    if (error.error instanceof ErrorEvent) {
      message = `Client error: ${error.error.message}`;
    } else if (error.status) {
      message = `Server error: ${error.status} - ${error.statusText || ''} ${error.error?.message || ''}`;
    } else if (error.message) {
      message = error.message;
    }

    console.error('[AuthService Error]', message, error);
    return throwError(() => ({ message, originalError: error }));
  }
}
