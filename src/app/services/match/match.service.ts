import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  MatchResponse, 
  CreateMatchRequest, 
  UpdateMatchRequest,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/matches`;

  getMatches(pagination?: PaginationParams): Observable<ApiSuccessResponse<PaginatedResponse<MatchResponse>>> {
    let url = this.apiUrl;
    if (pagination) {
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      if (pagination.sort) {
        params.append('sort', pagination.sort);
      }
      if (pagination.order) {
        params.append('order', pagination.order);
      }
      url += `?${params.toString()}`;
    }
    return this.http.get<ApiSuccessResponse<PaginatedResponse<MatchResponse>>>(url);
  }

  getMatch(id: number): Observable<ApiSuccessResponse<MatchResponse>> {
    return this.http.get<ApiSuccessResponse<MatchResponse>>(`${this.apiUrl}/${id}`);
  }

  createMatch(match: CreateMatchRequest): Observable<ApiSuccessResponse<MatchResponse>> {
    return this.http.post<ApiSuccessResponse<MatchResponse>>(this.apiUrl, match);
  }

  updateMatch(id: number, match: UpdateMatchRequest): Observable<ApiSuccessResponse<MatchResponse>> {
    return this.http.put<ApiSuccessResponse<MatchResponse>>(`${this.apiUrl}/${id}`, match);
  }

  deleteMatch(id: number): Observable<ApiSuccessResponse<void>> {
    return this.http.delete<ApiSuccessResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getAllMatches(): Observable<ApiSuccessResponse<MatchResponse[]>> {
    return this.http.get<ApiSuccessResponse<MatchResponse[]>>(`${this.apiUrl}/all`);
  }
}