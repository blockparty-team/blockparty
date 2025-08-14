import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '@blockparty/festival/data-access/state/app-config';
import { DeviceStorageService } from '@blockparty/shared/data-access/device-storage';
import { Capacitor } from '@capacitor/core';
import { AppUpdate, AppUpdateInfo } from '@capawesome/capacitor-app-update';
import { AlertController } from '@ionic/angular/standalone';
import { a } from 'node_modules/@angular/cdk/scrolling-module.d-3Rw5UxLk';

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
    newVersion: AppUpdateInfo['availableVersionCode'];
  }> {
    const platform = Capacitor.getPlatform();
    if (platform === 'web')
      return { isNewVersionAvailable: false, newVersion: undefined };

    const result = await AppUpdate.getAppUpdateInfo();

    return platform === 'android'
      ? {
          isNewVersionAvailable:
            result.currentVersionCode.toString() !==
            result.availableVersionCode?.toString(),
          newVersion: result.availableVersionCode,
        }
      : {
          isNewVersionAvailable:
            result.currentVersionName.toString() !==
            result.availableVersionName?.toString(),
          newVersion: result.availableVersionName,
        };
  }

  public async checkForUpdate(): Promise<void> {
    const { isNewVersionAvailable, newVersion } = await this.appUpdateInfo();
    const skipAppUpdateVersion = await this.deviceStorage.getAsync(
      'skipAppUpdateVersion',
    );

    if (
      !isNewVersionAvailable ||
      newVersion?.toString() === skipAppUpdateVersion.toString()
    )
      return;

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
    alert.onDidDismiss().then(() => {
      this.deviceStorage.set('skipAppUpdateVersion', newVersion);
    });
  }
}
