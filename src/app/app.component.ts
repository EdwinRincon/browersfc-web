import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet]
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  
  // Signal to track current route
  protected readonly currentUrl = signal<string>('');
  
  // Computed to determine if we're on admin route
  protected readonly isAdminRoute = computed(() => this.currentUrl().startsWith('/admin'));

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.url);
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {
    this.authService.init();
  }
}