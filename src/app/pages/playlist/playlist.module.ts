import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaylistPageRoutingModule } from './playlist-routing.module';

import { PlaylistPage } from './playlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PlaylistPageRoutingModule,
    PlaylistPage
  ]
})
export class PlaylistPageModule { }
