import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar'
import { Device } from '@capacitor/device';
import { OneSignal } from 'onesignal-ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(
    private oneSignal: OneSignal
  ) { }

  ngOnInit(): void {
    Device.getInfo().then(info => {
      if (info.platform !== 'web') {
        StatusBar.setBackgroundColor({ color: '#443f3f' })
      }
    })

    this.oneSignal.init({
      appId: '0ac7afcb-7e95-4642-8d66-f149d173cc5b'
    })
  }
}
