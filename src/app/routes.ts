import { Route } from '@angular/router';
import { RouteName } from '@app/shared/models/routeName';
import { CanLoadLoginGuard } from '@app/guards/can-load.guard';

export const ROUTES: Route[] = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/routes').then(m => m.routes)
  },
  {
    path: RouteName.Partners,
    title: 'Partners',
    loadChildren: () => import('./pages/partners/partners.module').then(m => m.PartnersPageModule)
  },
  {
    path: RouteName.Login,
    title: 'Login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [CanLoadLoginGuard]
  },
  {
    path: RouteName.Profile,
    title: 'Profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canLoad: [CanLoadLoginGuard]
  },
  {
    path: RouteName.About,
    title: 'About',
    loadChildren: () => import('./pages/about/routes').then(m => m.routes)
  },
  {
    path: RouteName.Event,
    title: 'Events',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/event/routes').then(m => m.routes)
      },
      {
        path: ':id',
        loadChildren: () => import('./pages/event-detail/routes').then(m => m.routes)
      }
    ]
  },
  {
    path: RouteName.Playlists,
    title: 'Playlists',
    loadChildren: () => import('./pages/playlist/playlist.module').then(m => m.PlaylistPageModule)
  },
  {
    path: RouteName.Settings,
    title: 'Settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: RouteName.Merch,
    title: 'Merch',
    loadChildren: () => import('./pages/merch/merch.module').then(m => m.MerchPageModule)
  },
  {
    path: RouteName.Tickets,
    title: 'Tickets',
    loadChildren: () => import('./pages/tickets/routes').then(m => m.routes)
  },
  {
    path: RouteName.Search,
    title: 'Search',
    loadChildren: () => import('./pages/search/routes').then(m => m.routes)
  },
  {
    path: RouteName.Transport,
    title: 'transport',
    loadChildren: () => import('./pages/transport/transport.module').then(m => m.TransportPageModule)
  },
  {
    path: RouteName.Gadearmbaand,
    loadChildren: () => import('./pages/gadearmbaand/routes').then(m => m.routes)
  },
];