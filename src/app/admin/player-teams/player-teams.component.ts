
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { PlayerTeamResponse, PaginationParams } from '../../core/interfaces';
import { PlayerTeamsService } from '../../services/player-teams/player-teams.service';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-player-teams',
  templateUrl: './player-teams.component.html',
  styleUrls: ['./player-teams.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialModule
  ]
})

export class PlayerTeamsComponent implements OnInit, AfterViewInit {
  private readonly playerTeamsService = inject(PlayerTeamsService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Signals for reactive state
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isMobile = signal<boolean>(false);

  // MatTableDataSource for player-team relationships and total count
  protected readonly dataSource = new MatTableDataSource<PlayerTeamResponse>([]);
  protected readonly totalCount = signal<number>(0);

  // Table configuration
  protected readonly displayedColumns = ['player', 'team', 'period', 'status', 'actions'];
  protected readonly pageSizeOptions = [10, 20, 50];

  // Pagination parameters using interface
  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 10,
    sort: 'id',
    order: 'desc'
  });

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadPlayerTeams();
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

  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  protected loadPlayerTeams(): void {
    this.loading.set(true);
    this.error.set(null);
    const params = this.paginationParams();
    this.playerTeamsService.getPlayerTeams(params).subscribe({
      next: (response) => {
        // Response follows ApiSuccessResponse<PaginatedResponse<...>>
        const pag = (response as any).data as { items: PlayerTeamResponse[]; total_count: number };
        this.dataSource.data = pag.items || [];
        this.totalCount.set(pag.total_count || 0);
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
        this.error.set('Error loading player-team relationships. Please try again.');
        this.loading.set(false);
      }
    });
  }

  protected onPageChange(event: PageEvent): void {
    this.paginationParams.update(params => ({
      ...params,
      page: event.pageIndex,
      pageSize: event.pageSize
    }));
    this.loadPlayerTeams();
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
        order: 'desc'
      }));
    }
    this.loadPlayerTeams();
  }

  protected addRelationship(): void {
    //TODO: Implementation pending: open dialog or navigate to add form
  }

  protected editRelationship(relationship: PlayerTeamResponse): void {
    //TODO: Implementation pending: open dialog or navigate to edit form
  }

  protected deleteRelationship(relationship: PlayerTeamResponse): void {
    //TODO: Implementation pending: show confirmation and call service
  }

  protected formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  protected refreshData(): void {
    this.loadPlayerTeams();
  }
}