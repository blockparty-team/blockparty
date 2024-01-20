import { Injectable, inject } from '@angular/core';
import {
  AlertController,
  ToastController,
  ToastOptions,
} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  public async confirmAlert(message: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              resolve(false);
            },
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }

  public async showToast(options: ToastOptions): Promise<void> {
    const defaultOptions: Partial<ToastOptions> = {
      position: 'top',
      positionAnchor: 'header',
      duration: 5000,
      buttons: ['OK'],
      ...options,
    };

    const toast = await this.toastController.create(defaultOptions);
    toast.present();
  }
}
