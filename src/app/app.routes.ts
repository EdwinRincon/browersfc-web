import { Routes } from '@angular/router';
import { AdminGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), data: { preload: true } },
  { path: 'team', loadComponent: () => import('./team/team.component').then(m => m.TeamComponent) },
  { path: 'player/:id', loadComponent: () => import('./player/player.component').then(m => m.PlayerComponent) },
  { 
    path: 'admin', 
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AdminGuard],
    children: [
      { path: 'users', loadComponent: () => import('./admin/users/users.component').then(m => m.UsersComponent) },
      { path: 'seasons', loadComponent: () => import('./admin/seasons/seasons.component').then(m => m.SeasonsComponent) },
      { path: 'teams', loadComponent: () => import('./admin/teams/teams.component').then(m => m.TeamsComponent) },
      { path: 'players', loadComponent: () => import('./admin/players/players.component').then(m => m.PlayersComponent) },
      { path: 'matches', loadComponent: () => import('./admin/matches/matches.component').then(m => m.MatchesComponent) },
      { path: 'lineups', loadComponent: () => import('./admin/lineups/lineups.component').then(m => m.LineupsComponent) },
      { path: 'player-stats', loadComponent: () => import('./admin/player-stats/player-stats.component').then(m => m.PlayerStatsComponent) },
      { path: 'team-stats', loadComponent: () => import('./admin/team-stats/team-stats.component').then(m => m.TeamStatsComponent) },
      { path: 'player-teams', loadComponent: () => import('./admin/player-teams/player-teams.component').then(m => m.PlayerTeamsComponent) },
      { path: 'articles', loadComponent: () => import('./admin/articles/articles.component').then(m => m.ArticlesComponent) },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent) }
];