/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimetableStateService {

  private _selectedDay$ = new BehaviorSubject<string>(null);
  selectedDay$: Observable<string> = this._selectedDay$.asObservable();

  private _selectedEvent$ = new BehaviorSubject<string>(null);
  selectedEvent$: Observable<string> = this._selectedEvent$.asObservable();

  selectDay(dayId: string): void {
    this._selectedDay$.next(dayId);
  }

  selectEvent(eventId: string): void {
    this._selectedEvent$.next(eventId);
  }
}
