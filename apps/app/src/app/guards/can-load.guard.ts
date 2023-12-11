import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { RouteName } from '@app/shared/models/routeName';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CanLoadLoginGuard {
  constructor(private router: Router) {}

  canLoad(route: Route) {
    if (environment.featureToggle.enableLogin === false) {
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
