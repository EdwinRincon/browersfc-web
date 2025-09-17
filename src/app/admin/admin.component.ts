import { Component, ChangeDetectionStrategy, signal, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class AdminComponent implements OnInit, AfterViewInit {
  protected readonly isMobile = signal<boolean>(false);

  constructor(protected readonly authService: AuthService) {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  ngAfterViewInit(): void {
    this.getImgProfile();
  }

  onResize(): void {
    this.checkScreenSize();
  }

  logout(): void {
    this.authService.logout();
  }

  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  protected getImgProfile(): string {
    return this.authService.currentUser()?.img_profile || '';
  }
}