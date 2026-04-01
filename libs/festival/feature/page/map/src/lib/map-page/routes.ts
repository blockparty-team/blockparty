import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./map.page').then((m) => m.MapPage),
  },
];
