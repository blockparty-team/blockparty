import { inject, Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { AppUpdate } from '@capawesome/capacitor-app-update';
import { AlertController } from '@ionic/angular';

@Injectable()
export class AppUpdateService {
  private alertContoller = inject(AlertController);

  public async openAppStore() {
    await AppUpdate.openAppStore();
  }

  private async newVersionAvailable(): Promise<boolean> {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') return false;

    const result = await AppUpdate.getAppUpdateInfo();

    return platform === 'android'
      ? result.currentVersionCode !== result.availableVersionCode
      : result.currentVersionName !== result.availableVersionName;
  }

  public async checkForUpdate(): Promise<void> {
    const newVersionAvailable = await this.newVersionAvailable();

    if (!newVersionAvailable) return;

    const alert = await this.alertContoller.create({
      header: 'Update available',
      message:
        'A new version of the app is available. Would you like to update now?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
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
