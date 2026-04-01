import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./partners.page').then((m) => m.PartnersPage),
  },
];
