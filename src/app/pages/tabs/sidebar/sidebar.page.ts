import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';

interface NavigationItem {
  name: string,
  icon?: string,
  routerLink?: string[]
} 

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.page.html',
  styleUrls: ['./sidebar.page.scss'],
})
export class SidebarPage implements OnInit {

  authenticated$: Observable<boolean>;

  navigationItems: NavigationItem[] = [
    {
      name: 'Profile',
      icon: 'person-circle-outline',
      routerLink: ['/profile']
    },
    {
      name: 'About',
      icon: 'information-circle-outline',
      routerLink: ['/about']
    },
    {
      name: 'Events',
      icon: 'musical-notes-outline',
      routerLink: ['/event']
    },
    {
      name: 'Playlists',
      icon: 'play-outline',
      routerLink: ['/playlist']
    },
    {
      name: 'Sponsors & Partners',
      icon: 'rocket-outline',
      routerLink: ['/partners']
    },
    {
      name: 'Tickets',
      icon: 'ticket-outline',
      routerLink: ['/merch']
    },
    {
      name: 'Merch',
      icon: 'cash-outline',
      routerLink: ['/merch']
    },
    {
      name: 'Settings',
      icon: 'settings-outline',
      routerLink: ['/settings']
    },
  ]

  constructor(
    private authService: AuthService,
    private router: Router,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.authenticated$ = this.authService.authenticated$
  }

  onGoTo(route: string[]): void {
    this.menu.close();
    this.router.navigate(route)
  }

  onCloseSideBar(): void {
    this.menu.close();
  }

  signInOrOut() {
    this.authService.authenticated$.pipe(
      first(),
      tap(authenticated => {
        if (authenticated) {
          this.authService.logOut();
        } else {
          this.router.navigate(['/login'])
        }
      })
    ).subscribe()
  }

}
