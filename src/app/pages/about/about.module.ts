import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AboutPageRoutingModule } from './about-routing.module';

import { AboutPage } from './about.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AboutPageRoutingModule,
    AboutPage
  ]
})
export class AboutPageModule { }
