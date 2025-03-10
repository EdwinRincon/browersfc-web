import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent implements OnInit{
  isMenuOpen = false;
  isMobile = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (!this.isMobile) {
      this.isMenuOpen = false;
    }
    this.checkMobile();
  }

  ngOnInit(): void {
    this.checkMobile();
  }

  checkMobile(): void {
    this.isMobile = window.innerWidth < 640;
  }

}
