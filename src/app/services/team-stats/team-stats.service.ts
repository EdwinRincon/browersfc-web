import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  TeamStatsResponse,
  CreateTeamStatsRequest,
  UpdateTeamStatsRequest,
  PaginatedResponse,
  PaginationParams,
  ApiSuccessResponse,
} from '../../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TeamStatsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/team-stats`;

  /**
   * Get paginated list of team stats
   */
  getTeamStats(params: PaginationParams): Observable<PaginatedResponse<TeamStatsResponse>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    if (params.order) {
      httpParams = httpParams.set('order', params.order);
    }

    return this.http
      .get<ApiSuccessResponse<PaginatedResponse<TeamStatsResponse>>>(this.baseUrl, { params: httpParams })
      .pipe(map(res => res.data));
  }

  /**
   * Get team stats by ID
   */
  getTeamStatsById(id: number): Observable<TeamStatsResponse> {
    return this.http.get<TeamStatsResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new team stats
   */
  createTeamStats(data: CreateTeamStatsRequest): Observable<TeamStatsResponse> {
    return this.http.post<TeamStatsResponse>(this.baseUrl, data);
  }

  /**
   * Update team stats
   */
  updateTeamStats(id: number, data: UpdateTeamStatsRequest): Observable<TeamStatsResponse> {
    return this.http.put<TeamStatsResponse>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete team stats
   */
  deleteTeamStats(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get team stats by season
   */
  getTeamStatsBySeason(seasonId: number): Observable<TeamStatsResponse[]> {
    return this.http.get<TeamStatsResponse[]>(`${this.baseUrl}/season/${seasonId}`);
  }

  /**
   * Get team stats by team
   */
  getTeamStatsByTeam(teamId: number): Observable<TeamStatsResponse[]> {
    return this.http.get<TeamStatsResponse[]>(`${this.baseUrl}/team/${teamId}`);
  }
}
