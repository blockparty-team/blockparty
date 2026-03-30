import { Component, inject } from '@angular/core';
import { LocalNotificationsService } from '@blockparty/festival/shared/service/local-notifications';
import { BehaviorSubject, from } from 'rxjs';
import { LocalNotificationSchema } from '@capacitor/local-notifications';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
  ],
})
export class SettingsPage {
  private localNotificationsService = inject(LocalNotificationsService);

  private _localNotifications$ = new BehaviorSubject<
    LocalNotificationSchema[] | null
  >(null);
  localNotifications = toSignal(this._localNotifications$.asObservable(), {
    initialValue: null,
  });

  setSampleNotification(): void {
    from(
      this.localNotificationsService.schedule([
        {
          id: 100,
          largeIcon: 'ic_launcher',
          smallIcon: 'ic_launcher',
          title: 'Jon Hopkins is playing in ...',
          body: 'Just kidding!',
          schedule: { at: new Date(new Date().getTime() + 10000) },
        },
      ] as LocalNotificationSchema[]),
    );
  }

  getNotifications(): void {
    from(this.localNotificationsService.getAllNotifications()).subscribe(
      (notifications) =>
        this._localNotifications$.next(notifications.notifications),
    );
  }
}
