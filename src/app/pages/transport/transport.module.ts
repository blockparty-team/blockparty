import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransportPageRoutingModule } from './transport-routing.module';

import { TransportPage } from './transport.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TransportPageRoutingModule,
    TransportPage
  ]
})
export class TransportPageModule { }
