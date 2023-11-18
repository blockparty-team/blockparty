import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Tab } from '@app/interfaces/tab';
import { MenuController } from '@ionic/angular/standalone';
import { TabsStateService } from './state/tabs-state.service';
import { RouteName } from '@app/shared/models/routeName';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SidebarPage } from './sidebar/sidebar.page';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonMenu } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  location,
  locationOutline,
  musicalNotes,
  musicalNoteOutline,
  calendar,
  calendarOutline,
  heart,
  heartOutline,
  ellipsisHorizontal,
  ellipsisHorizontalOutline,
  ticketOutline,
  musicalNotesOutline,
  carOutline,
  thumbsUpOutline,
  informationCircleOutline,
  settingsOutline,
  search,
  chevronBack,
} from 'ionicons/icons';
import { add } from 'date-fns';

interface TabsChanged {
  tab: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SidebarPage, AsyncPipe, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonMenu]
})
export class TabsPage {

  private tabStateService = inject(TabsStateService);
  private menu = inject(MenuController);

  tabName = Tab;
  routeName = RouteName;

  currentTab$: Observable<Tab> = this.tabStateService.currentTab$;

  constructor() {
    addIcons({
      location,
      locationOutline,
      musicalNotes,
      musicalNoteOutline,
      calendar,
      calendarOutline,
      heart,
      heartOutline,
      ellipsisHorizontal,
      ellipsisHorizontalOutline,
      ticketOutline,
      musicalNotesOutline,
      carOutline,
      thumbsUpOutline,
      informationCircleOutline,
      settingsOutline,
      search,
      chevronBack,
    })
  }


  onTabChange(tab: TabsChanged): void {
    this.tabStateService.updateCurrentTab((tab.tab as Tab));
  }

  openSidebar(): void {
    this.menu.open()
  }
}
