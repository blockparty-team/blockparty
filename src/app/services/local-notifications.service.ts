import { Injectable } from '@angular/core';
import {LocalNotifications, ScheduleOptions, LocalNotificationSchema} from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {

  constructor() { }

  public scheduleNotification(externalId: string, payload: string): void {
    var notification: LocalNotificationSchema = {
      title: "HEY",
      body: "Message",
      id: 1
    }

    LocalNotifications.schedule({notifications: [notification]});
  }

  public unscheduleNotification(externalId: string): void {

  }
}
