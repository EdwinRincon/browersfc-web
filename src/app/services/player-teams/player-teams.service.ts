
import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PlayerTeamResponse,
  CreatePlayerTeamRequest,
  UpdatePlayerTeamRequest,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';


@Injectable({
  providedIn: 'root'
})
export class PlayerTeamsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/player-teams`;
  private readonly adminBaseUrl = `${environment.API_URL}/admin/player-teams`;

  // --- Public Endpoints ---
  getPlayerTeams(params: PaginationParams): Observable<PaginatedResponse<PlayerTeamResponse>> {
    return this.http.get<PaginatedResponse<PlayerTeamResponse>>(this.baseUrl, {
      params: {
        page: params.page.toString(),
        pageSize: params.pageSize.toString(),
        sort: params.sort || 'id',
        order: params.order || 'desc'
      }
    });
  }

  getPlayerTeamById(id: number): Observable<PlayerTeamResponse> {
    return this.http.get<PlayerTeamResponse>(`${this.baseUrl}/${id}`);
  }

  getPlayerTeamsResource(paginationParams: Signal<PaginationParams>) {
    return httpResource<{ data: PaginatedResponse<PlayerTeamResponse> }>(() => ({
      url: this.baseUrl,
      method: 'GET',
      params: {
        page: paginationParams().page.toString(),
        pageSize: paginationParams().pageSize.toString(),
        sort: paginationParams().sort ?? 'id',
        order: paginationParams().order ?? 'desc'
      }
    }));
  }

  // --- Admin Endpoints ---
  createPlayerTeam(data: CreatePlayerTeamRequest): Observable<PlayerTeamResponse> {
    return this.http.post<PlayerTeamResponse>(this.adminBaseUrl, data);
  }

  updatePlayerTeam(id: number, data: UpdatePlayerTeamRequest): Observable<PlayerTeamResponse> {
    return this.http.put<PlayerTeamResponse>(`${this.adminBaseUrl}/${id}`, data);
  }

  deletePlayerTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

  getPlayerTeamsByPlayerId(playerId: number): Observable<PlayerTeamResponse[]> {
    return this.http.get<PlayerTeamResponse[]>(`${this.baseUrl}/player/${playerId}`);
  }

  getPlayerTeamsByTeamId(teamId: number): Observable<PlayerTeamResponse[]> {
    return this.http.get<PlayerTeamResponse[]>(`${this.baseUrl}/team/${teamId}`);
  }

  getPlayerTeamsBySeasonId(seasonId: number): Observable<PlayerTeamResponse[]> {
    return this.http.get<PlayerTeamResponse[]>(`${this.baseUrl}/season/${seasonId}`);
  }
}