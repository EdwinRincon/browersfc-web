import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
  ]
})
export class MaterialModule { }
