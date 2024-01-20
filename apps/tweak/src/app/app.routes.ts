import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'event',
    loadComponent: () =>
      import('./pages/event/event.page').then((m) => m.EventPage),
  },
  {
    path: 'day',
    loadComponent: () => import('./pages/day/day.page').then((m) => m.DayPage),
  },
  {
    path: 'stage',
    loadComponent: () =>
      import('./pages/stage/stage.page').then((m) => m.StagePage),
  },
  {
    path: 'artist',
    loadComponent: () =>
      import('./pages/artist/artist.page').then((m) => m.ArtistPage),
  },
  {
    path: 'artist',
    loadComponent: () =>
      import('./pages/artist/artist.page').then((m) => m.ArtistPage),
  },
  {
    path: 'timetable',
    loadComponent: () =>
      import('./pages/timetable/timetable.page').then((m) => m.TimetablePage),
  },
  {
    path: 'asset',
    loadComponent: () =>
      import('./pages/asset/asset.page').then((m) => m.AssetPage),
  },
  {
    path: 'icon',
    loadComponent: () =>
      import('./pages/icon/icon.page').then((m) => m.IconPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
];
