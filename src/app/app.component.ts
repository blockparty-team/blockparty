import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar'
import { Device } from '@capacitor/device';
import { SupabaseService } from './services/supabase.service';
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import { RouteHistoryService as RouteHistoryService } from './services/routeHistory.service';
import { PushNotificationService } from './services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(
    private zone: NgZone,
    private router: Router,
    private supabase: SupabaseService,
    private routeHistoryService: RouteHistoryService,
    private pushNotificationService: PushNotificationService
  ) {
    this.setupAppUrlOpenListener();
  }

  ngOnInit(): void {

    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
      fadeOutDuration: 300
    });

    Device.getInfo().then(info => {
      if (info.platform !== 'web') {
        StatusBar.setBackgroundColor({ color: '#443f3f' });
      }
    });

    Device.getId().then(deviceId => {
      this.pushNotificationService.initOneSignal(deviceId.uuid);
    })

    this.supabase.authChanges((event, session) => {
      if (event === 'SIGNED_IN') {
        this.supabase.setSession(session);
      } else {
        this.supabase.setSession(null);
      }
    });

    this.routeHistoryService.init();
  }

  // Url listener extracting tokens when getting auth redirect on ios/android native 
  setupAppUrlOpenListener() {
    App.addListener("appUrlOpen", async (urlData: URLOpenListenerEvent) => {
      const openUrl = urlData.url;
      const access = openUrl.split("#access_token=").pop().split("&")[0];
      const refresh = openUrl.split("&refresh_token=").pop().split("&")[0];

      const { data, error } = await this.supabase.externalSetSession(access, refresh);
      this.supabase.setSession(data.session);

      this.zone.run(() => {
        this.router.navigateByUrl("/tabs/map", { replaceUrl: true });
      });
    });
  }
}
