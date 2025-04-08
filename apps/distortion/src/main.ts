import { isDevMode, inject, provideAppInitializer } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideIonicAngular,
  IonicRouteStrategy,
} from '@ionic/angular/standalone';

import { RouteReuseStrategy, provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { ROUTES } from './app/routes';
import { AppConfigService } from '@blockparty/festival/data-access/state/app-config';

function configFactory(configService: AppConfigService): () => void {
  return () => configService.appConfig$;
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(ROUTES),
    provideIonicAngular({ mode: 'md' }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAnimations(),
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    provideAppInitializer(() => {
        const initializerFn = (configFactory)(inject(AppConfigService));
        return initializerFn();
      }),
  ],
}).catch((err) => console.log(err));
