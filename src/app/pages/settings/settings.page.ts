import { Component, OnInit, inject } from '@angular/core';
import { LocalNotificationsService } from '@app/services/local-notifications.service';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { LocalNotifications, LocalNotificationSchema, LocalNotificationDescriptor, PendingResult, ScheduleResult } from '@capacitor/local-notifications';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  private localNotificationsService = inject(LocalNotificationsService);

  private _localNotifications$ = new BehaviorSubject<LocalNotificationSchema[]>(null);
  localNotifications$: Observable<LocalNotificationSchema[]> = this._localNotifications$.asObservable();

  ngOnInit() {
  }

  setSampleNotification(): void {
    from(this.localNotificationsService.schedule([{
       id: 100, 
      largeIcon: "ic_launcher", 
      smallIcon: "ic_launcher", 
      title: "Jon Hopkins is playing in ...", 
      body: "Just kidding!", 
      schedule: { at: new Date(new Date().getTime() + 10000) } 
    }] as LocalNotificationSchema[]))
  }

  getNotifications(): void {
    from(this.localNotificationsService.getAllNotifications()).subscribe(notifications =>
      this._localNotifications$.next(notifications.notifications))
  }

}
