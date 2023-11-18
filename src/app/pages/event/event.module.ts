import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventPageRoutingModule } from './event-routing.module';

import { EventPage } from './event.page';
import { EventCardComponent } from './event-card/event-card.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        EventPageRoutingModule,
        EventPage,
        EventCardComponent
    ]
})
export class EventPageModule { }
