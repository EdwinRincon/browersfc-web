import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LineupResponse,
  CreateLineupRequest,
  UpdateLineupRequest,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LineupService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/lineups`;
  private readonly adminBaseUrl = `${environment.API_URL}/admin/lineups`;

  /**
   * Get paginated lineups (public)
   */
  getLineups(params: PaginationParams): Observable<PaginatedResponse<LineupResponse>> {
    const queryParams = {
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sort: params.sort || 'created_at',
      order: params.order || 'desc'
    };
    return this.http.get<PaginatedResponse<LineupResponse>>(
      this.baseUrl, { params: queryParams }
    );
  }

  /**
   * Get a specific lineup by ID (public)
   */
  getLineupById(id: number): Observable<LineupResponse> {
    return this.http.get<LineupResponse>(`${this.baseUrl}/${id}`);
  }


  /**
   * Create a new lineup (admin only)
   */
  createLineup(lineup: CreateLineupRequest): Observable<LineupResponse> {
    return this.http.post<LineupResponse>(this.adminBaseUrl, lineup);
  }


  /**
   * Update an existing lineup (admin only)
   */
  updateLineup(id: number, lineup: UpdateLineupRequest): Observable<LineupResponse> {
    return this.http.put<LineupResponse>(`${this.adminBaseUrl}/${id}`, lineup);
  }


  /**
   * Delete a lineup (admin only)
   */
  deleteLineup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

  /**
   * Get all lineups (public, non-paginated)
   */
  getAllLineups(): Observable<LineupResponse[]> {
    return this.http.get<LineupResponse[]>(`${this.baseUrl}/all`);
  }

  /**
   * Signal-powered resource for paginated lineups
   * Use .value()?.data.items to access lineups
   */
  readonly lineupsResource = httpResource<{ data: PaginatedResponse<LineupResponse> }>(() => ({
    url: this.baseUrl,
    params: { page: '0', pageSize: '10', sort: 'created_at', order: 'desc' }
  }));

  /**
   * Factory for signal-powered paginated lineups resource
   */
  getLineupsResource(paginationParams: Signal<PaginationParams>) {
    return httpResource<{ data: PaginatedResponse<LineupResponse> }>(() => ({
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