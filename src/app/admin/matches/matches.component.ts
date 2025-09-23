import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { MatchResponse, PaginationParams } from '../../core/interfaces';
import { MaterialModule } from '../../material/material.module';
import { MatchService } from '../../services/match/match.service';

@Component({
  selector: 'app-matches',
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MatchesComponent implements OnInit, AfterViewInit {
  private readonly matchService = inject(MatchService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isMobile = signal<boolean>(false);

  // MatTableDataSource for matches and total count
  protected readonly dataSource = new MatTableDataSource<MatchResponse>([]);
  protected readonly totalMatches = signal<number>(0);

  // Computed for responsive behavior
  protected readonly showMobileView = computed(() => this.isMobile());

  // Table configuration
  protected readonly displayedColumns = ['id', 'kickoff', 'home_team', 'away_team', 'score', 'status', 'location', 'season', 'created_at', 'updated_at', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  // Pagination parameters using interface
  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 5,
    sort: 'kickoff',
    order: 'desc'
  });

  // Computed for template compatibility
  protected readonly matchesArray = () => this.dataSource.data ?? [];

  ngOnInit(): void {
    this.checkIfMobile();
    this.loadMatches();

    // Setup resize listener
    window.addEventListener('resize', () => {
      this.checkIfMobile();
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * Check if current viewport is mobile
   */
  private checkIfMobile(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  /**
   * Load matches from API with pagination
   */
  protected loadMatches(): void {
    this.loading.set(true);
    this.error.set(null);

    const params = this.paginationParams();
    this.matchService.getMatches(params).subscribe({
      next: (response) => {

        const data = response.data;
        this.dataSource.data = data.items || [];
        this.totalMatches.set(data.total_count || 0);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading matches:', error);
        this.error.set('Failed to load matches. Please try again.');
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Handle pagination changes
   */
  protected onPageChange(event: PageEvent): void {
    this.paginationParams.update(params => ({
      ...params,
      page: event.pageIndex,
      pageSize: event.pageSize
    }));
    this.loadMatches();
  }

  /**
   * Handle sort changes
   */
  protected onSortChange(sort: Sort): void {
    if (sort.direction) {
      this.paginationParams.update(params => ({
        ...params,
        sort: sort.active,
        order: sort.direction as 'asc' | 'desc',
        page: 0 // Reset to first page when sorting
      }));
    } else {
      // Reset to default sort
      this.paginationParams.update(params => ({
        ...params,
        sort: 'kickoff',
        order: 'desc',
        page: 0
      }));
    }
    this.loadMatches();
  }

  /**
   * Get status display text
   */
  protected getStatusDisplay(status: string): string {
    const statuses: Record<string, string> = {
      'scheduled': 'Scheduled',
      'in_progress': 'In Progress',
      'finished': 'Finished',
      'postponed': 'Postponed',
      'cancelled': 'Cancelled'
    };
    return statuses[status] || status;
  }

  /**
   * Get status badge color
   */
  protected getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'scheduled': 'scheduled',
      'in_progress': 'in-progress',
      'finished': 'finished',
      'postponed': 'postponed',
      'cancelled': 'cancelled'
    };
    return colors[status] || 'default';
  }

  /**
   * Get match result display
   */
  protected getMatchResult(match: MatchResponse): string {
    if (match.status === 'finished' && match.home_goals !== undefined && match.away_goals !== undefined) {
      return `${match.home_goals} - ${match.away_goals}`;
    }
    return 'vs';
  }

  /**
   * Format time for display
   */
  protected formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format date for display
   */
  protected formatDate(dateString: string): string {
   return new Date(dateString).toLocaleDateString();
  }

  /**
   * Actions
   */
  protected editMatch(match: MatchResponse): void {
    console.log('Edit match:', match);
    // TODO: Implement edit functionality
  }

  protected deleteMatch(match: MatchResponse): void {
    console.log('Delete match:', match);
    // TODO: Implement delete functionality
  }

  protected addMatch(): void {
    console.log('Add new match');
    // TODO: Implement add functionality
  }

  protected refreshData(): void {
    this.loadMatches();
  }
}