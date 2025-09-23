import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { UpdateService } from './services/update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet]
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  // Force the UpdateService to be instantiated at app start so it can listen for SW updates
  private readonly updateService = inject(UpdateService, { optional: true });
  
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
     this.updateService?.initialize();
  }
}