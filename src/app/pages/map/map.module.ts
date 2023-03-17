import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LottieModule } from 'ngx-lottie';

import { MapPage } from './map.page';
import { MapPageRoutingModule } from './map-routing.module';
import { StageTimetableComponent } from '@app/pages/map/feature-info-modal/stage-timetable/stage-timetable.component';
import { FeatureInfoModalComponent } from './feature-info-modal/feature-info-modal.component';
import { AssetComponent } from './feature-info-modal/asset/asset.component';
import { LegendComponent } from './legend/legend.component';
import { SafePipe } from '@app/shared/pipes/safe.pipe';
import { FilterEventModule } from '@app/shared/components/filter-events/filter-event.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MapPageRoutingModule,
    LottieModule,
    FilterEventModule
  ],
  declarations: [
    MapPage,
    FeatureInfoModalComponent,
    StageTimetableComponent,
    AssetComponent,
    LegendComponent,
    SafePipe
  ]
})
export class MapPageModule { }
