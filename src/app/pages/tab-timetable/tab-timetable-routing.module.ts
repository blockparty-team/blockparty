import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabTimetablePage } from './tab-timetable.page';

const routes: Routes = [
  {
    path: '',
    component: TabTimetablePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabTimetablePageRoutingModule {}
