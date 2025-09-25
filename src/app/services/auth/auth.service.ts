import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserResponse, GoogleAuthUrlResponse, ApiSuccessResponse } from '../../core/interfaces';

export interface AppError {
  message: string;
  errorType: 'timeout' | 'network' | 'server' | 'client' | 'unknown';
  originalError: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.API_URL;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly userSignal = signal<UserResponse | null>(null);
  private readonly authenticatedSignal = signal<boolean>(false);

  readonly isAuthenticated = computed(() => this.authenticatedSignal());
  readonly isAdmin = computed(() => this.userSignal()?.role?.name === 'admin');
  readonly currentUser = computed(() => this.userSignal());

  public init(): void {
    this.checkAuthStatus().subscribe({
      error: () => {
        // No-op: unauthenticated is valid
      }
    });
  }

  getGoogleAuthUrl(): Observable<GoogleAuthUrlResponse> {
    if (!this.baseUrl) {
      return throwError(() => ({ message: 'API URL is not configured', errorType: 'client', originalError: null } as AppError));
    }

    return this.http.get<ApiSuccessResponse<GoogleAuthUrlResponse>>(`${this.baseUrl}/users/auth/google`).pipe(
      map(res => res.data),
      catchError(err => this.handleError(err))
    );
  }

  loginWithGoogle(): Observable<void> {
    return this.getGoogleAuthUrl().pipe(
      tap(({ url }) => {
        if (!url) {
          throw new Error('Google OAuth URL is undefined');
        }
        window.location.href = url;
      }),
      map(() => void 0),
      catchError(err => this.handleError(err))
    );
  }

  checkAuthStatus(): Observable<UserResponse> {
    if (!this.baseUrl) {
      this.setUnauthenticated();
      return throwError(() => ({ message: 'API URL is not configured', errorType: 'client', originalError: null } as AppError));
    }

    return this.http.get<ApiSuccessResponse<UserResponse>>(`${this.baseUrl}/users/me`).pipe(
      map(res => res.data),
      tap(user => this.setAuthenticated(user)),
      catchError(err => {
        this.setUnauthenticated();
        return this.handleError(err);
      })
    );
  }

  logout(): void {
    this.setUnauthenticated();

    ['token', 'oauth_state'].forEach(
      cookie => (document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`)
    );

    this.router.navigateByUrl('/home');
  }

  private setAuthenticated(user: UserResponse): void {
    this.userSignal.set(user);
    this.authenticatedSignal.set(true);
  }

  private setUnauthenticated(): void {
    this.userSignal.set(null);
    this.authenticatedSignal.set(false);
  }

  private handleError(error: unknown): Observable<never> {
    let message = 'An unexpected error occurred';
    let errorType: AppError['errorType'] = 'unknown';

    if (error instanceof Error && error.name === 'TimeoutError') {
      message = 'Timeout: The request took too long to complete';
      errorType = 'timeout';
    } else if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        message = 'Unable to connect to server. Please check your internet connection.';
        errorType = 'network';
      } else {
        const statusText = error.statusText || 'Unknown error';
        const serverMessage = error.error?.message || '';
        message = `Server error: ${error.status} - ${statusText} ${serverMessage}`.trim();
        errorType = error.status >= 500 ? 'server' : 'client';
      }
    } else if (error && typeof error === 'object' && 'message' in error) {
      // If error object has a message property
      message = (error as any).message ?? message;
      errorType = (error as any).errorType ?? errorType;
    } else if (error instanceof Error) {
      message = error.message;
    }

    const appError: AppError = { message, originalError: error, errorType };

    console.error('[AuthService Error]', message, error);

    return throwError(() => appError);
  }
}
