
import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PlayerResponse,
  CreatePlayerRequest,
  UpdatePlayerRequest,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/players`;
  private readonly adminBaseUrl = `${environment.API_URL}/admin/players`;

  /**
   * Get paginated players with sorting and filtering
   */
  getPlayers(params: PaginationParams): Observable<PaginatedResponse<PlayerResponse>> {
    const queryParams = {
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sort: params.sort || 'id',
      order: params.order || 'asc'
    };
    return this.http.get<PaginatedResponse<PlayerResponse>>(
      this.baseUrl, { params: queryParams }
    );
  }

  /**
   * Get a specific player by ID
   */
  getPlayerById(id: number): Observable<PlayerResponse> {
    return this.http.get<PlayerResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new player (admin only)
   */
  createPlayer(playerData: CreatePlayerRequest): Observable<PlayerResponse> {
    return this.http.post<PlayerResponse>(this.adminBaseUrl, playerData);
  }

  /**
   * Update an existing player (admin only)
   */
  updatePlayer(id: number, playerData: UpdatePlayerRequest): Observable<PlayerResponse> {
    return this.http.put<PlayerResponse>(`${this.adminBaseUrl}/${id}`, playerData);
  }

  /**
   * Delete a player (admin only)
   */
  deletePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

  /**
   * Get all players (non-paginated, for dropdowns etc)
   */
  getAllPlayers(): Observable<PlayerResponse[]> {
    return this.http.get<PlayerResponse[]>(`${this.baseUrl}/all`);
  }

  /**
   * Signal-powered paginated players resource
   */
  getPlayersResource(paginationParams: Signal<PaginationParams>) {
    return httpResource<{ data: PaginatedResponse<PlayerResponse> }>(() => ({
      url: this.baseUrl,
      method: 'GET',
      params: {
        page: paginationParams().page.toString(),
        pageSize: paginationParams().pageSize.toString(),
        sort: paginationParams().sort ?? 'id',
        order: paginationParams().order ?? 'asc'
      }
    }));
  }
}