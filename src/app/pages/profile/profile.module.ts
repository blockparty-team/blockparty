import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProfilePageRoutingModule,
    ProfilePage
  ]
})
export class ProfilePageModule { }
