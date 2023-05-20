import { Component, inject } from '@angular/core';
import { RouteHistoryService } from '@app/services/routeHistory.service';
import { map } from 'rxjs';
import { Clipboard } from '@capacitor/clipboard';
import { Device } from '@capacitor/device';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.page.html',
  styleUrls: ['./transport.page.scss'],
})
export class TransportPage {

  viggoVoucherCode = 'distortion2023';

  private routeHistoryService = inject(RouteHistoryService);

  previousRoute$ = this.routeHistoryService.history$.pipe(
    map(history => history.previous ? history.previous : '/')
  );

  onCopyVoucherCode() {
    Clipboard.write({string: this.viggoVoucherCode});
  }

  onGoToViggo() {
    Device.getInfo().then(info => {
      let url: string;

      switch (info.platform) {
        case 'ios':
          url = 'https://apps.apple.com/dk/app/viggo-book-et-lift/id1460781653'
          break;
        case 'android':
          url = 'https://play.google.com/store/apps/details?id=io.viggo.rider'
          break
        default:
          url = 'https://www.viggo.com'
          break;
      }

      Browser.open({url})
    });
  }
}
