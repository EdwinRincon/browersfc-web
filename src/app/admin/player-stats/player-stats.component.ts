import { ChangeDetectionStrategy, Component, OnInit, signal, inject, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy, computed } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { PlayerStatsService } from '../../services/player-stats/player-stats.service';
import { PlayerStatsResponse, PaginationParams, ApiSuccessResponse, PaginatedResponse } from '../../core/interfaces';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule
]
})

export class PlayerStatsComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly playerStatsService = inject(PlayerStatsService);
  private readonly cdr = inject(ChangeDetectorRef);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Signals for state management
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isMobile = signal<boolean>(false);

  // MatTableDataSource for better data management
  protected readonly dataSource = new MatTableDataSource<PlayerStatsResponse>([]);
  protected readonly totalStats = signal<number>(0);

  // Table configuration
  protected readonly displayedColumns = ['player', 'match', 'stats', 'actions'];
  protected readonly pageSizeOptions = [10, 20, 50];

  // Pagination parameters using interface
  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 10,
    sort: 'created_at',
    order: 'desc'
  });

  protected readonly showMobileView = computed(() => this.isMobile());

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadPlayerStats();

    // listen for resize
    window.addEventListener('resize', this.onResize);
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      const params = this.paginationParams();
      this.paginator.pageIndex = params.page;
      this.paginator.pageSize = params.pageSize;
    }
  }

  ngOnDestroy(): void {
    // cleanup resize listener
    window.removeEventListener('resize', this.onResize);
  }

  private readonly onResize = () => {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  protected loadPlayerStats(): void {
    this.loading.set(true);
    this.error.set(null);
    const params = this.paginationParams();
    this.playerStatsService.getPlayerStats(params)
      .pipe(
        map((res: ApiSuccessResponse<PaginatedResponse<PlayerStatsResponse>>) => res.data)
      )
      .subscribe({
        next: (pag: PaginatedResponse<PlayerStatsResponse>) => {
          this.dataSource.data = pag.items || [];
          this.totalStats.set(pag.total_count || 0);
          setTimeout(() => {
            if (this.paginator) {
              this.paginator.pageIndex = params.page;
              this.paginator.length = pag.total_count || 0;
              this.cdr.detectChanges();
            }
          }, 0);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Error loading player statistics');
          this.loading.set(false);
          console.error('Error loading player statistics:', err);
        }
      });
  }

  /**
   * Handle server-side sorting
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
        sort: 'created_at',
        order: 'desc'
      }));
    }
    this.loadPlayerStats();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toUTCString();
  }

  onPageChange(event: PageEvent): void {
    this.paginationParams.update(params => ({
      ...params,
      page: event.pageIndex,
      pageSize: event.pageSize
    }));
    this.loadPlayerStats();
  }

  editStats(stats: PlayerStatsResponse): void {
    console.log('Edit stats:', stats);
    // Implementation pending
  }

  deleteStats(stats: PlayerStatsResponse): void {
    console.log('Delete stats:', stats);
    // Implementation pending
  }

  addStats(): void {
    console.log('Add new stats');
    // Implementation pending
  }
}