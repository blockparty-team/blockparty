import { Route } from '@angular/router';
import { RouteName } from '@distortion/app/shared/models/routeName';
import { CanLoadLoginGuard } from '@distortion/app/guards/can-load.guard';

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
          import('./pages/event/routes').then((m) => m.routes),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./pages/event-detail/routes').then((m) => m.routes),
      },
    ],
  },
  {
    path: RouteName.Playlists,
    title: 'Playlists',
    loadChildren: () => import('./pages/playlist/routes').then((m) => m.routes),
  },
  {
    path: RouteName.Settings,
    title: 'Settings',
    loadChildren: () => import('./pages/settings/routes').then((m) => m.routes),
  },
  {
    path: RouteName.Merch,
    title: 'Merch',
    loadChildren: () => import('./pages/merch/routes').then((m) => m.routes),
  },
  {
    path: RouteName.Tickets,
    title: 'Tickets',
    loadChildren: () => import('./pages/tickets/routes').then((m) => m.routes),
  },
  {
    path: RouteName.Search,
    title: 'Search',
    loadChildren: () => import('./pages/search/routes').then((m) => m.routes),
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
