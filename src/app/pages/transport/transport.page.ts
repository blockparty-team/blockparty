import { Component, inject } from '@angular/core';
import { RouteHistoryService } from '@app/services/routeHistory.service';
import { map } from 'rxjs';
import { Clipboard } from '@capacitor/clipboard';

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
}
