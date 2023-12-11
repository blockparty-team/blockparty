import { Injectable } from '@angular/core';
import { Tab } from '@app/interfaces/tab';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabsStateService {
  private _currentTab$ = new BehaviorSubject<Tab>(Tab.Map);
  currentTab$: Observable<Tab> = this._currentTab$.asObservable();

  constructor() {}

  updateCurrentTab(tab: Tab): void {
    this._currentTab$.next(tab);
  }
}
