import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tab } from '@app/interfaces/tab';
import { MenuController } from '@ionic/angular';
import { TabsStateService } from './state/tabs-state.service';
import { RouteName } from '@app/shared/models/routeName';

interface TabsChanged {
  tab: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsPage {

  routeName = RouteName;

  constructor(
    private tabStateService: TabsStateService,
    private menu: MenuController
  ) { }

  onTabChange(tab: TabsChanged): void {
    this.tabStateService.updateCurrentTab((tab.tab as Tab));
  }

  openSidebar(): void {
    this.menu.open()
  }
}
