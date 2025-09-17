import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { isDevMode, LOCALE_ID } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/services/auth/auth.interceptor';
import { AdminGuard } from './app/services/auth/auth.guard';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';


const routes: Routes = [
  { path: 'login', loadComponent: () => import('./app/login/login.component').then(m => m.LoginComponent) },
  { path: 'home', loadComponent: () => import('./app/home/home.component').then(m => m.HomeComponent), data: { preload: true } },
  { path: 'team', loadComponent: () => import('./app/team/team.component').then(m => m.TeamComponent) },
  { path: 'player/:id', loadComponent: () => import('./app/player/player.component').then(m => m.PlayerComponent) },
  { 
    path: 'admin', 
    loadComponent: () => import('./app/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AdminGuard],
    children: [
      { path: 'users', loadComponent: () => import('./app/admin/users/users.component').then(m => m.UsersComponent) },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', loadComponent: () => import('./app/not-found/not-found.component').then(m => m.NotFoundComponent) }
];

registerLocaleData(localeEs);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: LOCALE_ID, useValue: 'es' }
  ]
}).catch(err => console.error(err));
