import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { isDevMode, LOCALE_ID } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';


const routes: Routes = [
  { path: 'login', loadComponent: () => import('./app/login/login.component').then(m => m.LoginComponent) },
  { path: 'home', loadComponent: () => import('./app/home/home.component').then(m => m.HomeComponent), data: { preload: true } },
  { path: 'team', loadComponent: () => import('./app/team/team.component').then(m => m.TeamComponent) },
  { path: 'player/:id', loadComponent: () => import('./app/player/player.component').then(m => m.PlayerComponent) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', loadComponent: () => import('./app/not-found/not-found.component').then(m => m.NotFoundComponent) }
];

registerLocaleData(localeEs);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es' }
  ]
}).catch(err => console.error(err));
