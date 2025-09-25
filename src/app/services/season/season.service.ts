
import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SeasonResponse,
  CreateSeasonRequest,
  UpdateSeasonRequest,
  PaginatedResponse,
  PaginationParams
} from '../../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/seasons`;
  private readonly adminBaseUrl = `${environment.API_URL}/admin/seasons`;

  /**
   * Get paginated seasons with sorting and filtering
   */
  getSeasons(params: PaginationParams): Observable<PaginatedResponse<SeasonResponse>> {
    const queryParams = {
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      sort: params.sort || 'year',
      order: params.order || 'desc'
    };
    return this.http.get<PaginatedResponse<SeasonResponse>>(
      this.baseUrl, { params: queryParams }
    );
  }

  /**
   * Get a specific season by ID
   */
  getSeasonById(id: number): Observable<SeasonResponse> {
    return this.http.get<SeasonResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get the current active season
   */
  getCurrentSeason(): Observable<SeasonResponse> {
    return this.http.get<SeasonResponse>(`${this.baseUrl}/current`);
  }

  /**
   * Create a new season (admin only)
   */
  createSeason(seasonData: CreateSeasonRequest): Observable<SeasonResponse> {
    return this.http.post<SeasonResponse>(this.adminBaseUrl, seasonData);
  }

  /**
   * Update an existing season (admin only)
   */
  updateSeason(id: number, seasonData: UpdateSeasonRequest): Observable<SeasonResponse> {
    return this.http.put<SeasonResponse>(`${this.adminBaseUrl}/${id}`, seasonData);
  }

  /**
   * Set a season as the current active season (admin only)
   */
  setCurrentSeason(id: number): Observable<{ message: string; id: number }> {
    return this.http.put<{ message: string; id: number }>(
      `${this.adminBaseUrl}/${id}/set-current`,
      {}
    );
  }

  /**
   * Delete a season (admin only)
   */
  deleteSeason(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

  /**
   * Get all seasons (non-paginated, for dropdowns etc)
   */
  getAllSeasons(): Observable<SeasonResponse[]> {
    return this.http.get<SeasonResponse[]>(`${this.baseUrl}/all`);
  }

  /**
   * Signal-powered paginated seasons resource
   */
  getSeasonsResource(paginationParams: Signal<PaginationParams>) {
    return httpResource<{ data: PaginatedResponse<SeasonResponse> }>(() => ({
      url: this.baseUrl,
      method: 'GET',
      params: {
        page: paginationParams().page.toString(),
        pageSize: paginationParams().pageSize.toString(),
        sort: paginationParams().sort ?? 'year',
        order: paginationParams().order ?? 'desc'
      }
    }));
  }
}
