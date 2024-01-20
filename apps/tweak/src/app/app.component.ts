import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonFooter,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { icons } from '@tweak/shared/icons';

export interface AppPage {
  title: string;
  url: string;
  icon: string;
}

export const appPages: AppPage[] = [
  { title: 'Day', url: '/day', icon: 'calendar-outline' },
  { title: 'Event', url: '/event', icon: 'musical-notes-outline' },
  { title: 'Stage', url: '/stage', icon: 'mic-outline' },
  { title: 'Artist', url: '/artist', icon: 'person-outline' },
  { title: 'Timetable', url: '/timetable', icon: 'time-outline' },
  { title: 'Asset', url: '/asset', icon: 'pin-outline' },
  { title: 'Icon', url: '/icon', icon: 'flag-outline' },
];

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonFooter,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonRouterLink,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
  ],
})
export class AppComponent {
  public appPages = signal<AppPage[]>(appPages);

  constructor() {
    addIcons(icons);
  }
}
