import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StageTimetableModalPage } from './stage-timetable-modal.page';

const routes: Routes = [
  {
    path: '',
    component: StageTimetableModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StageTimetableModalPageRoutingModule {}
