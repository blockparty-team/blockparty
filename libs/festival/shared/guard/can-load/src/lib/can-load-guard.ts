import { inject, Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AppConfigService } from '@blockparty/festival/data-access/state/app-config';
import { RouteName } from '@blockparty/festival/shared/types';

@Injectable({
  providedIn: 'root',
})
export class CanLoadLoginGuard {
  private router = inject(Router);
  private enableLogin =
    inject(AppConfigService).appConfig.featureToggle.enableLogin;

  canLoad(route: Route) {
    if (this.enableLogin() === false) {
      switch (route.path) {
        case RouteName.Login:
          this.router.navigate(['tabs', RouteName.Map]);
          return false;
        case RouteName.Profile:
          this.router.navigate(['tabs', RouteName.Map]);
          return false;
      }
    }

    return true;
  }
}
