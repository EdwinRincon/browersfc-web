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
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent) }
];