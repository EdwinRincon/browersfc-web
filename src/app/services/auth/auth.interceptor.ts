import { inject, Injector } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Determines if a request URL represents a protected API endpoint that requires authentication
 * @param url The request URL
 * @returns true if the endpoint requires authentication and should trigger logout on 401/403
 */
function isProtectedEndpoint(url: string): boolean {
  const protectedPatterns = [
    '/admin/',             // All admin endpoints
    '/auth/logout',        // Logout endpoint
    // Add more protected patterns as needed
  ];

  // Only logout if the request URL contains one of the protected patterns
  return protectedPatterns.some(pattern => url.includes(pattern));
}

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
      // Only trigger logout for protected endpoints that return 401/403
      if ((error.status === 401 || error.status === 403) && isProtectedEndpoint(req.url)) {
        // Use lazy injection to avoid circular dependency
        const authService = injector.get(AuthService);
        // Token is invalid or expired, logout and redirect to login
        authService.logout();
      }
      
      // For all other cases (including 401/403 on public endpoints), 
      // just propagate the error to be handled by the calling component/service
      return throwError(() => error);
    })
  );
}