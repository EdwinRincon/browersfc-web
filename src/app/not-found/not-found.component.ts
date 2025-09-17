import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {}
