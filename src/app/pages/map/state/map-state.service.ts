import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, concat, forkJoin } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, shareReplay, tap, withLatestFrom } from 'rxjs/operators';

import { SupabaseService } from '@app/services/supabase.service';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { DayEvent, PartialEvent } from '@app/interfaces/day-event';
import { DayEventMask } from '@app/interfaces/database-entities';
import { MapSource, MapSourceGeojson } from '@app/interfaces/map-layer';
import { GeojsonProperties, MapClickedFeature } from '@app/interfaces/map-clicked-feature';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {

  private _mapLoaded$ = new BehaviorSubject<boolean>(false);
  mapLoaded$: Observable<boolean> = this._mapLoaded$.asObservable();

  private _mapIdle$ = new BehaviorSubject<boolean>(true);
  mapIdle$: Observable<boolean> = this._mapIdle$.asObservable().pipe(
    distinctUntilChanged()
  );

  private _selectedMapFeatures$ = new BehaviorSubject<MapClickedFeature<GeojsonProperties>[]>(null);
  selectedMapFeature$: Observable<MapClickedFeature<GeojsonProperties>> = this._selectedMapFeatures$.asObservable().pipe(
    filter(features => !!features),
    // Only provide first clicked layer
    map(features => features[0])
  );

  private _selectedDayId$ = new BehaviorSubject<string>(null);
  selectedDayId$: Observable<string> = this._selectedDayId$.asObservable();

  private _selectedEventId$ = new BehaviorSubject<string>(null);
  selectedEventId$: Observable<string> = this._selectedEventId$.asObservable();

  private _mapInteraction$ = new BehaviorSubject<boolean>(false);
  mapInteraction$: Observable<boolean> = this._mapInteraction$.asObservable();

  private _removedAssetIconNames$ = new BehaviorSubject<string[]>([]);
  removedAssetIconNames$: Observable<any> = this._removedAssetIconNames$.asObservable();

  mapLayers$: Observable<MapSourceGeojson<GeojsonProperties>[]> = concat(
    this.deviceStorageService.get('mapLayers').pipe(
      filter(layers => !!layers)
    ),
    forkJoin(
      Object.values(MapSource)
        .map(layer => this.supabase.tableAsGeojson(layer))
    ).pipe(
      filter(layers => !!layers),
      map(layers => Object.values(MapSource)
        .map((mapSource, i) => ({ mapSource, geojson: layers[i] }))
      ),
      tap(layers => this.deviceStorageService.set('mapLayers', layers))
    )
  ).pipe(
    distinctUntilChanged(),
    shareReplay(1)
  )

  days$: Observable<DayEvent[]> = concat(
    this.deviceStorageService.get('days').pipe(
      filter(days => !!days)
    ),
    this.supabase.days$.pipe(
      filter(days => !!days),
      tap(days => this.deviceStorageService.set('days', days))
    )
  ).pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  events$: Observable<PartialEvent[]> = combineLatest([
    this.days$,
    this.selectedDayId$
  ]).pipe(
    filter(([days, selectedDay]) => !!days && !!selectedDay),
    map(([days, selectedDay]) => days.find(day => day.id === selectedDay)),
    pluck('event'),
    distinctUntilChanged(),
    shareReplay(1)
  );

  dayMaskBounds$: Observable<DayEventMask[]> = this.supabase.dayMaskBounds$.pipe(
    shareReplay(1)
  );

  selectedDay$ = this.selectedDayId$.pipe(
    withLatestFrom(this.dayMaskBounds$),
    map(([dayId, dayMasks]) => dayMasks.find(day => day.id === dayId)),
    filter(dayMask => !!dayMask)
  );

  selectedEvent$ = this.selectedEventId$.pipe(
    withLatestFrom(this.events$),
    map(([eventId, events]) => events.find(event => event.id === eventId)),
    filter(event => !!event)
  );

  constructor(
    private supabase: SupabaseService,
    private deviceStorageService: DeviceStorageService,
  ) { }

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

  updateMapLoaded(loaded: boolean): void {
    this._mapLoaded$.next(loaded);
  }

  updateMapIdle(idle: boolean): void {
    this._mapIdle$.next(idle);
  }

  updateRemovedAssetIconNames(iconName: string, visible: boolean): void {

    if (visible === false) {
      this._removedAssetIconNames$.next(
        [...new Set(
          [...this._removedAssetIconNames$.value, iconName]
        )]
      )
    } else {
      this._removedAssetIconNames$.next(
        this._removedAssetIconNames$.value.filter(x => x !== iconName)
      )
    }
  }

}
