import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GadearmbaandPage } from './gadearmbaand.page';

const routes: Routes = [
  {
    path: '',
    component: GadearmbaandPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GadearmbaandPageRoutingModule {}
