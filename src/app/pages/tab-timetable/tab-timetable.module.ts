import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabTimetablePage } from './tab-timetable.page';

import { TabTimetablePageRoutingModule } from './tab-timetable-routing.module';
import { TimetableGanttComponent } from './timetable-gantt/timetable-gantt.component';
import { TimetableListComponent } from './timetable-list/timetable-list.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabTimetablePageRoutingModule
  ],
  declarations: [
    TabTimetablePage, 
    TimetableGanttComponent,
    TimetableListComponent
  ]
})
export class TabTimetablePageModule {}
