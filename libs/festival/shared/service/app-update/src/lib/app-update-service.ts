import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '@blockparty/festival/data-access/state/app-config';
import { DeviceStorageService } from '@blockparty/shared/data-access/device-storage';
import { Capacitor } from '@capacitor/core';
import { AppUpdate } from '@capawesome/capacitor-app-update';
import { AlertController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {
  private alertContoller = inject(AlertController);
  private deviceStorage = inject(DeviceStorageService);
  private config = inject(AppConfigService).appConfig;

  public async openAppStore() {
    await AppUpdate.openAppStore({ appId: this.config.iosAppId() });
  }

  private async appUpdateInfo(): Promise<{
    isNewVersionAvailable: boolean;
    newVersion: string | undefined;
  }> {
    const platform = Capacitor.getPlatform();
    if (platform === 'web')
      return { isNewVersionAvailable: false, newVersion: undefined };

    const result = await AppUpdate.getAppUpdateInfo();

    return platform === 'android'
      ? {
          isNewVersionAvailable:
            result.currentVersionCode !== result.availableVersionCode,
          newVersion: result.availableVersionCode,
        }
      : {
          isNewVersionAvailable:
            result.currentVersionName !== result.availableVersionName,
          newVersion: result.availableVersionName,
        };
  }

  public async checkForUpdate(): Promise<void> {
    const { isNewVersionAvailable, newVersion } = await this.appUpdateInfo();
    const skipAppUpdateVersion = await this.deviceStorage.getAsync(
      'skipAppUpdateVersion',
    );

    if (!isNewVersionAvailable || newVersion === skipAppUpdateVersion) return;

    const alert = await this.alertContoller.create({
      header: 'Update available',
      message:
        'A new version of the app is available. Would you like to update now?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.deviceStorage.set('skipAppUpdateVersion', newVersion);
          },
        },
        {
          text: 'Update',
          role: 'confirm',
          handler: () => {
            this.openAppStore();
          },
        },
      ],
    });

    await alert.present();
  }
}
