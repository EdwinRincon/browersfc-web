import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TeamResponse, PaginationParams } from '../../core/interfaces';
import { MaterialModule } from '../../material/material.module';
import { TeamService } from '../../services/team/team.service';

@Component({
  selector: 'app-teams',
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamsComponent {
  private readonly teamService = inject(TeamService);

  protected readonly isMobile = signal(window.innerWidth < 768);
  protected readonly pageSizeOptions = [5, 10, 25, 50];
  protected readonly displayedColumns = ['id', 'full_name', 'short_name', 'color', 'color2', 'shield', 'next_match', 'created_at', 'updated_at', 'actions'];

  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 10,
    sort: 'id',
    order: 'desc'
  });

  // Signal-powered resource for paginated teams
  protected readonly paginatedTeams = this.teamService.getTeamsResource(this.paginationParams);

  constructor() {
    window.addEventListener('resize', () => this.isMobile.set(window.innerWidth < 768));
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
        sort: 'full_name',
        order: 'asc'
      }));
    }
  }

  updateTeam(teamId: number, teamData: Partial<TeamResponse>): void {
    // TODO: Implementation pending
  }

  deleteTeam(teamId: number): void {
    // TODO: Implementation pending
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getNextMatchDisplay(team: TeamResponse): string {
    if (team.next_match) {
      const kickoffDate = new Date(team.next_match.kickoff);
      const location = team.next_match.location || `Match #${team.next_match.id}`;
      return `${location} (${kickoffDate.toLocaleDateString()})`;
    }
    return 'No upcoming match';
  }

  hasNextMatch(team: TeamResponse): boolean {
    return !!team.next_match;
  }

  hasNoNextMatch(team: TeamResponse): boolean {
    return !team.next_match;
  }
}