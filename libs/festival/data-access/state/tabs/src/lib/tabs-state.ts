import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tab } from '@blockparty/festival/shared/types';

@Injectable({
  providedIn: 'root',
})
export class TabsStateService {
  private _currentTab$ = new BehaviorSubject<Tab>(Tab.Map);
  currentTab$: Observable<Tab> = this._currentTab$.asObservable();

  updateCurrentTab(tab: Tab): void {
    this._currentTab$.next(tab);
  }
}
