import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterEventsComponent } from './filter-events.component';


@NgModule({
  declarations: [
    FilterEventsComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    FilterEventsComponent
  ]
})
export class FilterEventsModule { }
