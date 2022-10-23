import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MerchPage } from './merch.page';

const routes: Routes = [
  {
    path: '',
    component: MerchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchPageRoutingModule {}
