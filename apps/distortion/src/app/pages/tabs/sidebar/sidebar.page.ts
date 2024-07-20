import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@distortion/app/services/auth.service';
import { MenuController } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { environment } from '@shared/environments';
import { RouteName } from '@blockparty/festival/types';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonFooter,
} from '@ionic/angular/standalone';

interface NavigationItem {
  name: string;
  icon: string;
  routeName: RouteName;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.page.html',
  styleUrls: ['./sidebar.page.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonFooter,
  ],
})
export class SidebarPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private menu = inject(MenuController);

  showLogin: boolean = environment.featureToggle.enableLogin;

  authenticated$: Observable<boolean>;

  navigationItems: NavigationItem[] = [
    {
      name: 'Tickets',
      icon: 'ticket-outline',
      routeName: RouteName.Tickets,
    },
    {
      name: 'Events',
      icon: 'musical-notes-outline',
      routeName: RouteName.Event,
    },
    // {
    //   name: 'Playlists',
    //   icon: 'play-outline',
    //   routeName: RouteName.Playlists
    // },
    // {
    //   name: 'Sponsors & Partners',
    //   icon: 'rocket-outline',
    //   routeName: RouteName.Partners
    // },
    // {
    //   name: 'Merch',
    //   icon: 'cash-outline',
    //   routeName: RouteName.Merch
    // },
    // {
    //   name: 'Transport',
    //   icon: 'car-outline',
    //   routeName: RouteName.Transport,
    // },
    {
      name: 'Gadearmbånd - support us!',
      icon: 'thumbs-up-outline',
      routeName: RouteName.Gadearmbaand,
    },
    {
      name: 'About',
      icon: 'information-circle-outline',
      routeName: RouteName.About,
    },
    {
      name: 'Settings',
      icon: 'settings-outline',
      routeName: RouteName.Settings,
    },
    {
      name: 'Search',
      icon: 'search',
      routeName: RouteName.Search,
    },
    {
      name: 'Profile',
      icon: 'person-circle-outline',
      routeName: RouteName.Profile,
    },
    // Hide profile menu item when login is disabled
  ]
    .filter((navItem) =>
      !environment.featureToggle.enableLogin &&
        navItem.routeName === RouteName.Profile
        ? false
        : true
    )
    .filter((navItem) =>
      environment.production && navItem.routeName === RouteName.Settings
        ? false
        : true
    ); // Show settings menu item when not in production

  ngOnInit() {
    this.authenticated$ = this.authService.authenticated$;
  }

  onGoTo(route: RouteName): void {
    this.menu.close();
    this.router.navigate([route]);
  }

  onCloseSideBar(): void {
    this.menu.close();
  }

  signInOrOut() {
    this.authService.authenticated$
      .pipe(
        first(),
        tap((authenticated) => {
          if (authenticated) {
            this.authService.logOut();
          } else {
            this.router.navigate([RouteName.Login]);
          }
        })
      )
      .subscribe();
  }
}
