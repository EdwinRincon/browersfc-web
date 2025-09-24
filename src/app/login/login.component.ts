import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

type AuthErrorType =
  | 'auth_failed'
  | 'invalid_callback'
  | 'config_error'
  | 'oauth_url_error'
  | 'network_error'
  | 'server_error'
  | 'timeout_error'
  | 'unknown';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  private static readonly ERROR_MESSAGES: Record<AuthErrorType, string> = {
    auth_failed: 'Error en la autenticación. Por favor, inténtalo de nuevo.',
    invalid_callback: 'Respuesta de autenticación inválida.',
    config_error: 'Error de configuración: API URL no configurada. Contacta al administrador.',
    oauth_url_error: 'Error: URL de autenticación de Google no disponible. Contacta al administrador.',
    network_error: 'No se puede conectar al servidor. Verifica tu conexión a internet o inténtalo más tarde.',
    server_error: 'Error del servidor. Por favor, inténtalo más tarde.',
    timeout_error: 'La solicitud tardó demasiado tiempo. Verifica tu conexión e inténtalo de nuevo.',
    unknown: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
  };

  ngOnInit(): void {
    this.checkAuthRedirect();
    this.checkRouteError();
  }

  private checkAuthRedirect(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  private checkRouteError(): void {
    const error = this.route.snapshot.queryParams['error'] as AuthErrorType | undefined;
    if (error) {
      this.setErrorMessage(error);
    }
  }

  protected loginWithGoogle(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.loginWithGoogle().subscribe({
      next: () => {
        // Success - user will be redirected to Google OAuth, so we don't need to reset loading here
      },
      error: (error) => {
        console.error('Failed to start Google authentication:', error);
        this.isLoading.set(false);
        
        // Handle different types of errors
        if (error.message?.includes('API URL is not configured')) {
          this.setErrorMessage('config_error');
        } else if (error.message?.includes('Google OAuth URL is undefined')) {
          this.setErrorMessage('oauth_url_error');
        } else if (error.errorType === 'timeout' || error.message?.includes('Timeout')) {
          this.setErrorMessage('timeout_error');
        } else if (error.errorType === 'network' || error.originalError?.status === 0) {
          this.setErrorMessage('network_error');
        } else if (error.errorType === 'server' || error.originalError?.status >= 500) {
          this.setErrorMessage('server_error');
        } else {
          this.setErrorMessage('auth_failed');
        }
      }
    });
  }

  private setErrorMessage(errorType: AuthErrorType): void {
    this.errorMessage.set(LoginComponent.ERROR_MESSAGES[errorType] ?? LoginComponent.ERROR_MESSAGES.unknown);
  }
}
