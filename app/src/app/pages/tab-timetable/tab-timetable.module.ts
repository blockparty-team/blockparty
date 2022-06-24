import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabTimetablePage } from './tab-timetable.page';

import { TabTimetablePageRoutingModule } from './tab-timetable-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabTimetablePageRoutingModule
  ],
  declarations: [TabTimetablePage]
})
export class TabTimetablePageModule {}
