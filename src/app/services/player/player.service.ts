import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  PlayerResponse, 
  CreatePlayerRequest, 
  UpdatePlayerRequest,
  ApiSuccessResponse,
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

  getPlayers(pagination?: PaginationParams): Observable<ApiSuccessResponse<PaginatedResponse<PlayerResponse>>> {
    let params: Record<string, string> = {};
    if (pagination) {
      params = {
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        sort: pagination.sort || 'id',
        order: pagination.order || 'asc'
      };
    }
    return this.http.get<ApiSuccessResponse<PaginatedResponse<PlayerResponse>>>(this.apiUrl, { params });
  }

  getPlayer(id: number): Observable<ApiSuccessResponse<PlayerResponse>> {
    return this.http.get<ApiSuccessResponse<PlayerResponse>>(`${this.apiUrl}/${id}`);
  }

  createPlayer(player: CreatePlayerRequest): Observable<ApiSuccessResponse<PlayerResponse>> {
    return this.http.post<ApiSuccessResponse<PlayerResponse>>(this.apiUrl, player);
  }

  updatePlayer(id: number, player: UpdatePlayerRequest): Observable<ApiSuccessResponse<PlayerResponse>> {
    return this.http.put<ApiSuccessResponse<PlayerResponse>>(`${this.apiUrl}/${id}`, player);
  }

  deletePlayer(id: number): Observable<ApiSuccessResponse<void>> {
    return this.http.delete<ApiSuccessResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getAllPlayers(): Observable<ApiSuccessResponse<PlayerResponse[]>> {
    return this.http.get<ApiSuccessResponse<PlayerResponse[]>>(`${this.apiUrl}/all`);
  }
}