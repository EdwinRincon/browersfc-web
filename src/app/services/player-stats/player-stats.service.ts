import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  PlayerStatsResponse, 
  CreatePlayerStatsRequest, 
  UpdatePlayerStatsRequest,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerStatsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/player-stats`;

  getPlayerStats(pagination?: PaginationParams): Observable<ApiSuccessResponse<PaginatedResponse<PlayerStatsResponse>>> {
    const params: Record<string, string> = {};
    if (pagination) {
      params['page'] = pagination.page.toString();
      params['pageSize'] = pagination.pageSize.toString();
      if (pagination.sort) params['sort'] = pagination.sort;
      if (pagination.order) params['order'] = pagination.order;
    }
    return this.http.get<ApiSuccessResponse<PaginatedResponse<PlayerStatsResponse>>>(this.apiUrl, { params });
  }

  getPlayerStat(id: number): Observable<ApiSuccessResponse<PlayerStatsResponse>> {
    return this.http.get<ApiSuccessResponse<PlayerStatsResponse>>(`${this.apiUrl}/${id}`);
  }

  createPlayerStats(stats: CreatePlayerStatsRequest): Observable<ApiSuccessResponse<PlayerStatsResponse>> {
    return this.http.post<ApiSuccessResponse<PlayerStatsResponse>>(this.apiUrl, stats);
  }

  updatePlayerStats(id: number, stats: UpdatePlayerStatsRequest): Observable<ApiSuccessResponse<PlayerStatsResponse>> {
    return this.http.put<ApiSuccessResponse<PlayerStatsResponse>>(`${this.apiUrl}/${id}`, stats);
  }

  deletePlayerStats(id: number): Observable<ApiSuccessResponse<void>> {
    return this.http.delete<ApiSuccessResponse<void>>(`${this.apiUrl}/${id}`);
  }
}