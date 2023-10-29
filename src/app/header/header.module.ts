import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HeaderComponent],
  imports: [MaterialModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
