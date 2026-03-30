import { Route } from '@angular/router';


export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./favorite.page').then(m => m.FavoritePage),
  },
];
