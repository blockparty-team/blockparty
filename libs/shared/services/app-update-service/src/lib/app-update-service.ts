import { inject, Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { AppUpdate } from '@capawesome/capacitor-app-update';
import { AlertController } from '@ionic/angular';

@Injectable()
export class AppUpdateService {
  private alertContoller = inject(AlertController);

  public async getCurrentAppVersion() {
    const result = await AppUpdate.getAppUpdateInfo();
    if (Capacitor.getPlatform() === 'android') {
      return result.currentVersionCode;
    } else {
      return result.currentVersionName;
    }
  }

  public async getAvailableAppVersion() {
    const result = await AppUpdate.getAppUpdateInfo();
    if (Capacitor.getPlatform() === 'android') {
      return result.availableVersionCode;
    } else {
      return result.availableVersionName;
    }
  }

  public async openAppStore() {
    await AppUpdate.openAppStore();
  };

  public async newVersionAvailable(): Promise<boolean> {
    const currentVersion = await this.getCurrentAppVersion();
    const availableVersion = await this.getAvailableAppVersion();

    return currentVersion !== availableVersion;
  }

  public async checkForUpdate(): Promise<void> {
    const newVersionAvailable = await this.newVersionAvailable();

    if (!newVersionAvailable) return;

    const alert = await this.alertContoller.create({
      header: 'Update available',
      message: 'A new version of the app is available. Would you like to update now?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update',
          role: 'confirm',
          handler: () => {
            this.openAppStore();
          }
        }
      ]
    });

    await alert.present();
  }

}
