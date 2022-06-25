import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StageTimetableModalPageRoutingModule } from './stage-timetable-modal-routing.module';

import { StageTimetableModalPage } from './stage-timetable-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StageTimetableModalPageRoutingModule
  ],
  declarations: [StageTimetableModalPage]
})
export class StageTimetableModalPageModule {}
