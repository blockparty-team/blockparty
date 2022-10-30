import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArtistPage } from './artist.page';

const routes: Routes = [
  {
    path: '',
    component: ArtistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArtistPageRoutingModule {}
