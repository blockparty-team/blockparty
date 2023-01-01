import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArtistDetailPageRoutingModule } from './artist-detail-routing.module';

import { ArtistDetailPage } from './artist-detail.page';
import { IframeSrcDirective } from '@app/shared/directives/iframe-src.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArtistDetailPageRoutingModule
  ],
  declarations: [ArtistDetailPage, IframeSrcDirective]
})
export class ArtistDetailPageModule {}
