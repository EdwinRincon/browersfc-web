import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

type AuthErrorType =
  | 'auth_failed'
  | 'invalid_callback'
  | 'config_error'
  | 'oauth_url_error'
  | 'unknown';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule],
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

    try {
      this.authService.loginWithGoogle();
    } catch (error) {
      console.error('Failed to start Google authentication:', error);

      const errorMessage =
        error instanceof Error ? error.message : (error as any)?.message ?? '';

      if (errorMessage.includes('API URL is not configured')) {
        this.setErrorMessage('config_error');
      } else if (errorMessage.includes('Google OAuth URL is undefined')) {
        this.setErrorMessage('oauth_url_error');
      } else {
        this.setErrorMessage('auth_failed');
      }

      this.isLoading.set(false);
    }
  }

  private setErrorMessage(errorType: AuthErrorType): void {
    this.errorMessage.set(LoginComponent.ERROR_MESSAGES[errorType] ?? LoginComponent.ERROR_MESSAGES.unknown);
  }
}
