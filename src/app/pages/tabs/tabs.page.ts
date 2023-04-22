import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Tab } from '@app/interfaces/tab';
import { MenuController } from '@ionic/angular';
import { TabsStateService } from './state/tabs-state.service';
import { RouteName } from '@app/shared/models/routeName';
import { Observable } from 'rxjs';

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

  private tabStateService = inject(TabsStateService);
  private menu = inject(MenuController);

  tabName = Tab;
  routeName = RouteName;
  
  currentTab$: Observable<Tab> = this.tabStateService.currentTab$;

  onTabChange(tab: TabsChanged): void {
    this.tabStateService.updateCurrentTab((tab.tab as Tab));
  }

  openSidebar(): void {
    this.menu.open()
  }
}
