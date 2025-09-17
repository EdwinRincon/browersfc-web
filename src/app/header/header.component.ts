import { ChangeDetectionStrategy, Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class HeaderComponent implements OnInit {
  protected readonly isMenuOpen = signal(false);
  protected readonly isMobile = signal(false);
  
  // Computed property to determine if mobile menu should be shown
  protected readonly showMobileMenu = computed(() => this.isMobile() && this.isMenuOpen());

  protected toggleMenu(): void {
    this.isMenuOpen.update(isOpen => !isOpen);
  }

  protected onResize(event: Event): void {
    if (!this.isMobile()) {
      this.isMenuOpen.set(false);
    }
    this.checkMobile();
  }

  ngOnInit(): void {
    this.checkMobile();
  }

  private checkMobile(): void {
    this.isMobile.set(window.innerWidth < 640);
  }
}
