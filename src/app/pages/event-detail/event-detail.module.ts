import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventDetailPageRoutingModule } from './event-detail-routing.module';

import { EventDetailPage } from './event-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EventDetailPageRoutingModule,
    EventDetailPage
  ]
})
export class EventDetailPageModule { }
