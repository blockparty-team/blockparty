import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritePageRoutingModule } from './favorite-routing.module';

import { FavoritePage } from './favorite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FavoritePageRoutingModule,
    FavoritePage
  ]
})
export class FavoritePageModule { }
