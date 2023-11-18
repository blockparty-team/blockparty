import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketsPageRoutingModule } from './tickets-routing.module';

import { TicketsPage } from './tickets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TicketsPageRoutingModule,
    TicketsPage
  ]
})
export class TicketsPageModule { }
