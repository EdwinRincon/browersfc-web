import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  PlayerTeamResponse, 
  CreatePlayerTeamRequest, 
  UpdatePlayerTeamRequest,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationParams 
} from '../../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PlayerTeamsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/player-teams`;

  /**
   * Get paginated list of player-team relationships
   */
  getPlayerTeams(params: PaginationParams): Observable<ApiSuccessResponse<PaginatedResponse<PlayerTeamResponse>>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('pageSize', params.pageSize.toString());
    
    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    
    if (params.order) {
      httpParams = httpParams.set('order', params.order);
    }

    return this.http.get<ApiSuccessResponse<PaginatedResponse<PlayerTeamResponse>>>(this.baseUrl, { params: httpParams });
  }

  getPlayerTeamById(id: number): Observable<ApiSuccessResponse<PlayerTeamResponse>> {
    return this.http.get<ApiSuccessResponse<PlayerTeamResponse>>(`${this.baseUrl}/${id}`);
  }


  createPlayerTeam(data: CreatePlayerTeamRequest): Observable<ApiSuccessResponse<PlayerTeamResponse>> {
    return this.http.post<ApiSuccessResponse<PlayerTeamResponse>>(this.baseUrl, data);
  }

  updatePlayerTeam(id: number, data: UpdatePlayerTeamRequest): Observable<ApiSuccessResponse<PlayerTeamResponse>> {
    return this.http.put<ApiSuccessResponse<PlayerTeamResponse>>(`${this.baseUrl}/${id}`, data);
  }


  deletePlayerTeam(id: number): Observable<ApiSuccessResponse<void>> {
    return this.http.delete<ApiSuccessResponse<void>>(`${this.baseUrl}/${id}`);
  }

 
  getPlayerTeamsByPlayerId(playerId: number): Observable<ApiSuccessResponse<PlayerTeamResponse[]>> {
    return this.http.get<ApiSuccessResponse<PlayerTeamResponse[]>>(`${this.baseUrl}/player/${playerId}`);
  }


  getPlayerTeamsByTeamId(teamId: number): Observable<ApiSuccessResponse<PlayerTeamResponse[]>> {
    return this.http.get<ApiSuccessResponse<PlayerTeamResponse[]>>(`${this.baseUrl}/team/${teamId}`);
  }


  getPlayerTeamsBySeasonId(seasonId: number): Observable<ApiSuccessResponse<PlayerTeamResponse[]>> {
    return this.http.get<ApiSuccessResponse<PlayerTeamResponse[]>>(`${this.baseUrl}/season/${seasonId}`);
  }
}