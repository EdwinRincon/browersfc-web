
import { PlayerStatsService } from '../../services/player-stats/player-stats.service';
import { PlayerStatsResponse, PaginationParams } from '../../core/interfaces';
import { MaterialModule } from '../../material/material.module';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { computed, signal, inject, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule]
})

export class PlayerStatsComponent implements OnDestroy {
  private readonly playerStatsService = inject(PlayerStatsService);

  // Table configuration
  protected readonly displayedColumns = ['player', 'match', 'stats', 'actions'];
  protected readonly pageSizeOptions = [10, 20, 50];

  // Pagination and sorting state
  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 10,
    sort: 'created_at',
    order: 'desc'
  });

  // Responsive state
  protected readonly isMobile = signal(window.innerWidth < 768);
  protected readonly showMobileView = computed(() => this.isMobile());

  // Resource for paginated player stats
  protected readonly paginatedPlayerStats = this.playerStatsService.getPlayerStatsResource(this.paginationParams);

  // Getters for items and total
  protected get paginatedItems() {
    return this.paginatedPlayerStats.value()?.data.items ?? [];
  }

  protected get paginatedTotal() {
    return this.paginatedPlayerStats.value()?.data.total_count ?? 0;
  }

  constructor() {
    window.addEventListener('resize', this.onResize);
  }

  private readonly onResize = () => {
    this.isMobile.set(window.innerWidth < 768);
  };

  // Sorting handler
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
        sort: 'created_at',
        order: 'desc'
      }));
    }
  }

  // Pagination handler
  onPageChange(event: PageEvent): void {
    this.paginationParams.update(params => ({
      ...params,
      page: event.pageIndex,
      pageSize: event.pageSize
    }));
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toUTCString();
  }

  editStats(stats: PlayerStatsResponse): void {
    // TODO: Implement edit dialog
    console.log('Edit stats:', stats);
  }

  deleteStats(stats: PlayerStatsResponse): void {
    // TODO: Implement delete dialog
    console.log('Delete stats:', stats);
  }

  addStats(): void {
    // TODO: Implement add dialog
    console.log('Add new stats');
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }
}