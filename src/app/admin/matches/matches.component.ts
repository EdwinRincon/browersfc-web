import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { MatchResponse, PaginationParams } from '../../core/interfaces';
import { MaterialModule } from '../../material/material.module';
import { MatchService } from '../../services/match/match.service';

@Component({
  selector: 'app-matches',
  imports: [MaterialModule],
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchesComponent {
  private readonly matchService = inject(MatchService);

  protected readonly paginationParams = signal<PaginationParams>({
    page: 0,
    pageSize: 5,
    sort: 'kickoff',
    order: 'desc'
  });

  protected readonly paginatedMatches = this.matchService.getMatchesResource(this.paginationParams);

  protected readonly totalMatches = computed(() => this.paginatedMatches.value()?.data?.total_count ?? 0);
  protected readonly matchesArray = computed(() => this.paginatedMatches.value()?.data?.items ?? []);

  protected readonly displayedColumns = ['id', 'kickoff', 'home_team', 'away_team', 'score', 'status', 'location', 'season', 'created_at', 'updated_at', 'actions'];
  protected readonly pageSizeOptions = [5, 10, 25, 50];

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
        sort: 'kickoff',
        order: 'desc',
        page: 0
      }));
    }
  }

  protected getStatusDisplay(status: string): string {
    const statuses: Record<string, string> = {
      'scheduled': 'Scheduled',
      'in_progress': 'In Progress',
      'finished': 'Finished',
      'postponed': 'Postponed',
      'cancelled': 'Cancelled'
    };
    return statuses[status] || status;
  }

  protected getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'scheduled': 'scheduled',
      'in_progress': 'in-progress',
      'finished': 'finished',
      'postponed': 'postponed',
      'cancelled': 'cancelled'
    };
    return colors[status] || 'default';
  }

  protected getMatchResult(match: MatchResponse): string {
    if (match.status === 'finished' && match.home_goals !== undefined && match.away_goals !== undefined) {
      return `${match.home_goals} - ${match.away_goals}`;
    }
    return 'vs';
  }

  protected formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  protected formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  protected editMatch(match: MatchResponse): void {
    console.log('Edit match:', match);
    // TODO: Implement edit functionality
  }

  protected deleteMatch(match: MatchResponse): void {
    console.log('Delete match:', match);
    // TODO: Implement delete functionality
  }

  protected addMatch(): void {
    console.log('Add new match');
    // TODO: Implement add functionality
  }

}
