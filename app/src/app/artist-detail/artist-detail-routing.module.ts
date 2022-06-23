import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArtistDetailPage } from './artist-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ArtistDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArtistDetailPageRoutingModule {}
