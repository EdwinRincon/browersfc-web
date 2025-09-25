import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { SeasonResponse, PaginationParams } from '../../core/interfaces';
import { MaterialModule } from '../../material/material.module';
import { SeasonService } from '../../services/season/season.service';

@Component({
  selector: 'app-seasons',
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonsComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly seasonService = inject(SeasonService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected readonly isMobile = signal<boolean>(false);
  protected readonly showMobileView = computed(() => this.isMobile());

  protected readonly displayedColumns = ['id', 'year', 'start_date', 'end_date', 'is_current', 'created_at', 'updated_at', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 5,
    sort: 'year',
    order: 'desc'
  });

  // Signal-powered resource for paginated seasons
  protected readonly paginatedSeasons = this.seasonService.getSeasonsResource(this.paginationParams);

  // Helper to get items from resource
  protected get paginatedItems() {
    return this.paginatedSeasons.value()?.data.items ?? [];
  }

  // Helper to get total count from resource
  protected get paginatedTotal() {
    return this.paginatedSeasons.value()?.data.total_count ?? 0;
  }

  private readonly resizeListener = () => this.checkScreenSize();

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(event => this.onPageChange(event));
    }
  }

  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  protected onPageChange(event: PageEvent): void {
    this.paginationParams.update(params => ({
      ...params,
      page: event.pageIndex,
      pageSize: event.pageSize
    }));
  }

  protected onSortChange(sort: Sort): void {
    if (sort.direction) {
      this.paginationParams.update(params => ({
        ...params,
        sort: sort.active,
        order: sort.direction as 'asc' | 'desc'
      }));
    } else {
      this.paginationParams.update(params => ({
        ...params,
        sort: 'year',
        order: 'desc'
      }));
    }
  }

  /**
   * Update season (placeholder implementation)
   */
  updateSeason(seasonId: number, seasonData: Partial<SeasonResponse>): void {
    //TODO: Implementation pending - will be added in future
  }

  /**
   * Delete season (placeholder implementation)
   */
  deleteSeason(seasonId: number): void {
    //TODO: Implementation pending - will be added in future
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Check if season is current
   */
  isCurrentSeason(isCurrent: boolean): boolean {
    return isCurrent;
  }

  /**
   * Check if season is inactive
   */
  isInactiveSeason(isCurrent: boolean): boolean {
    return !isCurrent;
  }
}