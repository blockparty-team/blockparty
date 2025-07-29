import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit,
  inject,
} from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { Device } from '@capacitor/device';
import { SupabaseService } from '@blockparty/festival/data-access/supabase';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import { RouteHistoryService } from '@blockparty/festival/shared/service/route-history';
import { PushNotificationService } from '@blockparty/festival/shared/service/push-notification';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { NotificationSchedulingService } from '@blockparty/festival/shared/service/notification-scheduling';
import { LocalNotifications } from '@capacitor/local-notifications';
import { RouteName } from '@blockparty/festival/shared/types';
import { icons } from '@blockparty/festival/shared/icons';
import { AppUpdateService } from '@blockparty/festival/shared/service/app-update';
import { RefreshService } from '@blockparty/festival/shared/service/refresh';
import { AppConfigService } from '@blockparty/festival/data-access/state/app-config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonApp, IonRouterOutlet],
  providers: [AppUpdateService],
})
export class AppComponent implements OnInit {
  private zone = inject(NgZone);
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private routeHistoryService = inject(RouteHistoryService);
  private pushNotificationService = inject(PushNotificationService);
  private platform = inject(Platform);
  private notificationSchedulingService = inject(NotificationSchedulingService);
  private appUpdateService = inject(AppUpdateService);
  private refreshService = inject(RefreshService);
  private featureToggle = inject(AppConfigService).appConfig.featureToggle;

  constructor() {
    this.setupAppUrlOpenListener();
    addIcons(icons);
  }

  ngOnInit() {
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
      fadeOutDuration: 300,
    });

    Device.getInfo().then((info) => {
      if (info.platform !== 'web') {
        StatusBar.setBackgroundColor({ color: '#0013C7' });
      }
    });

    Device.getId().then((deviceId) => {
      this.pushNotificationService.initOneSignal(deviceId.identifier);
    });

    this.supabase.authChanges((event, session) => {
      if (event === 'SIGNED_IN') {
        this.supabase.setSession(session);
      } else {
        this.supabase.setSession(null);
      }
    });

    this.notificationSchedulingService.rescheduleAllArtistNotifications();
    this.platform.resume.subscribe(() => {
      this.refreshService.reloadData();
      this.notificationSchedulingService.rescheduleAllArtistNotifications();
    });

    this.routeHistoryService.init();

    // Navigate to artist from local notification
    LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (action) => {
        this.router.navigate([
          'tabs',
          RouteName.Artist,
          action.notification.extra.artistName,
        ]);
      },
    );

    this.appUpdateService.checkForUpdate();
  }

  // Url listener extracting tokens when getting auth redirect on ios/android native
  setupAppUrlOpenListener() {
    App.addListener('appUrlOpen', async (urlData: URLOpenListenerEvent) => {
      const openUrl = urlData.url;

      const slug = openUrl.split('studieby://').pop();

      this.zone.run(() => {
        this.router.navigateByUrl(`/${slug}`, { replaceUrl: true });
      });

      if (this.featureToggle.enableLogin()) {
        const access = openUrl.split('#access_token=').pop().split('&')[0];
        const refresh = openUrl.split('&refresh_token=').pop().split('&')[0];

        if (!access && !refresh) return;

        const { data, error } = await this.supabase.externalSetSession(
          access,
          refresh,
        );
        this.supabase.setSession(data.session);

        this.zone.run(() => {
          this.router.navigateByUrl('/tabs/map', { replaceUrl: true });
        });
      }
    });
  }
}
