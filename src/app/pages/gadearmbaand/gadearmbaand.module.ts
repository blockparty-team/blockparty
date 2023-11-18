import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GadearmbaandPageRoutingModule } from './gadearmbaand-routing.module';

import { GadearmbaandPage } from './gadearmbaand.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GadearmbaandPageRoutingModule,
    GadearmbaandPage
  ]
})
export class GadearmbaandPageModule { }
