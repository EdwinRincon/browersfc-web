import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/users`;
  private readonly adminBaseUrl = `${environment.API_URL}/admin/users`;

  /**
   * Get paginated users with sorting and filtering
   */
  getUsers(params: PaginationParams): Observable<PaginatedResponse<UserResponse>> {
    const queryParams = {
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sort: params.sort || 'created_at',
      order: params.order || 'desc'
    };
    return this.http.get<PaginatedResponse<UserResponse>>(
      this.baseUrl, { params: queryParams }
    );
  }

  /**
   * Get a specific user by ID
   */
  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new user (admin only)
   */
  createUser(userData: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.adminBaseUrl, userData);
  }

  /**
   * Update an existing user (admin only)
   */
  updateUser(id: string, userData: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.adminBaseUrl}/${id}`, userData);
  }

  /**
   * Delete a user (admin only)
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

  /**
   * Signal-powered paginated users resource
   */
  getUsersResource(paginationParams: Signal<PaginationParams>) {
    return httpResource<{ data: PaginatedResponse<UserResponse> }>(() => ({
      url: this.baseUrl,
      method: 'GET',
      params: {
        page: paginationParams().page.toString(),
        pageSize: paginationParams().pageSize.toString(),
        sort: paginationParams().sort ?? 'created_at',
        order: paginationParams().order ?? 'desc'
      }
    }));
  }
}
