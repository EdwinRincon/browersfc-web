import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // First check if we already have auth state
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // If not authenticated, try to check auth status via backend
    return this.authService.checkAuthStatus().pipe(
      map(() => {
        // Successfully authenticated
        return true;
      }),
      catchError(() => {
        // Not authenticated
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return of(false);
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // First check if we already have auth state
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }

    if (this.authService.isAuthenticated() && !this.authService.isAdmin()) {
      // User is authenticated but not admin
      this.router.navigate(['/home']);
      return false;
    }

    // If not authenticated, try to check auth status via backend
    return this.authService.checkAuthStatus().pipe(
      map(() => {
        // Successfully authenticated, now check if admin
        if (this.authService.isAdmin()) {
          return true;
        } else {
          // User is authenticated but not admin
          this.router.navigate(['/home']);
          return false;
        }
      }),
      catchError(() => {
        // Not authenticated
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return of(false);
      })
    );
  }
}