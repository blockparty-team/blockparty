import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CanLoadLoginGuard } from './guards/can-load.guard';
import { RouteName } from './shared/models/routeName';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
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
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: RouteName.Event,
    title: 'Events',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/event/event.module').then(m => m.EventPageModule)
      },
      {
        path: ':id',
        loadChildren: () => import('./pages/event-detail/event-detail.module').then(m => m.EventDetailPageModule)
      }
    ]
  },
  {
    path: RouteName.Playlists,
    loadChildren: () => import('./pages/playlist/playlist.module').then(m => m.PlaylistPageModule)
  },
  {
    path: RouteName.Settings,
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'merch',
    loadChildren: () => import('./pages/merch/merch.module').then(m => m.MerchPageModule)
  },
  {
    path: RouteName.Tickets,
    loadChildren: () => import('./pages/tickets/tickets.module').then(m => m.TicketsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
