import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventPage } from './event.page';

const routes: Routes = [
  {
    path: '',
    title: 'Event',
    component: EventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventPageRoutingModule {}
