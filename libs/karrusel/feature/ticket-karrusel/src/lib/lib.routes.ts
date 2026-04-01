import { Route } from '@angular/router';

export const ticketKarruselRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./ticket-karrusel/ticket-karrusel.component').then(
        (m) => m.TicketKarruselComponent,
      ),
  },
];
