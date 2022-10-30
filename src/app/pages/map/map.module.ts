import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapPage } from './map.page';

import { MapPageRoutingModule } from './map-routing.module';
import { StageTimetableComponent } from '@app/pages/map/feature-info-modal/stage-timetable/stage-timetable.component';
import { FeatureInfoModalComponent } from './feature-info-modal/feature-info-modal.component';
import { AssetComponent } from './feature-info-modal/asset/asset.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MapPageRoutingModule
  ],
  declarations: [
    MapPage,
    FeatureInfoModalComponent,
    StageTimetableComponent,
    AssetComponent
  ]
})
export class MapPageModule { }
