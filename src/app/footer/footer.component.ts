import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FooterComponent {
  currentYear: number;
  constructor() {
    this.currentYear = new Date().getFullYear();
  }
}
