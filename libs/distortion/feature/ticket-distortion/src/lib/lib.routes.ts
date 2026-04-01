import { Route } from '@angular/router';

export const ticketDistortionRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./ticket-distortion/ticket-distortion.component').then(
        (m) => m.TicketDistortionComponent,
      ),
  },
];
