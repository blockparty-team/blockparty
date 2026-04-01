import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./settings.page').then((m) => m.SettingsPage),
  },
];
