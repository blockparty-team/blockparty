/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {

  private _selectedMapFeatures$ = new BehaviorSubject<MapClickedFeature[]>(null);
  selectedMapFeatures$: Observable<MapClickedFeature[]> = this._selectedMapFeatures$.asObservable();

  private _selectedDay$ = new BehaviorSubject<string>(null);
  selectedDay$: Observable<string> = this._selectedDay$.asObservable();

  selectedMapFeatures(features: MapClickedFeature[]): void {
    this._selectedMapFeatures$.next(features);
  }

  selectedDay(dayId: string): void {
    this._selectedDay$.next(dayId);
  }
}
