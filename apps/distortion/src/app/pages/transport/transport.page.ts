import { Component, inject } from '@angular/core';
import { RouteHistoryService } from '@blockparty/festival/shared/service/route-history';
import { map } from 'rxjs';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';
import {
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonContent,
  IonText,
  IonButton,
  IonIcon,
  IonToast,
} from '@ionic/angular/standalone';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.page.html',
  styleUrls: ['./transport.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonTitle,
    IonContent,
    IonText,
    IonButton,
    IonIcon,
    IonToast,
  ],
})
export class TransportPage {
  viggoVoucherCode = 'DISTORTION23';

  private routeHistoryService = inject(RouteHistoryService);

  previousRoute = toSignal(
    this.routeHistoryService.history$.pipe(
      map((history) => (history.previous ? history.previous : '/')),
    ),
    { initialValue: '/' },
  );

  onCopyVoucherCode(): void {
    Clipboard.write({ string: this.viggoVoucherCode });
  }

  onGoToViggo(): void {
    Browser.open({ url: 'https://get.viggo.com/distortion' });
  }
}
