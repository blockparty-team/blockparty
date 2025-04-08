import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Tab, RouteName } from '@blockparty/festival/shared/types';
import { MenuController } from '@ionic/angular/standalone';
import { TabsStateService } from '@blockparty/festival/data-access/state/tabs';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SidebarPage } from './sidebar/sidebar.page';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonMenu,
} from '@ionic/angular/standalone';

interface TabsChanged {
  tab: string;
}

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        SidebarPage,
        AsyncPipe,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonLabel,
        IonMenu,
    ]
})
export class TabsPage {
  private tabStateService = inject(TabsStateService);
  private menu = inject(MenuController);

  tabName = Tab;
  routeName = RouteName;

  currentTab$: Observable<Tab> = this.tabStateService.currentTab$;

  onTabChange(tab: TabsChanged): void {
    this.tabStateService.updateCurrentTab(tab.tab as Tab);
  }

  openSidebar(): void {
    this.menu.open();
  }
}
