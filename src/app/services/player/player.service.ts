import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private readonly apiUrl = `${environment.API_URL}/players`;

  getPlayers(pagination?: PaginationParams): Observable<PaginatedResponse<PlayerResponse>> {
    let params: Record<string, string> = {};
    if (pagination) {
      params = {
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        sort: pagination.sort || 'id',
        order: pagination.order || 'asc'
      };
    }
    return this.http.get<PaginatedResponse<PlayerResponse>>(this.apiUrl, { params });
  }

  getPlayer(id: number): Observable<PlayerResponse> {
    return this.http.get<PlayerResponse>(`${this.apiUrl}/${id}`);
  }

  createPlayer(player: CreatePlayerRequest): Observable<PlayerResponse> {
    return this.http.post<PlayerResponse>(this.apiUrl, player);
  }

  updatePlayer(id: number, player: UpdatePlayerRequest): Observable<PlayerResponse> {
    return this.http.put<PlayerResponse>(`${this.apiUrl}/${id}`, player);
  }

  deletePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllPlayers(): Observable<PlayerResponse[]> {
    return this.http.get<PlayerResponse[]>(`${this.apiUrl}/all`);
  }
}