import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArtistDetailPageRoutingModule } from './artist-detail-routing.module';

import { ArtistDetailPage } from './artist-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArtistDetailPageRoutingModule
  ],
  declarations: [ArtistDetailPage]
})
export class ArtistDetailPageModule {}
