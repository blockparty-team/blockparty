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
        path: 'artist',
        title: 'Artist',
        loadChildren: () => import('../tab-artist/tab-artist.module').then( m => m.TabArtistPageModule)
      },
      {
        path: 'search',
        title: 'Search',
        loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule)
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
