import { Component, inject } from '@angular/core';
import { RouteHistoryService } from '@app/services/routeHistory.service';
import { map } from 'rxjs';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.page.html',
  styleUrls: ['./transport.page.scss'],
})
export class TransportPage {

  viggoVoucherCode = 'DISTORTION23';

  private routeHistoryService = inject(RouteHistoryService);

  previousRoute$ = this.routeHistoryService.history$.pipe(
    map(history => history.previous ? history.previous : '/')
  );

  onCopyVoucherCode() {
    Clipboard.write({ string: this.viggoVoucherCode });
  }

  onGoToViggo() {
    Browser.open({ url: 'https://get.viggo.com/distortion' });
  }
}
