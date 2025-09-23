import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { SeasonResponse, PaginationParams, ApiErrorResponse } from '../../core/interfaces';
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
export class SeasonsComponent implements OnInit, AfterViewInit {
  private readonly seasonService = inject(SeasonService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Signals for reactive state
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isMobile = signal<boolean>(false);

  // MatTableDataSource for seasons and total count
  protected readonly dataSource = new MatTableDataSource<SeasonResponse>([]);
  protected readonly totalSeasons = signal<number>(0);

  // Computed for responsive behavior
  protected readonly showMobileView = computed(() => this.isMobile());

  // Table configuration
  protected readonly displayedColumns = ['id', 'year', 'start_date', 'end_date', 'is_current', 'created_at', 'updated_at', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  // Pagination parameters using interface
  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 5,
    sort: 'year',
    order: 'desc'
  });

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadSeasons();

    // Listen for window resize
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  ngAfterViewInit(): void {
    // Setup MatTableDataSource with proper sorting only
    // Do NOT assign paginator to dataSource as we handle pagination server-side
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    // Configure paginator properly for server-side pagination
    if (this.paginator) {
      const params = this.paginationParams();
      this.paginator.pageIndex = params.page;
      this.paginator.pageSize = params.pageSize;
    }
  }

  /**
   * Check screen size for responsive behavior
   */
  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  /**
   * Load seasons with pagination and sorting
   */
  protected loadSeasons(): void {
    this.loading.set(true);
    this.error.set(null);

    const params = this.paginationParams();

    this.seasonService.getSeasons(params).subscribe({
      next: (response) => {
        this.dataSource.data = response.items;
        this.totalSeasons.set(response.total_count);

        // Update paginator to reflect current state after change detection
        setTimeout(() => {
          if (this.paginator) {
            this.paginator.pageIndex = params.page;
            this.paginator.length = response.total_count;
            this.cdr.detectChanges(); // Force change detection
          }
        }, 0);

        this.loading.set(false);
      },
      error: (err: ApiErrorResponse) => {
        console.error('Error loading seasons:', err);
        this.error.set('Error loading seasons. Please try again.');
        this.loading.set(false);
      }
    });
  }

  /**
   * Handle page change event
   */
  protected onPageChange(event: PageEvent): void {
    // Update pagination parameters
    this.paginationParams.update(params => ({
      ...params,
      page: event.pageIndex, // pageIndex is 0-based, which matches backend expectation
      pageSize: event.pageSize
    }));

    // Load the new data
    this.loadSeasons();
  }

  /**
   * Handle sort change event
   */
  protected onSortChange(sort: Sort): void {
    if (sort.direction) {
      this.paginationParams.update(params => ({
        ...params,
        sort: sort.active,
        order: sort.direction as 'asc' | 'desc'
      }));
    } else {
      // Default sort when direction is ''
      this.paginationParams.update(params => ({
        ...params,
        sort: 'year',
        order: 'desc'
      }));
    }
    this.loadSeasons();
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
   * Get badge class for current season status
   */
  getCurrentBadgeClass(isCurrent: boolean): string {
    return isCurrent ? 'current-badge' : 'inactive-badge';
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