import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterEventsComponent } from './filter-events.component';


@NgModule({
  declarations: [
    FilterEventsComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [
    FilterEventsComponent
  ]
})
export class FilterEventModule { }
