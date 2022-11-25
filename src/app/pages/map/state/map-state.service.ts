import { Injectable } from '@angular/core';
import { GeojsonProperties, MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { Observable, BehaviorSubject, combineLatest, concat, forkJoin } from 'rxjs';
import { DayEvent, PartialEvent } from '@app/interfaces/day-event';
import { distinctUntilChanged, filter, map, pluck, shareReplay, tap, withLatestFrom } from 'rxjs/operators';
import { SupabaseService } from '@app/services/supabase.service';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { DayEventMask } from '@app/interfaces/database-entities';
import { MapSource, MapSourceGeojson } from '@app/interfaces/map-layer';

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

  mapLayers$: Observable<MapSourceGeojson[]> = concat(
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
    shareReplay()
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

  updateMapLoaded(loadded): void {
    this._mapLoaded$.next(loadded);
  }

}