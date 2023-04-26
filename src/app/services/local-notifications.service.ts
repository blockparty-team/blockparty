import { Injectable } from '@angular/core';
import {LocalNotifications, ScheduleOptions, LocalNotificationSchema} from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {

  constructor() { }

  public async getNextId(): Promise<number> {
    let currentId: number;
    currentId = await LocalNotifications.getPending().then(pending => {
      return pending.notifications.length > 0 ? Math.max(...pending.notifications.map(notification => notification.id)) : 0
    });
    return currentId+1;
  }

  public async scheduleNotification(artistId: string, title: string, body: string, scheduleAt: Date ): Promise<void> {
    this.getNextId().then(id => {
      let notification: LocalNotificationSchema = {
        title: title,
        body: body,
        extra: {id: artistId},
        id: id,
        schedule: {at: scheduleAt}
      }
      LocalNotifications.schedule({notifications: [notification]});
    })
  }

  public async cancelNotification(id: number): Promise<void> {
    await LocalNotifications.cancel({"notifications": [{"id": id}]});
  }
  
  public async getNotificationIdFromArtistId(artistId: string): Promise<number> {
    let id: number;
    id = await LocalNotifications.getPending().then(pending => 
      pending.notifications.map(notification => notification.extra).find(extra => extra.id === artistId));
    return id;
  }
}
