import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { RouteName } from '@app/shared/models/routeName';

const routes: Routes = [
  {
    path: RouteName.Tabs,
    component: TabsPage,
    children: [
      {
        path: RouteName.Artist,
        title: 'Artist',
        children: [
          {
            path: '',
            loadChildren: () => import('../artist/artist.module').then(m => m.ArtistPageModule)
          },
          {
            path: ':name',
            loadChildren: () => import('../artist-detail/artist-detail.module').then(m => m.ArtistDetailPageModule)
          }
        ]
      },
      {
        path: RouteName.Timetable,
        title: 'Timetable',
        loadChildren: () => import('../timetable/timetable.module').then(m => m.TimetablePageModule)
      },
      {
        path: RouteName.Favorite,
        loadChildren: () => import('../favorite/favorite.module').then( m => m.FavoritePageModule)
      },
      {
        path: RouteName.Map,
        title: 'Map',
        loadChildren: () => import('../map/map.module').then(m => m.MapPageModule)
      },
      {
        path: '',
        redirectTo: RouteName.Artist,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: RouteName.Tabs,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
