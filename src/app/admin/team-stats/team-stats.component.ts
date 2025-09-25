import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TeamStatsResponse, PaginationParams } from '../../core/interfaces';
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
export class TeamStatsComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly teamStatsService = inject(TeamStatsService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected readonly isMobile = signal<boolean>(false);
  protected readonly showMobileView = computed(() => this.isMobile());

  protected readonly displayedColumns = [
    'id', 'team', 'season_id', 'wins', 'draws', 'losses', 'goals_for', 'goals_against', 'points', 'rank', 'created_at', 'updated_at', 'actions'
  ];
  protected readonly pageSizeOptions = [15, 25, 50];

  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 15,
    sort: 'rank',
    order: 'asc'
  });

  // Signal-based resource for paginated team stats
  protected readonly paginatedTeamStats = this.teamStatsService.getTeamStatsResource(this.paginationParams);

  // Helpers for items and total count
  protected get paginatedItems() {
    return this.paginatedTeamStats.value()?.data.items ?? [];
  }
  protected get paginatedTotal() {
    return this.paginatedTeamStats.value()?.data.total_count ?? 0;
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
        sort: 'rank',
        order: 'asc'
      }));
    }
  }

  updateTeamStats(statsId: number, statsData: Partial<TeamStatsResponse>): void {
    //TODO: Implementation pending - will be added in future
  }

  deleteTeamStats(statsId: number): void {
    //TODO: Implementation pending - will be added in future
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getGoalDifference(stats: TeamStatsResponse): number {
    return stats.goals_for - stats.goals_against;
  }

  getRankBadgeClass(rank: number): string {
    if (rank <= 3) return 'top-rank-badge';
    if (rank <= 8) return 'mid-rank-badge';
    return 'low-rank-badge';
  }

  protected addTeamStats(): void {
    //TODO: Implementation pending - will be added in future
  }

}
