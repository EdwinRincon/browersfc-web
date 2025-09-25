
import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TeamStatsResponse,
  CreateTeamStatsRequest,
  UpdateTeamStatsRequest,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';


@Injectable({
  providedIn: 'root'
})
export class TeamStatsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/team-stats`;
  private readonly adminBaseUrl = `${environment.API_URL}/admin/team-stats`;

  /**
   * Get paginated list of team stats (public endpoint)
   */
  getTeamStats(params: PaginationParams): Observable<PaginatedResponse<TeamStatsResponse>> {
    const queryParams = {
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sort: params.sort || 'rank',
      order: params.order || 'asc'
    };
    return this.http.get<PaginatedResponse<TeamStatsResponse>>(
      this.baseUrl, { params: queryParams }
    );
  }

  /**
   * Get a specific team stats by ID (public endpoint)
   */
  getTeamStatsById(id: number): Observable<TeamStatsResponse> {
    return this.http.get<TeamStatsResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new team stats (admin only)
   */
  createTeamStats(data: CreateTeamStatsRequest): Observable<TeamStatsResponse> {
    return this.http.post<TeamStatsResponse>(this.adminBaseUrl, data);
  }

  /**
   * Update team stats (admin only)
   */
  updateTeamStats(id: number, data: UpdateTeamStatsRequest): Observable<TeamStatsResponse> {
    return this.http.put<TeamStatsResponse>(`${this.adminBaseUrl}/${id}`, data);
  }

  /**
   * Delete team stats (admin only)
   */
  deleteTeamStats(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

  /**
   * Get team stats by season (public endpoint)
   */
  getTeamStatsBySeason(seasonId: number): Observable<TeamStatsResponse[]> {
    return this.http.get<TeamStatsResponse[]>(`${this.baseUrl}/season/${seasonId}`);
  }

  /**
   * Get team stats by team (public endpoint)
   */
  getTeamStatsByTeam(teamId: number): Observable<TeamStatsResponse[]> {
    return this.http.get<TeamStatsResponse[]>(`${this.baseUrl}/team/${teamId}`);
  }

  /**
   * Signal-based resource for paginated team stats
   */
  getTeamStatsResource(paginationParams: Signal<PaginationParams>) {
    return httpResource<{ data: PaginatedResponse<TeamStatsResponse> }>(() => ({
      url: this.baseUrl,
      method: 'GET',
      params: {
        page: paginationParams().page.toString(),
        pageSize: paginationParams().pageSize.toString(),
        sort: paginationParams().sort ?? 'rank',
        order: paginationParams().order ?? 'asc'
      }
    }));
  }

  /**
   * Classic resource for all team stats
   */
  readonly teamStatsResource = httpResource<{ data: PaginatedResponse<TeamStatsResponse> }>(() => ({
    url: this.baseUrl,
    params: { page: '0', pageSize: '15', sort: 'rank', order: 'asc' }
  }));
}
