import { Route } from '@angular/router';


export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./transport.page').then(m => m.TransportPage),
  },
];
