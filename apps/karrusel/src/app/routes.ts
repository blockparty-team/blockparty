import { Route } from '@angular/router';
import { RouteName } from '@blockparty/festival/shared/types';
import { CanLoadLoginGuard } from '@blockparty/festival/shared/guard/can-load';

export const ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/routes').then((m) => m.routes),
  },
  {
    path: RouteName.Login,
    title: 'Login',
    loadChildren: () =>
      import('@blockparty/festival/feature/page/login').then((m) => m.routes),
    canLoad: [CanLoadLoginGuard],
  },
  {
    path: RouteName.Profile,
    title: 'Profile',
    loadChildren: () =>
      import('@blockparty/festival/feature/page/profile').then((m) => m.routes),
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
    loadChildren: () =>
      import('@blockparty/festival/feature/page/settings').then(
        (m) => m.routes,
      ),
  },
  {
    path: RouteName.Tickets,
    title: 'Tickets',
    loadChildren: () =>
      import('@blockparty/karrusel/feature/ticket-karrusel').then(
        (m) => m.ticketKarruselRoutes,
      ),
  },
  {
    path: RouteName.Search,
    title: 'Search',
    loadChildren: () =>
      import('@blockparty/festival/feature/page/search').then((m) => m.routes),
  },
];
