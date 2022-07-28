/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { GeojsonProperties, MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {

  private _mapLoaded$ = new BehaviorSubject<boolean>(false);
  mapLoaded$: Observable<boolean> = this._mapLoaded$.asObservable();

  private _selectedMapFeatures$ = new BehaviorSubject<MapClickedFeature<GeojsonProperties>[]>(null);
  selectedMapFeatures$: Observable<MapClickedFeature<GeojsonProperties>[]> = this._selectedMapFeatures$.asObservable();

  private _selectedDayId$ = new BehaviorSubject<string>(null);
  selectedDayId$: Observable<string> = this._selectedDayId$.asObservable();

  private _selectedEventId$ = new BehaviorSubject<string>(null);
  selectedEventId$: Observable<string> = this._selectedEventId$.asObservable();

  private _mapInteraction$ = new BehaviorSubject<boolean>(false);
  mapInteraction$: Observable<boolean> = this._mapInteraction$.asObservable();

  selectMapFeatures(features: MapClickedFeature<GeojsonProperties>[]): void {
    this._selectedMapFeatures$.next(features);
  }

  selectDay(dayId: string): void {
    this._selectedDayId$.next(dayId);
  }

  selectEvent(eventId: string): void {
    this._selectedEventId$.next(eventId);
  }

  updateMapInteraction(interacting: boolean): void {
    this._mapInteraction$.next(interacting);
  }

  updateMapLoaded(loadded): void {
    this._mapLoaded$.next(loadded);
  }

}
