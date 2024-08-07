import { Route } from '@angular/router';
import { RouteName } from '@blockparty/festival/shared/types';

export const ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/routes').then((m) => m.routes),
  },
  {
    path: RouteName.About,
    title: 'About',
    loadChildren: () => import('./pages/about/routes').then((m) => m.routes),
  },
  {
    path: RouteName.Search,
    title: 'Search',
    loadChildren: () =>
      import('@blockparty/festival/feature/page/search').then((m) => m.routes),
  },
];
