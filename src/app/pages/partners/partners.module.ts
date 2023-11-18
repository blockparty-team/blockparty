import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartnersPageRoutingModule } from './partners-routing.module';

import { PartnersPage } from './partners.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PartnersPageRoutingModule,
    PartnersPage
  ]
})
export class PartnersPageModule { }
