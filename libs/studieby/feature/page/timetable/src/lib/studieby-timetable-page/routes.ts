import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./timetable.page').then((m) => m.TimetablePage),
  },
];
