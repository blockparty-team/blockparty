import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabMapPage } from './tab-map.page';

import { TabMapPageRoutingModule } from './tab-map-routing.module';
import { MapComponent } from './map/map.component';
import { StageTimetableComponent } from '@app/pages/tab-map/feature-info-modal/stage-timetable/stage-timetable.component';
import { FeatureInfoModalComponent } from './feature-info-modal/feature-info-modal.component';
import { AssetComponent } from './feature-info-modal/asset/asset.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabMapPageRoutingModule
  ],
  declarations: [TabMapPage, MapComponent, FeatureInfoModalComponent, StageTimetableComponent, AssetComponent]
})
export class TabMapPageModule {}
