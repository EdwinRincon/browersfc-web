import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  imports: [MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamComponent {}
