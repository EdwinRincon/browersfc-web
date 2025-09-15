import { Component } from '@angular/core';

import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  standalone: true,
  imports: [MaterialModule]
})
export class TeamComponent { }
