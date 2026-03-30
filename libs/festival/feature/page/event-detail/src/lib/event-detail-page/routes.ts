import { Route } from '@angular/router';


export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./event-detail.page').then(m => m.EventDetailPage),
  },
];
