import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabMapPage } from './tab-map.page';

import { TabMapPageRoutingModule } from './tab-map-routing.module';
import { MapComponent } from './map/map.component';
import { StageTimetableModalComponent } from '@app/components/stage-timetable-modal/stage-timetable-modal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabMapPageRoutingModule
  ],
  declarations: [TabMapPage, MapComponent, StageTimetableModalComponent]
})
export class TabMapPageModule {}
