import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { TeamResponse, PaginationParams, ApiErrorResponse } from '../../core/interfaces';
import { MaterialModule } from '../../material/material.module';
import { TeamService } from '../../services/team/team.service';

@Component({
  selector: 'app-teams',
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamsComponent implements OnInit, AfterViewInit {
  private readonly teamService = inject(TeamService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Signals for reactive state
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isMobile = signal<boolean>(false);

  // MatTableDataSource for teams and total count
  protected readonly dataSource = new MatTableDataSource<TeamResponse>([]);
  protected readonly totalTeams = signal<number>(0);

  // Computed for responsive behavior
  protected readonly showMobileView = computed(() => this.isMobile());

  // Table configuration
  protected readonly displayedColumns = ['id', 'full_name', 'short_name', 'color', 'color2', 'shield', 'next_match', 'created_at', 'updated_at', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  // Pagination parameters using interface
  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 10,
    sort: 'id',
    order: 'desc'
  });

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadTeams();

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
   * Load teams with pagination and sorting
   */
  protected loadTeams(): void {
    this.loading.set(true);
    this.error.set(null);

    const params = this.paginationParams();

    this.teamService.getTeams(params).subscribe({
      next: (response) => {
        this.dataSource.data = response.items;
        this.totalTeams.set(response.total_count);

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
        console.error('Error loading teams:', err);
        this.error.set('Error loading teams. Please try again.');
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
    this.loadTeams();
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
      this.paginationParams.update(params => ({
        ...params,
        sort: 'full_name',
        order: 'asc'
      }));
    }
    this.loadTeams();
  }

  /**
   * Update team 
   */
  updateTeam(teamId: number, teamData: Partial<TeamResponse>): void {
    //TODO: Implementation pending - will be added in future
  }

  /**
   * Delete team 
   */
  deleteTeam(teamId: number): void {
    //TODO: Implementation pending - will be added in future
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Get display for next match
   */
  getNextMatchDisplay(team: TeamResponse): string {
    if (team.next_match) {
      const kickoffDate = new Date(team.next_match.kickoff);
      const location = team.next_match.location || `Match #${team.next_match.id}`;
      return `${location} (${kickoffDate.toLocaleDateString()})`;
    }
    return 'No upcoming match';
  }

  /**
   * Check if team has next match
   */
  hasNextMatch(team: TeamResponse): boolean {
    return !!team.next_match;
  }

  /**
   * Check if team has no next match
   */
  hasNoNextMatch(team: TeamResponse): boolean {
    return !team.next_match;
  }
}