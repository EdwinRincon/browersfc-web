import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material/material.module';
import { LineupService } from '../../services/lineup/lineup.service';
import { LineupResponse, PaginationParams } from '../../core/interfaces';
import { AdminLineupPitchComponent } from './admin-lineup-pitch.component';
import { PlayerPosition } from '../../core/interfaces/player.interface';
import { forkJoin } from 'rxjs';

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
export class LineupsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly lineupService = inject(LineupService);
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected readonly isMobile = signal<boolean>(false);
  protected readonly displayedColumns = ['id', 'match', 'player', 'position', 'starting', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 10,
    sort: 'created_at',
    order: 'desc'
  });

  // Signal-powered resource for paginated lineups
  protected readonly paginatedLineups = this.lineupService.getLineupsResource(this.paginationParams);


  // Helpers for resource state
  protected get paginatedItems() {
    return this.paginatedLineups.value()?.data.items ?? [];
  }
  protected get paginatedTotal() {
    return this.paginatedLineups.value()?.data.total_count ?? 0;
  }

  // Error signal for save errors
  protected readonly saveError = signal<string | null>(null);

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
        sort: 'created_at',
        order: 'desc'
      }));
    }
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

  protected onSaveLineup(event: {
    matchId: number;
    formation: string;
    lineup: Array<{ position: string; player_id: number; match_id: number; starting: boolean }>
  }) {
    this.saveError.set(null);
    const requests = event.lineup.map(slot =>
      this.lineupService.createLineup({
        position: slot.position as PlayerPosition,
        player_id: slot.player_id,
        match_id: slot.match_id,
        starting: slot.starting
      })
    );

    forkJoin(requests)
      .subscribe({
        next: () => {
          // Fallback: trigger resource refetch by updating paginationParams
          this.paginationParams.update(params => ({ ...params }));
          this.snackBar.open('Lineup saved successfully!', 'Close', {
            duration: 3000,
            panelClass: ['bg-browers-deep-purple', 'text-browers-white', 'font-semibold']
          });
        },
        error: (err) => {
          const msg = 'Error saving lineup.' + (err?.message ? ` ${err.message}` : '');
          this.saveError.set(msg);
          this.snackBar.open(msg, 'Close', { duration: 4000, panelClass: ['bg-red-100', 'text-red-800'] });
        }
      });
  }

}
