import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { ArtistItemComponent } from './artist-item/artist-item.component';
import { EventItemComponent } from './event-item/event-item.component';
import { StageItemComponent } from './stage-item/stage-item.component';
import { AssetItemComponent } from './asset-item/asset-item.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SearchPageRoutingModule
  ],
  declarations: [
    SearchPage,
    ArtistItemComponent,
    EventItemComponent,
    StageItemComponent,
    AssetItemComponent
  ]
})
export class SearchPageModule {}
