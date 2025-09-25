import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiErrorResponse } from '../interfaces';

/**
 * Intercepts all HTTP responses to unwrap { code, data, detail? } and handle errors globally.
 * Ensures services/components only deal with the actual data or a consistent error shape.
 */
@Injectable()
export class ApiResponseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse && event.body && 'data' in event.body) {
          // Unwrap the data property for success responses
          return event.clone({ body: event.body.data });
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let apiError: ApiErrorResponse;
        if (
          error.error &&
          typeof error.error === 'object' &&
          'code' in error.error &&
          'message' in error.error
        ) {
          apiError = {
            code: error.error.code,
            message: error.error.message,
            detail: error.error.detail,
            field: error.error.field,
            validation: error.error.validation
          };
        } else {
          apiError = {
            code: error.status,
            message: error.message,
            detail: error.statusText,
            field: undefined,
            validation: undefined
          };
        }
        return throwError(() => apiError);
      })
    );
  }
}
