import { inject, Injectable, isDevMode } from '@angular/core';
import { AppConfigService } from '@blockparty/festival/data-access/state/app-config';
import { Device } from '@capacitor/device';
import OneSignal from 'onesignal-cordova-plugin';
import { OneSignal as OneSignalWeb } from 'onesignal-ngx';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private oneSignalWeb = inject(OneSignalWeb);
  private oneSignalAppId = inject(AppConfigService).appConfig.oneSignalAppId;

  private initOneSignalNative(externalUserId?: string): void {
    OneSignal.initialize(this.oneSignalAppId());

    if (externalUserId) {
      OneSignal.login(externalUserId);
    }

    OneSignal.Notifications.requestPermission(true).then(
      (accepted: boolean) => {
        console.log('User accepted notifications: ' + accepted);
      },
    );
  }

  private initOneSignalWeb(): void {
    if (isDevMode()) return;

    this.oneSignalWeb.init({
      appId: this.oneSignalAppId(),
      allowLocalhostAsSecureOrigin: true,
    });
  }

  public initOneSignal(externalUserId?: string): void {
    Device.getInfo().then((info) => {
      if (info.platform === 'web') {
        this.initOneSignalWeb();
      } else {
        this.initOneSignalNative(externalUserId);
      }
    });
  }
}
