import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { PlayerResponse, PlayerPosition } from '../core/interfaces/player.interface';
import { MatchResponse } from '../core/interfaces/match.interface';

interface PlayersByPosition {
  position: PlayerPosition;
  players: PlayerResponse[];
}

interface TeamRecord {
  wins: number;
  draws: number;
  losses: number;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  imports: [MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamComponent {
  
  // Mock team record data
  protected readonly teamRecord = signal<TeamRecord>({
    wins: 12,
    draws: 4,
    losses: 2
  });

  // Mock players data based on backend model
  protected readonly players = signal<PlayerResponse[]>([
    {
      id: 1,
      nick_name: 'Oblak',
      height: 188,
      country: 'SVN',
      country2: '',
      foot: 'R',
      age: 31,
      squad_number: 13,
      rating: 92,
      matches: 25,
      y_cards: 2,
      r_cards: 0,
      goals: 0,
      assists: 1,
      saves: 98,
      position: 'por',
      injured: false,
      career_summary: 'Portero esloveno con experiencia en la élite europea',
      mvp_count: 3,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      nick_name: 'Savić',
      height: 187,
      country: 'MNE',
      country2: '',
      foot: 'R',
      age: 33,
      squad_number: 15,
      rating: 86,
      matches: 23,
      y_cards: 5,
      r_cards: 0,
      goals: 3,
      assists: 2,
      saves: 0,
      position: 'ceni',
      injured: false,
      career_summary: 'Defensor central montenegrino con gran físico',
      mvp_count: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 3,
      nick_name: 'Hermoso',
      height: 184,
      country: 'ESP',
      country2: '',
      foot: 'L',
      age: 29,
      squad_number: 22,
      rating: 84,
      matches: 24,
      y_cards: 3,
      r_cards: 0,
      goals: 2,
      assists: 4,
      saves: 0,
      position: 'cend',
      injured: false,
      career_summary: 'Defensor español versátil con buen pie izquierdo',
      mvp_count: 2,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 4,
      nick_name: 'Llorente',
      height: 180,
      country: 'ESP',
      country2: '',
      foot: 'R',
      age: 29,
      squad_number: 14,
      rating: 83,
      matches: 26,
      y_cards: 4,
      r_cards: 0,
      goals: 5,
      assists: 8,
      saves: 0,
      position: 'latd',
      injured: false,
      career_summary: 'Lateral derecho español con gran velocidad',
      mvp_count: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 5,
      nick_name: 'Koke',
      height: 176,
      country: 'ESP',
      country2: '',
      foot: 'R',
      age: 32,
      squad_number: 6,
      rating: 85,
      matches: 25,
      y_cards: 6,
      r_cards: 0,
      goals: 3,
      assists: 12,
      saves: 0,
      position: 'med',
      injured: false,
      career_summary: 'Capitán y mediocampista español con gran visión',
      mvp_count: 4,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 6,
      nick_name: 'Griezmann',
      height: 176,
      country: 'FRA',
      country2: '',
      foot: 'L',
      age: 33,
      squad_number: 7,
      rating: 88,
      matches: 24,
      y_cards: 2,
      r_cards: 0,
      goals: 18,
      assists: 9,
      saves: 0,
      position: 'del',
      injured: false,
      career_summary: 'Delantero francés creativo y versátil',
      mvp_count: 6,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]);

  // Mock recent matches data
  protected readonly recentMatches = signal<MatchResponse[]>([
    {
      id: 1,
      status: 'finished',
      kickoff: '2024-09-15T18:00:00Z',
      location: 'Estadio Wanda Metropolitano',
      home_goals: 2,
      away_goals: 1,
      home_team_id: 1,
      away_team_id: 2,
      season_id: 1,
      mvp_player_id: 6,
      created_at: '2024-09-15T16:00:00Z',
      updated_at: '2024-09-15T20:00:00Z',
      home_team: {
        id: 1,
        full_name: 'Browers FC',
        short_name: 'BFC'
      },
      away_team: {
        id: 2,
        full_name: 'Real Madrid CF',
        short_name: 'RMA'
      },
      season: {
        id: 1,
        year: 2024
      },
      mvp_player: {
        id: 6,
        nick_name: 'Griezmann',
        position: 'del'
      }
    },
    {
      id: 2,
      status: 'scheduled',
      kickoff: '2024-09-22T20:30:00Z',
      location: 'Camp Nou',
      home_goals: 0,
      away_goals: 0,
      home_team_id: 3,
      away_team_id: 1,
      season_id: 1,
      created_at: '2024-09-15T10:00:00Z',
      updated_at: '2024-09-15T10:00:00Z',
      home_team: {
        id: 3,
        full_name: 'FC Barcelona',
        short_name: 'BAR'
      },
      away_team: {
        id: 1,
        full_name: 'Browers FC',
        short_name: 'BFC'
      },
      season: {
        id: 1,
        year: 2024
      }
    },
    {
      id: 3,
      status: 'finished',
      kickoff: '2024-09-08T16:00:00Z',
      location: 'Estadio Ramón Sánchez-Pizjuán',
      home_goals: 1,
      away_goals: 1,
      home_team_id: 1,
      away_team_id: 4,
      season_id: 1,
      created_at: '2024-09-08T14:00:00Z',
      updated_at: '2024-09-08T18:00:00Z',
      home_team: {
        id: 1,
        full_name: 'Browers FC',
        short_name: 'BFC'
      },
      away_team: {
        id: 4,
        full_name: 'Sevilla FC',
        short_name: 'SEV'
      },
      season: {
        id: 1,
        year: 2024
      }
    }
  ]);

  // Computed property to group players by position
  protected readonly playersByPosition = computed<PlayersByPosition[]>(() => {
    const players = this.players();
    const positionsOrder: PlayerPosition[] = ['por', 'ceni', 'cend', 'lati', 'latd', 'med', 'del', 'deli', 'deld'];
    
    return positionsOrder
      .map(position => ({
        position,
        players: players.filter(player => player.position === position)
      }))
      .filter(group => group.players.length > 0);
  });

  // Helper function to get position display name
  protected getPositionName(position: PlayerPosition): string {
    const positionNames: Record<PlayerPosition, string> = {
      'por': 'Portero',
      'ceni': 'Defensa Central',
      'cend': 'Defensa Central',
      'lati': 'Lateral Izquierdo',
      'latd': 'Lateral Derecho',
      'med': 'Mediocampista',
      'del': 'Delantero',
      'deli': 'Delantero Izquierdo',
      'deld': 'Delantero Derecho'
    };
    return positionNames[position] || position.toUpperCase();
  }

  // Helper function to format kickoff time
  protected formatKickoffTime(kickoff: string): string {
    const date = new Date(kickoff);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  // Helper function to format kickoff date
  protected formatKickoffDate(kickoff: string): string {
    const date = new Date(kickoff);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Helper function to get match status label
  protected getStatusLabel(status: string): string {
    const statusLabels: Record<string, string> = {
      'scheduled': 'Programado',
      'in_progress': 'En Curso',
      'finished': 'Finalizado',
      'postponed': 'Pospuesto',
      'cancelled': 'Cancelado'
    };
    return statusLabels[status] || status;
  }
}
