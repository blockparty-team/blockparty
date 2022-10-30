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
        loadChildren: () => import('../map/map.module').then(m => m.MapPageModule)
      },
      {
        path: 'artist',
        title: 'Artist',
        children: [
          {
            path: '',
            loadChildren: () => import('../artist/artist.module').then(m => m.ArtistPageModule)
          },
          {
            path: ':id',
            loadChildren: () => import('../artist-detail/artist-detail.module').then(m => m.ArtistDetailPageModule)
          }
        ]
      },
      {
        path: 'timetable',
        title: 'Timetable',
        loadChildren: () => import('../timetable/timetable.module').then(m => m.TimetablePageModule)
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
export class TabsPageRoutingModule { }
