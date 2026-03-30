import { Route } from '@angular/router';


export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./tickets.page').then(m => m.TicketsPage),
  },
];
