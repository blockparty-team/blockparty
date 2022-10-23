import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MerchPageRoutingModule } from './merch-routing.module';

import { MerchPage } from './merch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MerchPageRoutingModule
  ],
  declarations: [MerchPage]
})
export class MerchPageModule {}
