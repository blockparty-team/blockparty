import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
      icon: 'person-circle',
      routerLink: ['/profile']
    },
    {
      name: 'About',
      icon: 'information-circle',
      routerLink: ['/about']
    },
    {
      name: 'Events',
      icon: 'log-in-outline',
      routerLink: ['/events']
    },
    
  ]

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authenticated$ = this.authService.authenticated$
  }

  signInOrOut() {
    this.authService.authenticated$.pipe(
      tap(console.log)
    ).subscribe()
    // this.authService.logOut();


    this.authService.authenticated$.pipe(
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
