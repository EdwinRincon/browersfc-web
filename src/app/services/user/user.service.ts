import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserResponse, ApiSuccessResponse, PaginatedResponse, PaginationParams } from '../../core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_URL;

  getUsers(params: PaginationParams): Observable<PaginatedResponse<UserResponse>> {
    // Convert PaginationParams to query params
    const queryParams: Record<string, string> = {
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sort: params.sort || 'created_at',
      order: params.order || 'desc',
    };
    return this.http
      .get<ApiSuccessResponse<PaginatedResponse<UserResponse>>>(`${this.baseUrl}/users`, { params: queryParams })
      .pipe(map(res => res.data));
  }

  getUserById(id: string): Observable<ApiSuccessResponse<UserResponse>> {
    return this.http.get<ApiSuccessResponse<UserResponse>>(`${this.baseUrl}/users/${id}`);
  }

  createUser(user: Partial<UserResponse>): Observable<ApiSuccessResponse<UserResponse>> {
    return this.http.post<ApiSuccessResponse<UserResponse>>(`${this.baseUrl}/users`, user);
  }

  updateUser(id: string, user: Partial<UserResponse>): Observable<ApiSuccessResponse<UserResponse>> {
    return this.http.put<ApiSuccessResponse<UserResponse>>(`${this.baseUrl}/users/${id}`, user);
  }

  deleteUser(id: string): Observable<ApiSuccessResponse<null>> {
    return this.http.delete<ApiSuccessResponse<null>>(`${this.baseUrl}/users/${id}`);
  }
}
