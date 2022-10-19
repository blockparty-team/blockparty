import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar'
import { Device } from '@capacitor/device';
import { OneSignal } from 'onesignal-ngx';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(
    private oneSignal: OneSignal
  ) {
    this.oneSignal.init({
      appId: environment.oneSignalAppId,
      allowLocalhostAsSecureOrigin: true
    })
  }

  ngOnInit(): void {
    Device.getInfo().then(info => {
      if (info.platform !== 'web') {
        StatusBar.setBackgroundColor({ color: '#443f3f' })
      }
    })
  }
}
