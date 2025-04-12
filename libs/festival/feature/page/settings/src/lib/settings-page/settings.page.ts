import { Component, OnInit, inject } from '@angular/core';
import { LocalNotificationsService } from '@blockparty/festival/shared/service/local-notifications';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { LocalNotificationSchema } from '@capacitor/local-notifications';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
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

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        IonButton,
        IonItem,
        IonLabel,
    ]
})
export class SettingsPage implements OnInit {
  private localNotificationsService = inject(LocalNotificationsService);

  private _localNotifications$ = new BehaviorSubject<
    LocalNotificationSchema[] | null
  >(null);
  localNotifications$: Observable<LocalNotificationSchema[] | null> =
    this._localNotifications$.asObservable();

  ngOnInit() {}

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
