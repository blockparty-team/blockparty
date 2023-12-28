import { enableProdMode, importProvidersFrom } from '@angular/core';
import { LottieModule } from 'ngx-lottie';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideIonicAngular,
  IonicRouteStrategy,
} from '@ionic/angular/standalone';

import { RouteReuseStrategy, provideRouter } from '@angular/router';

import { environment } from '@shared/environments/environment';
import { AppComponent } from '@app/app.component';
import { ROUTES } from '@app/routes';

export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

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
    importProvidersFrom(LottieModule.forRoot({ player: playerFactory })),
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
  ],
}).catch((err) => console.log(err));
