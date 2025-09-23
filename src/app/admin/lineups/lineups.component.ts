
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MaterialModule } from '../../material/material.module';
import { LineupService } from '../../services/lineup/lineup.service';
import { LineupResponse, PaginationParams, ApiSuccessResponse, PaginatedResponse } from '../../core/interfaces';


@Component({
  selector: 'app-lineups',
  templateUrl: './lineups.component.html',
  styleUrls: ['./lineups.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class LineupsComponent implements OnInit, AfterViewInit {
  private readonly lineupService = inject(LineupService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isMobile = signal<boolean>(false);

  protected readonly dataSource = new MatTableDataSource<LineupResponse>([]);
  protected readonly totalCount = signal<number>(0);
  protected readonly pageSize = signal<number>(10);
  protected readonly currentPage = signal<number>(0);

  // Table configuration
  protected readonly displayedColumns = ['id', 'match', 'player', 'position', 'starting', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  // Pagination parameters using interface
  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 10,
    sort: 'created_at',
    order: 'desc'
  });

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadLineups();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      const params = this.paginationParams();
      this.paginator.pageIndex = params.page;
      this.paginator.pageSize = params.pageSize;
    }
  }

  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  protected loadLineups(): void {
    this.loading.set(true);
    this.error.set(null);
    const params = this.paginationParams();
    this.lineupService.getLineups(params).subscribe({
      next: (response: ApiSuccessResponse<PaginatedResponse<LineupResponse>>) => {
        const data = response.data;
        this.dataSource.data = data.items || [];
        this.totalCount.set(data.total_count || 0);
        this.pageSize.set(params.pageSize);
        this.currentPage.set(params.page);
        setTimeout(() => {
          if (this.paginator) {
            this.paginator.pageIndex = params.page;
            this.paginator.length = data.total_count || 0;
            this.cdr.detectChanges();
          }
        }, 0);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error loading lineups. Please try again.');
        this.loading.set(false);
      }
    });
  }

  protected onPageChange(event: PageEvent): void {
    this.paginationParams.update((params: PaginationParams) => ({
      ...params,
      page: event.pageIndex,
      pageSize: event.pageSize
    }));
    this.pageSize.set(event.pageSize);
    this.currentPage.set(event.pageIndex);
    this.loadLineups();
  }

  protected onSortChange(sort: Sort): void {
    if (sort.direction) {
      this.paginationParams.update((params: PaginationParams) => ({
        ...params,
        sort: sort.active,
        order: sort.direction as 'asc' | 'desc'
      }));
    } else {
      this.paginationParams.update((params: PaginationParams) => ({
        ...params,
        sort: 'created_at',
        order: 'desc'
      }));
    }
    this.loadLineups();
  }



  protected getPositionColor(position: string): string {
    const colors: Record<string, string> = {
      'por': 'bg-yellow-100 text-yellow-800',
      'ceni': 'bg-blue-100 text-blue-800',
      'cend': 'bg-blue-100 text-blue-800',
      'lati': 'bg-green-100 text-green-800',
      'latd': 'bg-green-100 text-green-800',
      'med': 'bg-purple-100 text-purple-800',
      'del': 'bg-red-100 text-red-800',
      'deli': 'bg-red-100 text-red-800',
      'deld': 'bg-red-100 text-red-800'
    };
    return colors[position] || 'bg-gray-100 text-gray-800';
  }
  protected addLineup(): void {
    // TODO: Implement add functionality
    console.log('Add new lineup');
  }

  protected editLineup(lineup: LineupResponse): void {
    // TODO: Implement edit functionality
    console.log('Edit lineup:', lineup);
  }

  protected deleteLineup(lineup: LineupResponse): void {
    // TODO: Implement delete functionality
    console.log('Delete lineup:', lineup);
  }

  protected refreshData(): void {
    this.loadLineups();
  }
}