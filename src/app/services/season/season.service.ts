import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  SeasonResponse,
  CreateSeasonRequest,
  UpdateSeasonRequest,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationParams,
} from '../../core/interfaces';

@Injectable({
  providedIn: 'root',
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
      order: params.order || 'desc',
    };

    return this.http
      .get<ApiSuccessResponse<PaginatedResponse<SeasonResponse>>>(this.baseUrl, {
        params: queryParams,
      })
      .pipe(map((response) => response.data));
  }

  /**
   * Get a specific season by ID
   */
  getSeasonById(id: number): Observable<SeasonResponse> {
    return this.http
      .get<ApiSuccessResponse<SeasonResponse>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get the current active season
   */
  getCurrentSeason(): Observable<SeasonResponse> {
    return this.http
      .get<ApiSuccessResponse<SeasonResponse>>(`${this.baseUrl}/current`)
      .pipe(map((response) => response.data));
  }

  /**
   * Create a new season (admin only)
   */
  createSeason(seasonData: CreateSeasonRequest): Observable<SeasonResponse> {
    return this.http
      .post<ApiSuccessResponse<SeasonResponse>>(this.adminBaseUrl, seasonData)
      .pipe(map((response) => response.data));
  }

  /**
   * Update an existing season (admin only)
   */
  updateSeason(id: number, seasonData: UpdateSeasonRequest): Observable<SeasonResponse> {
    return this.http
      .put<ApiSuccessResponse<SeasonResponse>>(`${this.adminBaseUrl}/${id}`, seasonData)
      .pipe(map((response) => response.data));
  }

  /**
   * Set a season as the current active season (admin only)
   */
  setCurrentSeason(id: number): Observable<{ message: string; id: number }> {
    return this.http
      .put<ApiSuccessResponse<{ message: string; id: number }>>(
        `${this.adminBaseUrl}/${id}/set-current`,
        {}
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Delete a season (admin only)
   */
  deleteSeason(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }


  getAllSeasons(): Observable<SeasonResponse[]> {
    return this.getSeasons({ page: 0, pageSize: 100, sort: 'year', order: 'desc' }).pipe(
      map((response) => response.items)
    );
  }
}
