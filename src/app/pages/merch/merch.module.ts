import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MerchPageRoutingModule } from './merch-routing.module';

import { MerchPage } from './merch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MerchPageRoutingModule,
    MerchPage
  ]
})
export class MerchPageModule { }
