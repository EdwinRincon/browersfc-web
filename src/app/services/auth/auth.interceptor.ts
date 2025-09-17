import { inject, Injector } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const injector = inject(Injector);
  
  // No need to add Authorization header since we're using cookies
  // The browser automatically sends cookies with requests
  const authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json'
    },
    withCredentials: true // Ensure cookies are sent with requests
  });

  // Handle the request and catch authentication errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Use lazy injection to avoid circular dependency
        const authService = injector.get(AuthService);
        // Token is invalid or expired, logout and redirect to login
        authService.logout();
      }
      return throwError(() => error);
    })
  );
}