import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PlayerResponse, PaginationParams } from '../../core/interfaces';
import { Sort, MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../material/material.module';
import { PlayerService } from '../../services/player/player.service';

@Component({
  selector: 'app-players',
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersComponent implements OnInit, AfterViewInit {
  private readonly playerService = inject(PlayerService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Signals for reactive state
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isMobile = signal<boolean>(false);

  // MatTableDataSource for players and total count
  protected readonly dataSource = new MatTableDataSource<PlayerResponse>([]);
  protected readonly totalPlayers = signal<number>(0);

  // Table configuration (match template columns)
  protected readonly displayedColumns = ['squad_number', 'nick_name', 'position', 'age', 'country', 'height', 'foot', 'rating', 'matches', 'goals', 'assists', 'injured', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  // Pagination parameters using interface
  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 10,
    sort: 'id',
    order: 'asc'
  });

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadPlayers();
    window.addEventListener('resize', () => this.checkScreenSize());
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
          sort: 'id',
          order: 'asc'
        }));
      }
      this.loadPlayers();
    }

  /**
   * Check screen size for responsive behavior
   */
  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  /**
   * Load players with pagination and sorting
   */
  protected loadPlayers(): void {
    this.loading.set(true);
    this.error.set(null);
    const params = this.paginationParams();
    this.playerService.getPlayers(params).subscribe({
      next: (response) => {
        const data = (response as any).data || response;
        const pag = data as { items: PlayerResponse[]; total_count: number };
        this.dataSource.data = pag.items || [];
        this.totalPlayers.set(pag.total_count || 0);
        setTimeout(() => {
          if (this.paginator) {
            this.paginator.pageIndex = params.page;
            this.paginator.length = pag.total_count || 0;
            this.cdr.detectChanges();
          }
        }, 0);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading players:', error);
        this.error.set('Failed to load players. Please try again.');
        this.loading.set(false);
      }
    });
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


  /**
   * Get country flag URL
   */
  protected getCountryFlag(countryCode: string): string {
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  }

  /**
   * Get injury status text
   */
  protected isPlayerInjured(injured: boolean): boolean {
    return injured === true;
  }

  protected isPlayerAvailable(injured: boolean): boolean {
    return injured === false;
  } 

  protected addPlayer(): void {
    //TODO: Implementation pending: open add player dialog or navigate to add player page
  }

  protected editPlayer(player: PlayerResponse): void {
    //TODO: Implementation pending: open edit player dialog or navigate to edit player page
  }

  protected deletePlayer(player: PlayerResponse): void {
    //TODO: Implementation pending: show confirmation and call service
  }

  // Pagination getters used by template
  get totalCount(): number {
    return this.totalPlayers();
  }

  get pageSize(): number {
    return this.paginationParams().pageSize;
  }

  get currentPage(): number {
    return this.paginationParams().page;
  }

  protected onPageChange(event: any): void {
    this.paginationParams.update(params => ({
      ...params,
      page: event.pageIndex,
      pageSize: event.pageSize
    }));
    this.loadPlayers();
  }

  protected refreshData(): void {
    this.loadPlayers();
  }
}