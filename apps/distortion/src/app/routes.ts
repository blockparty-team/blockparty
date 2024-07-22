import { Route } from '@angular/router';
import { RouteName } from '@blockparty/festival/shared/types';
import { CanLoadLoginGuard } from '@blockparty/festival/shared/guard/can-load';

export const ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/routes').then((m) => m.routes),
  },
  {
    path: RouteName.Partners,
    title: 'Partners',
    loadChildren: () => import('./pages/partners/routes').then((m) => m.routes),
  },
  {
    path: RouteName.Login,
    title: 'Login',
    loadChildren: () => import('./pages/login/routes').then((m) => m.routes),
    canLoad: [CanLoadLoginGuard],
  },
  {
    path: RouteName.Profile,
    title: 'Profile',
    loadChildren: () => import('./pages/profile/routes').then((m) => m.routes),
    canLoad: [CanLoadLoginGuard],
  },
  {
    path: RouteName.About,
    title: 'About',
    loadChildren: () => import('./pages/about/routes').then((m) => m.routes),
  },
  {
    path: RouteName.Event,
    title: 'Events',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@blockparty/festival/feature/page/event').then(
            (m) => m.routes,
          ),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('@blockparty/festival/feature/page/event-detail').then(
            (m) => m.routes,
          ),
      },
    ],
  },
  {
    path: RouteName.Settings,
    title: 'Settings',
    loadChildren: () => import('./pages/settings/routes').then((m) => m.routes),
  },
  {
    path: RouteName.Tickets,
    title: 'Tickets',
    loadChildren: () =>
      import('@blockparty/festival/feature/page/ticket').then((m) => m.routes),
  },
  {
    path: RouteName.Search,
    title: 'Search',
    loadChildren: () =>
      import('@blockparty/festival/feature/page/search').then((m) => m.routes),
  },
  {
    path: RouteName.Transport,
    title: 'transport',
    loadChildren: () =>
      import('./pages/transport/routes').then((m) => m.routes),
  },
  {
    path: RouteName.Gadearmbaand,
    loadChildren: () =>
      import('./pages/gadearmbaand/routes').then((m) => m.routes),
  },
];
