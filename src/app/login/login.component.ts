import { Component, ChangeDetectionStrategy, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService, AppError } from '../services/auth/auth.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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
    if (!this.authService.isAuthenticated()) return;

    if (this.authService.isAdmin()) {
      this.router.navigateByUrl('/admin');
    } else {
      this.router.navigateByUrl('/home');
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

    this.authService.loginWithGoogle()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Redirect handled by OAuth flow, no need to unset loading
        },
        error: (err: AppError) => {
          console.error('Failed to start Google authentication:', err);
          this.isLoading.set(false);
          const authError = this.mapAuthError(err);
          this.setErrorMessage(authError);
        }
      });
  }

  private setErrorMessage(errorType: AuthErrorType): void {
    this.errorMessage.set(
      LoginComponent.ERROR_MESSAGES[errorType] ?? LoginComponent.ERROR_MESSAGES.unknown
    );
  }

  private readonly mapAuthError = (error: AppError): AuthErrorType => {
    if (!error) return 'unknown';
    if (error.message?.includes('API URL is not configured')) return 'config_error';
    if (error.message?.includes('Google OAuth URL is undefined')) return 'oauth_url_error';

    switch (error.errorType) {
      case 'timeout': return 'timeout_error';
      case 'network': return 'network_error';
      case 'server': return 'server_error';
      case 'client': return 'auth_failed';
      default: return 'unknown';
    }
  };
}
