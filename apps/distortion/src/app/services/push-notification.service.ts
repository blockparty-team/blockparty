import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { environment } from '@shared/environments';
import OneSignal from 'onesignal-cordova-plugin';
import { OneSignal as OneSignalWeb } from 'onesignal-ngx';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(private oneSignalWeb: OneSignalWeb) {}

  private initOneSignalNative(externalUserId?: string): void {
    OneSignal.setAppId(environment.oneSignalAppId);

    if (externalUserId) {
      OneSignal.setExternalUserId(externalUserId);
    }

    OneSignal.setNotificationOpenedHandler((jsonData) => {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });

    OneSignal.promptForPushNotificationsWithUserResponse((accepted) => {
      console.log('User accepted notifications: ' + accepted);
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
