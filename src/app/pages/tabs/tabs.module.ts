import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { SidebarPage } from './sidebar/sidebar.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TabsPageRoutingModule,
    TabsPage, SidebarPage
  ]
})
export class TabsPageModule { }
