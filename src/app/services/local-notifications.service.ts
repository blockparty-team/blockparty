import { Injectable } from '@angular/core';
import { ArtistNotification } from '@app/interfaces/favorite-notification';
import { LocalNotifications, LocalNotificationSchema, LocalNotificationDescriptor, PendingResult, ScheduleResult } from '@capacitor/local-notifications';
import { sub } from 'date-fns'

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
    return currentId + 1;
  }

  public async scheduleNotification(artistId: string, title: string, body: string, scheduleAt: Date): Promise<void> {
    this.getNextId().then(id => {
      let notification: LocalNotificationSchema = {
        title: title,
        body: body,
        extra: { id: artistId },
        id: id,
        schedule: { at: scheduleAt }
      }
      LocalNotifications.schedule({ notifications: [notification] });
    })
  }

  public schedule(notifications: LocalNotificationSchema[]): Promise<ScheduleResult> {
    return LocalNotifications.schedule({notifications})
  }

  public async cancelNotification(id: number): Promise<void> {
    await LocalNotifications.cancel({ notifications: [{ id }] });
  }

  public async cancelAllNotifications(): Promise<void> {
    const pending: PendingResult = await LocalNotifications.getPending();
    const cancelIds: LocalNotificationDescriptor[] = pending.notifications
      .map(notification => ({ id: notification.id }));

    LocalNotifications.cancel({ notifications: cancelIds });
  }

  public async getNotificationIdFromArtistId(artistId: string): Promise<number> {
    let id: number;
    id = await LocalNotifications.getPending().then(pending =>
      pending.notifications.map(notification => notification.extra).find(extra => extra.id === artistId));
    return id;
  }

  public artistNotificationPayload(
    artistAct: ArtistNotification,
    id: number,
    minutesBefore: number = 60
  ): LocalNotificationSchema {

    const startTime = new Date(artistAct.startTime);

    return {
      id,
      title: `${artistAct.artistName} is playing in ${minutesBefore} minutes`,
      body: `${artistAct.artistName} is playing at ${artistAct.stageName} stage (${artistAct.eventName} event) at ${startTime.toLocaleTimeString}`,
      schedule: { at: sub(startTime, { minutes: minutesBefore }) }, // Is this taking timezone into account?
      extra: { id: artistAct.artistId },
    }
  }
}
