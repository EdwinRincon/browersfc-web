import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
  ]
})
export class MaterialModule { }
