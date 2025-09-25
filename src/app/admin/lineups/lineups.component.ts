import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material/material.module';
import { LineupService } from '../../services/lineup/lineup.service';
import { LineupResponse, PaginationParams, ApiSuccessResponse, PaginatedResponse } from '../../core/interfaces';
import { AdminLineupPitchComponent } from './admin-lineup-pitch.component';
import { PlayerPosition, PlayerShort } from '../../core/interfaces/player.interface';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-lineups',
  templateUrl: './lineups.component.html',
  styleUrls: ['./lineups.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialModule,
    AdminLineupPitchComponent
  ]
})
export class LineupsComponent implements OnInit, AfterViewInit {
  private readonly lineupService = inject(LineupService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isMobile = signal<boolean>(false);

  protected readonly dataSource = new MatTableDataSource<LineupResponse>([]);
  protected readonly totalCount = signal<number>(0);
  protected readonly pageSize = signal<number>(10);
  protected readonly currentPage = signal<number>(0);

  protected readonly displayedColumns = ['id', 'match', 'player', 'position', 'starting', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

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
    this.lineupService.getLineups(params)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
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
              this.cdr.detectChanges(); // ensure OnPush refresh
            }
          }, 0);
        },
        error: () => {
          this.error.set('Error loading lineups. Please try again.');
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


  protected editLineup(lineup: LineupResponse): void {
    console.log('Edit lineup:', lineup);
  }

  protected deleteLineup(lineup: LineupResponse): void {
    console.log('Delete lineup:', lineup);
  }

  protected refreshData(): void {
    this.loadLineups();
  }

  protected onSaveLineup(event: {
    matchId: number;
    formation: string;
    lineup: Array<{ position: string; player_id: number; match_id: number; starting: boolean }>
  }) {
    this.loading.set(true);
    this.error.set(null);

    // Directly use the provided lineup array, which is already in backend format
    const requests = event.lineup.map(slot =>
      this.lineupService.createLineup({
        position: slot.position as PlayerPosition,
        player_id: slot.player_id,
        match_id: slot.match_id,
        starting: slot.starting
      })
    );

    forkJoin(requests)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.loadLineups();
          this.error.set(null);
          this.snackBar.open('Lineup saved successfully!', 'Close', {
            duration: 3000,
            panelClass: ['bg-browers-deep-purple', 'text-browers-white', 'font-semibold']
          });
        },
        error: (err) => {
          const msg = 'Error saving lineup.' + (err?.message ? ` ${err.message}` : '');
          this.error.set(msg);
        }
      });
  }

  /** Unique players with Set for efficiency */
  private extractAllPlayers(): PlayerShort[] {
    if (!this.dataSource.data?.length) return [];

    const seen = new Set<number>();
    return this.dataSource.data
      .filter(item => item.player && !seen.has(item.player.id))
      .map(item => {
        seen.add(item.player!.id);
        return item.player!;
      });
  }

  /** Map player name → playerId */
  private mapPlayerNameToId(playerName: string, allPlayers: PlayerShort[]): number | undefined {
    return playerName ? allPlayers.find(p => p.nick_name === playerName)?.id : undefined;
  }
}
