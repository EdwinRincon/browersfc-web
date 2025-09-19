import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

interface Player {
  nick_name: string;
  full_name: string;
  height: number;
  country: string;
  country2?: string;
  foot: 'D' | 'I' | 'A'; // Derecho, Izquierdo, Ambidiestro
  age: number;
  squad_number: number;
  rating: number;
  matches: number;
  y_cards: number;
  r_cards: number;
  goals: number;
  assists: number;
  saves: number;
  position: string;
  injured: boolean;
  career_summary: string;
  mvp_count: number;
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  imports: [CommonModule, MaterialModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  player: Player = {
    nick_name: 'A. Musso',
    full_name: 'Alberto Julián Musso',
    height: 191,
    country: 'ARG',
    country2: undefined,
    foot: 'D', // D = Derecho, I = Izquierdo, A = Ambidiestro
    age: 31,
    squad_number: 1,
    rating: 7,
    matches: 34,
    y_cards: 2,
    r_cards: 0,
    goals: 0,
    assists: 0,
    saves: 98,
    position: 'POR', // Portero
    injured: false,
    career_summary: `Portero español destacado por sus reflejos y seguridad bajo los palos.
                    Internacional con la selección de Browers.`,
    mvp_count: 5,
  };
}
