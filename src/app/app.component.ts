import { ChangeDetectionStrategy, Component, NgZone, OnInit, inject } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar'
import { Device } from '@capacitor/device';
import { SupabaseService } from './services/supabase.service';
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import { RouteHistoryService as RouteHistoryService } from './services/routeHistory.service';
import { PushNotificationService } from './services/push-notification.service';
// import { IonicModule } from '@ionic/angular';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { NotificationSchedulingService } from './services/notification-scheduling.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { RouteName } from '@app/shared/models/routeName';
import { environment } from '@env/environment';
import { icons } from '@app/shared/icons';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ IonApp, IonRouterOutlet]
})
export class AppComponent implements OnInit {

  private zone = inject(NgZone);
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private routeHistoryService = inject(RouteHistoryService);
  private pushNotificationService = inject(PushNotificationService);
  private platform = inject(Platform);
  private notificationSchedulingService = inject(NotificationSchedulingService);

  constructor() {
    this.setupAppUrlOpenListener();
    addIcons(icons)
  }

  ngOnInit(): void {

    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
      fadeOutDuration: 300
    });

    Device.getInfo().then(info => {
      if (info.platform !== 'web') {
        StatusBar.setBackgroundColor({ color: '#2d2439' });
      }
    });

    Device.getId().then(deviceId => {
      this.pushNotificationService.initOneSignal(deviceId.identifier);
    })

    this.supabase.authChanges((event, session) => {
      if (event === 'SIGNED_IN') {
        this.supabase.setSession(session);
      } else {
        this.supabase.setSession(null);
      }
    });

    this.notificationSchedulingService.rescheduleAllArtistNotifications();
    this.platform.resume.subscribe(() => this.notificationSchedulingService.rescheduleAllArtistNotifications());

    this.routeHistoryService.init();

    // Navigate to artist from local notification
    LocalNotifications.addListener('localNotificationActionPerformed', action => {
      this.router.navigate(['tabs', RouteName.Artist, action.notification.extra.artistName]);
    });
  }

  // Url listener extracting tokens when getting auth redirect on ios/android native 
  setupAppUrlOpenListener() {
    App.addListener("appUrlOpen", async (urlData: URLOpenListenerEvent) => {
      const openUrl = urlData.url;

      // url scheme "distortion://" is used for native app.  
      const slug = openUrl.split('distortion://').pop()

      this.zone.run(() => {
        this.router.navigateByUrl(`/${slug}`, { replaceUrl: true });
      });

      if (environment.featureToggle.enableLogin) {
        const access = openUrl.split("#access_token=").pop().split("&")[0];
        const refresh = openUrl.split("&refresh_token=").pop().split("&")[0];
  
        if (!access && !refresh) return;
        
        const { data, error } = await this.supabase.externalSetSession(access, refresh);
        this.supabase.setSession(data.session);
  
        this.zone.run(() => {
          this.router.navigateByUrl("/tabs/map", { replaceUrl: true });
        });
      }
    });
  }
}
