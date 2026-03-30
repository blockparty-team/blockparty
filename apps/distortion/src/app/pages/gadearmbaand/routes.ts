import { Route } from '@angular/router';


export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./gadearmbaand.page').then(m => m.GadearmbaandPage),
  },
];
