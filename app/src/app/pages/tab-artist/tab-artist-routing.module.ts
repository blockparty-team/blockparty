import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabArtistPage } from './tab-artist.page';

const routes: Routes = [
  {
    path: '',
    component: TabArtistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabArtistPageRoutingModule {}
