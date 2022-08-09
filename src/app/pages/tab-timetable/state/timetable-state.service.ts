/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimetableStateService {

  private _selectedDayId$ = new BehaviorSubject<string>(null);
  selectedDayId$: Observable<string> = this._selectedDayId$.asObservable();

  private _selectedEventId$ = new BehaviorSubject<string>(null);
  selectedEventId$: Observable<string> = this._selectedEventId$.asObservable();

  selectDayId(dayId: string): void {
    this._selectedDayId$.next(dayId);
  }

  selectEventId(eventId: string): void {
    this._selectedEventId$.next(eventId);
  }
}
