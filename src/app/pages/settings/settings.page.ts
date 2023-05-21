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

  getNotifications(): void {
    from(this.localNotificationsService.getAllNotifications()).subscribe(notifications => 
      this._localNotifications$.next(notifications.notifications))
  }

}
