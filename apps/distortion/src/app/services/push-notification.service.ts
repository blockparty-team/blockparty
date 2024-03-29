import { inject, Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { environment } from '@shared/environments';
import OneSignal from 'onesignal-cordova-plugin';
import { OneSignal as OneSignalWeb } from 'onesignal-ngx';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private oneSignalWeb = inject(OneSignalWeb);

  private initOneSignalNative(externalUserId?: string): void {
    OneSignal.initialize(environment.oneSignalAppId);

    if (externalUserId) {
      OneSignal.login(externalUserId);
    }

    OneSignal.Notifications.requestPermission(true).then((accepted: boolean) => {
      console.log("User accepted notifications: " + accepted);
    });
  }

  private initOneSignalWeb(): void {
    this.oneSignalWeb.init({
      appId: environment.oneSignalAppId,
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
