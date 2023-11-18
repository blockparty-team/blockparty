import { enableProdMode, importProvidersFrom } from '@angular/core';
import { LottieModule } from 'ngx-lottie';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
// import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';

import { PreloadAllModules, RouteReuseStrategy, provideRouter } from '@angular/router';

import { environment } from '@env/environment';
import { AppComponent } from '@app/app.component';
import { ROUTES } from '@app/app-routes';

export function playerFactory() {
    return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(ROUTES),
        provideIonicAngular({mode: 'md'}),
        importProvidersFrom(
            BrowserModule,
            // IonicModule.forRoot({
            //     mode: 'md'
            // }),
            // AppRoutingModule,
            ServiceWorkerModule.register('ngsw-worker.js', {
                enabled: environment.production,
                // Register the ServiceWorker as soon as the application is stable
                // or after 30 seconds (whichever comes first).
                registrationStrategy: 'registerWhenStable:30000',
            }),
            LottieModule.forRoot({ player: playerFactory })),
        {
            provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy
        },
        provideAnimations(),
    ]
})
    .catch(err => console.log(err));
