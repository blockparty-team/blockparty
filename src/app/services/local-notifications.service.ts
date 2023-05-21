import { Injectable } from '@angular/core';
import { ArtistNotification } from '@app/interfaces/favorite-notification';
import { LocalNotifications, LocalNotificationSchema, LocalNotificationDescriptor, PendingResult, ScheduleResult, ScheduleOptions } from '@capacitor/local-notifications';
import { sub, add } from 'date-fns'

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

  public async schedule(notifications: LocalNotificationSchema[]): Promise<ScheduleResult> {
    console.log("Scheduling: ", {notifications: notifications} as ScheduleOptions)
    
    return await LocalNotifications.schedule({notifications: notifications})
  }

  public async getAllNotifications(): Promise<PendingResult> {
    const pending: PendingResult = await LocalNotifications.getPending();
    return pending;
  }

  public async cancelNotification(id: number): Promise<void> {
    await LocalNotifications.cancel({ notifications: [{ id }] });
  }

  public async cancelAllNotifications(minutesBefore: number = 60): Promise<void> {

    // const now = new Date();
    // const pending: PendingResult = await LocalNotifications.getPending();
    // const cancelIds: LocalNotificationDescriptor[] = pending.notifications
    //   // Find non-exceeded pending notifications 
    //   .filter(notification => sub(notification.schedule.at, { minutes: minutesBefore }) >= now)
    //   .map(notification => ({ id: notification.id }));
    // console.log("Cancelling: ", cancelIds)

    // if (cancelIds.length > 0) LocalNotifications.cancel({ notifications: cancelIds });
    let pending = await LocalNotifications.getPending()
    await LocalNotifications.cancel({
        notifications: pending.notifications})
  }

  public async getNotificationIdFromArtistId(artistId: string): Promise<number | null> {
    return LocalNotifications.getPending().then(pending => {
      let notification = pending.notifications.find(notification => notification.extra.id === artistId);
      if (!!notification) {
        return notification.id;
      }
    })
    }

  public artistNotificationPayload(
    id: number,
    artistAct: ArtistNotification,
    minutesBefore: number = 60
  ): LocalNotificationSchema {

    const startTime = new Date(artistAct.startTime);
    return {
      id,
      title: `${artistAct.artistName} is playing in ${minutesBefore} minutes`,
      body: `${artistAct.artistName} is playing at ${artistAct.stageName} stage (${artistAct.eventName} event) at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      schedule: { at: sub(startTime, { minutes: minutesBefore }) },
      extra: { id: artistAct.artistId, artistName: artistAct.artistName },
    }
  }
}
