import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MaterialModule } from './app/material/material.module';


const routes: Routes = [
  { path: 'login', loadComponent: () => import('./app/login/login.component').then(m => m.LoginComponent) },
  { path: 'home', loadComponent: () => import('./app/home/home.component').then(m => m.HomeComponent), data: { preload: true } },
  { path: 'team', loadComponent: () => import('./app/team/team.component').then(m => m.TeamComponent) },
  { path: 'player/:id', loadComponent: () => import('./app/player/player.component').then(m => m.PlayerComponent) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', loadComponent: () => import('./app/not-found/not-found.component').then(m => m.NotFoundComponent) }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(MaterialModule),
    importProvidersFrom(ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }))
  ]
}).catch(err => console.error(err));
