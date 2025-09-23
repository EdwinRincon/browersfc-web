import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  TeamResponse,
  CreateTeamRequest,
  UpdateTeamRequest,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/teams`;
  private readonly adminBaseUrl = `${environment.API_URL}/admin/teams`;

  /**
   * Get paginated teams with sorting and filtering
   */
  getTeams(params: PaginationParams): Observable<PaginatedResponse<TeamResponse>> {
    const queryParams = {
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sort: params.sort || 'full_name',
      order: params.order || 'asc'
    };

    return this.http.get<ApiSuccessResponse<PaginatedResponse<TeamResponse>>>(
      this.baseUrl,
      { params: queryParams }
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get a specific team by ID
   */
  getTeamById(id: number): Observable<TeamResponse> {
    return this.http.get<ApiSuccessResponse<TeamResponse>>(
      `${this.baseUrl}/${id}`
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create a new team (admin only)
   */
  createTeam(teamData: CreateTeamRequest): Observable<TeamResponse> {
    return this.http.post<ApiSuccessResponse<TeamResponse>>(
      this.adminBaseUrl,
      teamData
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update an existing team (admin only)
   */
  updateTeam(id: number, teamData: UpdateTeamRequest): Observable<TeamResponse> {
    return this.http.put<ApiSuccessResponse<TeamResponse>>(
      `${this.adminBaseUrl}/${id}`,
      teamData
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Delete a team (admin only)
   */
  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }


  getAllTeams(): Observable<TeamResponse[]> {
    return this.getTeams({ page: 0, pageSize: 100, sort: 'full_name', order: 'asc' }).pipe(
      map(response => response.items)
    );
  }
}
