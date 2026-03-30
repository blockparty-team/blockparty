import { Route } from '@angular/router';


export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./artist.page').then(m => m.ArtistPage),
  },
];
