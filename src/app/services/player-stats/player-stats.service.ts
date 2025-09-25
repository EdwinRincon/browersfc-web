import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PlayerStatsResponse,
  CreatePlayerStatsRequest,
  UpdatePlayerStatsRequest,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PlayerStatsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/player-stats`;
  private readonly adminBaseUrl = `${environment.API_URL}/admin/player-stats`;

  /**
   * Get paginated player stats (public)
   */
  getPlayerStats(params: PaginationParams): Observable<PaginatedResponse<PlayerStatsResponse>> {
    const queryParams = {
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sort: params.sort || 'created_at',
      order: params.order || 'desc'
    };
    return this.http.get<PaginatedResponse<PlayerStatsResponse>>(
      this.baseUrl, { params: queryParams }
    );
  }

  /**
   * Get a specific player stat by ID (public)
   */
  getPlayerStatById(id: number): Observable<PlayerStatsResponse> {
    return this.http.get<PlayerStatsResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new player stats (admin only)
   */
  createPlayerStats(stats: CreatePlayerStatsRequest): Observable<PlayerStatsResponse> {
    return this.http.post<PlayerStatsResponse>(this.adminBaseUrl, stats);
  }

  /**
   * Update player stats (admin only)
   */
  updatePlayerStats(id: number, stats: UpdatePlayerStatsRequest): Observable<PlayerStatsResponse> {
    return this.http.put<PlayerStatsResponse>(`${this.adminBaseUrl}/${id}`, stats);
  }

  /**
   * Delete player stats (admin only)
   */
  deletePlayerStats(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

  /**
   * Signal-powered resource for paginated player stats
   * Use .value()?.data.items to access player stats
   */
  readonly playerStatsResource = httpResource<{ data: PaginatedResponse<PlayerStatsResponse> }>(() => ({
    url: this.baseUrl,
    params: { page: '0', pageSize: '10', sort: 'created_at', order: 'desc' }
  }));

  /**
   * Factory for signal-powered paginated player stats resource
   */
  getPlayerStatsResource(paginationParams: Signal<PaginationParams>) {
    return httpResource<{ data: PaginatedResponse<PlayerStatsResponse> }>(() => ({
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