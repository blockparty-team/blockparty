import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GadearmbaandPageRoutingModule } from './gadearmbaand-routing.module';

import { GadearmbaandPage } from './gadearmbaand.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GadearmbaandPageRoutingModule
  ],
  declarations: [GadearmbaandPage]
})
export class GadearmbaandPageModule {}
