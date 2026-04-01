import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Tab, RouteName } from '@blockparty/festival/shared/types';
import { MenuController } from '@ionic/angular/standalone';
import { TabsStateService } from '@blockparty/festival/data-access/state/tabs';
import { SidebarPage } from './sidebar/sidebar.page';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonMenu,
} from '@ionic/angular/standalone';
import { toSignal } from '@angular/core/rxjs-interop';

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
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonMenu,
  ],
})
export class TabsPage {
  private tabStateService = inject(TabsStateService);
  private menu = inject(MenuController);
  private router = inject(Router);

  tabName = Tab;
  routeName = RouteName;

  currentTab = toSignal(this.tabStateService.currentTab$);

  onTabChange(tab: TabsChanged): void {
    this.tabStateService.updateCurrentTab(tab.tab as Tab);
  }

  onArtistTabClick(): void {
    this.router.navigate(['/', RouteName.Tabs, RouteName.Artist], {
      replaceUrl: true,
    });
  }

  openSidebar(): void {
    this.menu.open();
  }
}
