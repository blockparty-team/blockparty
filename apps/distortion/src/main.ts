import { enableProdMode, importProvidersFrom } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideIonicAngular,
  IonicRouteStrategy,
} from '@ionic/angular/standalone';

import { RouteReuseStrategy, provideRouter } from '@angular/router';

import { environment } from '@shared/environments';
import { AppComponent } from '@distortion/app/app.component';
import { ROUTES } from '@distortion/app/routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(ROUTES),
    provideIonicAngular({ mode: 'md' }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAnimations(),
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
  ],
}).catch((err) => console.log(err));
