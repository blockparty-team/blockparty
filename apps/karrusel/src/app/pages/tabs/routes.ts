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
          import('@blockparty/festival/feature/page/map').then((m) => m.routes),
      },
      {
        path: RouteName.Artist,
        title: 'Artist',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('@blockparty/festival/feature/page/artist').then(
                (m) => m.routes,
              ),
          },
          {
            path: ':name',
            loadChildren: () =>
              import('@blockparty/festival/feature/page/artist-detail').then(
                (m) => m.routes,
              ),
          },
        ],
      },
      {
        path: RouteName.Timetable,
        title: 'Timetable',
        loadChildren: () =>
          import('@blockparty/festival/feature/page/timetable').then(
            (m) => m.routes,
          ),
      },
      {
        path: RouteName.Favorite,
        loadChildren: () =>
          import('@blockparty/festival/feature/page/favorite').then(
            (m) => m.routes,
          ),
      },
      {
        path: '',
        redirectTo: `/${RouteName.Tabs}/${RouteName.Artist}`,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: `/${RouteName.Tabs}/${RouteName.Artist}`,
    pathMatch: 'full',
  },
];
