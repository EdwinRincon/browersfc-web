import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';

import { AuthService } from '../services/auth/auth.service';
import { MaterialModule } from '../material/material.module';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    MaterialModule
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class AdminComponent implements OnInit {
  protected readonly isMobile = signal<boolean>(false);

  constructor(protected readonly authService: AuthService) {}

  ngOnInit(): void {
    this.checkScreenSize();
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