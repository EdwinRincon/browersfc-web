import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, computed, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { TeamStatsResponse, PaginationParams, PaginatedResponse } from '../../core/interfaces';
import { MaterialModule } from '../../material/material.module';
import { TeamStatsService } from '../../services/team-stats/team-stats.service';

@Component({
  selector: 'app-team-stats',
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamStatsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly teamStatsService = inject(TeamStatsService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Signals for reactive state
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isMobile = signal<boolean>(false);

  // MatTableDataSource for team stats and total count
  protected readonly dataSource = new MatTableDataSource<TeamStatsResponse>([]);
  protected readonly totalTeamStats = signal<number>(0);

  // Computed for responsive behavior
  protected readonly showMobileView = computed(() => this.isMobile());

  // Table configuration
  protected readonly displayedColumns = ['id', 'team', 'season_id', 'wins', 'draws', 'losses', 'goals_for', 'goals_against', 'points', 'rank', 'created_at', 'updated_at', 'actions'];
  protected readonly pageSizeOptions = [15, 25, 50];

  // Pagination parameters using interface
  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 15,
    sort: 'season_id',
    order: 'desc'
  });

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadTeamStats();

    // Listen for window resize (use named handler so it can be removed)
    window.addEventListener('resize', this.onResize);
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

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  private readonly onResize = () => {
    this.checkScreenSize();
  }

  /**
   * Check screen size for responsive behavior
   */
  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  /**
   * Load team stats with pagination and sorting
   */
  protected loadTeamStats(): void {
    this.loading.set(true);
    this.error.set(null);

    const params = this.paginationParams();

    this.teamStatsService.getTeamStats(params).subscribe({
      next: (response: PaginatedResponse<TeamStatsResponse>) => {
        this.dataSource.data = response.items;
        this.totalTeamStats.set(response.total_count);

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
      error: (err: unknown) => {
        console.error('Error loading team stats:', err);
        this.error.set('Error loading team stats. Please try again.');
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
    this.loadTeamStats();
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
        sort: 'rank',
        order: 'asc'
      }));
    }
    this.loadTeamStats();
  }

  /**
   * Update team stats (placeholder implementation)
   */
  updateTeamStats(statsId: number, statsData: Partial<TeamStatsResponse>): void {
    //TODO: Implementation pending - will be added in future
  }

  /**
   * Delete team stats (placeholder implementation)
   */
  deleteTeamStats(statsId: number): void {
    //TODO: Implementation pending - will be added in future
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Calculate goal difference
   */
  getGoalDifference(stats: TeamStatsResponse): number {
    return stats.goals_for - stats.goals_against;
  }

  /**
   * Get rank badge class
   */
  getRankBadgeClass(rank: number): string {
    if (rank <= 3) return 'top-rank-badge';
    if (rank <= 8) return 'mid-rank-badge';
    return 'low-rank-badge';
  }

  /**
   * Actions
   */
  protected addTeamStats(): void {
    //TODO: Implementation pending - will be added in future
  }

  protected refreshData(): void {
    this.loadTeamStats();
  }
}