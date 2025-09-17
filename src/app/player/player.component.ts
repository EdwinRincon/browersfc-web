import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  imports: [CommonModule, MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent {}
