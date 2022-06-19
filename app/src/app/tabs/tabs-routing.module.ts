import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'map',
        title: 'Map',
        loadChildren: () => import('../tab-map/tab-map.module').then(m => m.TabMapPageModule)
      },
      {
        path: 'timetable',
        title: 'Timetable',
        loadChildren: () => import('../tab-timetable/tab-timetable.module').then(m => m.TabTimetablePageModule)
      },
      {
        path: 'favorites',
        title: 'Favorites',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/map',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/map',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
