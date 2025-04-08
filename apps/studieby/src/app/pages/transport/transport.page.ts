import { Component, inject } from '@angular/core';
import { RouteHistoryService } from '@blockparty/festival/shared/service/route-history';
import { map } from 'rxjs';
import { Browser } from '@capacitor/browser';
import { AsyncPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonContent,
  IonText,
} from '@ionic/angular/standalone';

@Component({
    selector: 'app-transport',
    templateUrl: './transport.page.html',
    styleUrls: ['./transport.page.scss'],
    imports: [
        AsyncPipe,
        IonHeader,
        IonToolbar,
        IonBackButton,
        IonTitle,
        IonContent,
        IonText,
    ]
})
export class TransportPage {
  private routeHistoryService = inject(RouteHistoryService);

  previousRoute$ = this.routeHistoryService.history$.pipe(
    map((history) => (history.previous ? history.previous : '/')),
  );

  onGoToUrl(url: string) {
    Browser.open({ url });
  }
}
