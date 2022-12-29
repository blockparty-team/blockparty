import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar'
import { Device } from '@capacitor/device';
import { OneSignal } from 'onesignal-ngx';
import { environment } from '@env/environment';
import { SupabaseService } from './services/supabase.service';
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { Router } from '@angular/router';
import { RouteHistoryService as RouteHistoryService } from './services/routeHistory.service';

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
    private oneSignal: OneSignal,
    private supabase: SupabaseService,
    private routeHistoryService: RouteHistoryService
  ) {
    this.oneSignal.init({
      appId: environment.oneSignalAppId,
      allowLocalhostAsSecureOrigin: true
    })

    this.setupAppUrlOpenListener();
  }

  ngOnInit(): void {
    Device.getInfo().then(info => {
      if (info.platform !== 'web') {
        StatusBar.setBackgroundColor({ color: '#443f3f' })
      }
    })

    this.supabase.authChanges((event, session) => {
      if (event === 'SIGNED_IN') {
        this.supabase.setSession(session);
      } else {
        this.supabase.setSession(null);
      }
    })

    this.routeHistoryService.init();

  }

  setupAppUrlOpenListener() {
    App.addListener("appUrlOpen", async (urlData: URLOpenListenerEvent) => {
      console.log("       ", urlData);

      const openUrl = urlData.url;
      const access = openUrl.split("#access_token=").pop().split("&")[0];
      const refresh = openUrl.split("&refresh_token=").pop().split("&")[0];

      const {data, error} = await this.supabase.externalSetSession(access, refresh);
      this.supabase.setSession(data.session);

      this.zone.run(() => {
        this.router.navigateByUrl("/tabs/map", { replaceUrl: true });
      });
    });
  }
}
