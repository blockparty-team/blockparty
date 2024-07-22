import { Route } from '@angular/router';
import { TabsPage } from './tabs.page';
import { RouteName } from '@blockparty/festival/shared/types';

export const routes: Route[] = [
  {
    path: RouteName.Tabs,
    component: TabsPage,
    children: [
      {
        path: RouteName.Map,
        title: 'Map',
        loadChildren: () =>
          import('@blockparty/festival/feature/map-page').then((m) => m.routes),
      },
      {
        path: RouteName.Artist,
        title: 'Artist',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('@blockparty/festival/feature/artist-page').then(
                (m) => m.routes,
              ),
          },
          {
            path: ':name',
            loadChildren: () =>
              import('../artist-detail/routes').then((m) => m.routes),
          },
        ],
      },
      {
        path: RouteName.Timetable,
        title: 'Timetable',
        loadChildren: () => import('../timetable/routes').then((m) => m.routes),
      },
      {
        path: RouteName.Favorite,
        loadChildren: () => import('../favorite/routes').then((m) => m.routes),
      },
      {
        path: '',
        redirectTo: '/tabs/map',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/map',
    pathMatch: 'full',
  },
];
