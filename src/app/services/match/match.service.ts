import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MatchResponse,
  CreateMatchRequest,
  UpdateMatchRequest,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/matches`;
  private readonly adminBaseUrl = `${environment.API_URL}/admin/matches`;

  // --- Public Endpoints ---
  getMatches(params: PaginationParams): Observable<PaginatedResponse<MatchResponse>> {
    return this.http.get<PaginatedResponse<MatchResponse>>(this.baseUrl, { params: {
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sort: params.sort || 'kickoff',
      order: params.order || 'desc'
    }});
  }

  getMatch(id: number): Observable<MatchResponse> {
    return this.http.get<MatchResponse>(`${this.baseUrl}/${id}`);
  }

  getMatchesResource(paginationParams: Signal<PaginationParams>) {
    return httpResource<{ data: PaginatedResponse<MatchResponse> }>(() => ({
      url: this.baseUrl,
      method: 'GET',
      params: {
        page: paginationParams().page.toString(),
        pageSize: paginationParams().pageSize.toString(),
        sort: paginationParams().sort ?? 'kickoff',
        order: paginationParams().order ?? 'desc'
      }
    }));
  }

  // --- Admin Endpoints ---
  createMatch(match: CreateMatchRequest): Observable<MatchResponse> {
    return this.http.post<MatchResponse>(this.adminBaseUrl, match);
  }

  updateMatch(id: number, match: UpdateMatchRequest): Observable<MatchResponse> {
    return this.http.put<MatchResponse>(`${this.adminBaseUrl}/${id}`, match);
  }

  deleteMatch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

  getAllMatches(): Observable<MatchResponse[]> {
    return this.http.get<MatchResponse[]>(`${this.baseUrl}/all`);
  }
}