

import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PlayerTeamResponse, PaginationParams } from '../../core/interfaces';
import { PlayerTeamsService } from '../../services/player-teams/player-teams.service';
import { MaterialModule } from '../../material/material.module';


@Component({
  selector: 'app-player-teams',
  templateUrl: './player-teams.component.html',
  styleUrls: ['./player-teams.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, DatePipe]
})
export class PlayerTeamsComponent {
  private readonly playerTeamsService = inject(PlayerTeamsService);

  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 10,
    sort: 'id',
    order: 'desc'
  });

  protected readonly paginatedPlayerTeams = this.playerTeamsService.getPlayerTeamsResource(this.paginationParams);

  protected readonly totalCount = computed(() => this.paginatedPlayerTeams.value()?.data?.total_count ?? 0);
  protected readonly playerTeamsArray = computed(() => this.paginatedPlayerTeams.value()?.data?.items ?? []);

  protected readonly displayedColumns = ['player', 'team', 'period', 'status', 'actions'];
  protected readonly pageSizeOptions = [10, 20, 50];

  protected onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.paginationParams.update(params => ({
      ...params,
      page: event.pageIndex,
      pageSize: event.pageSize
    }));
  }

  protected onSortChange(sort: { active: string; direction: 'asc' | 'desc' | '' }): void {
    if (sort.direction) {
      this.paginationParams.update(params => ({
        ...params,
        sort: sort.active,
        order: sort.direction as 'asc' | 'desc',
        page: 0
      }));
    } else {
      this.paginationParams.update(params => ({
        ...params,
        sort: 'id',
        order: 'desc',
        page: 0
      }));
    }
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


}