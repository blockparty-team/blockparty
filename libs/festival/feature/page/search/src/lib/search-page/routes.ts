import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./search.page').then((m) => m.SearchPage),
  },
];
