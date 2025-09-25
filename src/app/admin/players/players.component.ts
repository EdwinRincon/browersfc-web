import { Component, ChangeDetectionStrategy, inject, signal, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

export class PlayersComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly playerService = inject(PlayerService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  protected readonly isMobile = signal<boolean>(false);
  protected readonly displayedColumns = ['squad_number', 'nick_name', 'position', 'age', 'country', 'height', 'foot', 'rating', 'matches', 'goals', 'assists', 'injured', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 10,
    sort: 'id',
    order: 'asc'
  });

  // Signal-powered resource for paginated players
  protected readonly paginatedPlayers = this.playerService.getPlayersResource(this.paginationParams);

  get paginatedPlayersItems() {
    return this.paginatedPlayers.value()?.data.items ?? [];
  }
  get paginatedPlayersTotal() {
    return this.paginatedPlayers.value()?.data.total_count ?? 0;
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

  protected onPageChange(event: any): void {
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
        sort: 'id',
        order: 'asc'
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

  protected getCountryFlag(countryCode: string): string {
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  }

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
}