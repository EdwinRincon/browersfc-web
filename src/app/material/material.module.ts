import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
  ]
})
export class MaterialModule { }
