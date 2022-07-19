import { Component } from '@angular/core';
import { Tab } from '@app/interfaces/tab';
import { TabsStateService } from './state/tabs-state.service';

interface TabsChanged {
  tab: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private tabStateService: TabsStateService
  ) { }

  onTabChange(tab: TabsChanged): void {
    this.tabStateService.updateCurrentTab((tab.tab as Tab));
  }
}
