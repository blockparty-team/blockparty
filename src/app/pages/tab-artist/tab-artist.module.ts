import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabArtistPageRoutingModule } from './tab-artist-routing.module';

import { TabArtistPage } from './tab-artist.page';
import { ArtistCardComponent } from './artist-card/artist-card.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TabArtistPageRoutingModule
  ],
  declarations: [TabArtistPage, ArtistCardComponent]
})
export class TabArtistPageModule { }
