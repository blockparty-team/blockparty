import { Route } from '@angular/router';


export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./login.page').then(m => m.LoginPage),
  },
];
