import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  LineupResponse, 
  CreateLineupRequest, 
  UpdateLineupRequest,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LineupService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.API_URL}/lineups`;
  private readonly adminApiUrl = `${environment.API_URL}/admin/lineups`;

  getLineups(pagination?: PaginationParams): Observable<ApiSuccessResponse<PaginatedResponse<LineupResponse>>> {
    let url = this.apiUrl;
    const params: Record<string, string> = {};
    if (pagination) {
      params['page'] = pagination.page.toString();
      params['pageSize'] = pagination.pageSize.toString();
      if (pagination.sort) {
        params['sort'] = pagination.sort;
      }
      if (pagination.order) {
        params['order'] = pagination.order;
      }
    }
    return this.http.get<ApiSuccessResponse<PaginatedResponse<LineupResponse>>>(url, { params });
  }

  getLineup(id: number): Observable<ApiSuccessResponse<LineupResponse>> {
    return this.http.get<ApiSuccessResponse<LineupResponse>>(`${this.apiUrl}/${id}`);
  }


  createLineup(lineup: CreateLineupRequest): Observable<ApiSuccessResponse<LineupResponse>> {
    return this.http.post<ApiSuccessResponse<LineupResponse>>(this.adminApiUrl, lineup);
  }


  updateLineup(id: number, lineup: UpdateLineupRequest): Observable<ApiSuccessResponse<LineupResponse>> {
    return this.http.put<ApiSuccessResponse<LineupResponse>>(`${this.adminApiUrl}/${id}`, lineup);
  }


  deleteLineup(id: number): Observable<ApiSuccessResponse<void>> {
    return this.http.delete<ApiSuccessResponse<void>>(`${this.adminApiUrl}/${id}`);
  }

  getAllLineups(): Observable<ApiSuccessResponse<LineupResponse[]>> {
    return this.http.get<ApiSuccessResponse<LineupResponse[]>>(`${this.apiUrl}/all`);
  }
}