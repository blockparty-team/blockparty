import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    title: 'Event',
    loadComponent: () => import('./event.page').then((m) => m.EventPage),
  },
];
