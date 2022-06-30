/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {

  private _selectedMapFeatures$ = new BehaviorSubject<MapClickedFeature[]>(null);
  selectedMapFeatures$: Observable<MapClickedFeature[]> = this._selectedMapFeatures$.asObservable();

  constructor() { }

  selectedMapFeatures(features: MapClickedFeature[]) {
    this._selectedMapFeatures$.next(features);
  }
}
