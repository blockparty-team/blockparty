import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./about.page').then((m) => m.AboutPage),
  },
];
