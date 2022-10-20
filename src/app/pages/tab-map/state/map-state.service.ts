import { Injectable } from '@angular/core';
import { GeojsonProperties, MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { StoreService } from '@app/store/store.service';
import { DayWithRelations, EventWithRelations } from '@app/interfaces/entities-with-releation';
import { SupabaseService } from '@app/services/supabase.service';
import { distinctUntilChanged, filter, map, pluck, shareReplay, withLatestFrom } from 'rxjs/operators';

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

  days$: Observable<DayWithRelations[]> = this.supabase.days$;

  events$: Observable<EventWithRelations[]> = combineLatest([
    this.days$,
    this.selectedDayId$
  ]).pipe(
    filter(([days, selectedDay]) => !!days && !!selectedDay),
    map(([days, selectedDay]) => days.find(day => day.id === selectedDay)),
    pluck('event'),
    distinctUntilChanged(),
    shareReplay()
  );

  selectedDay$ = this.selectedDayId$.pipe(
    withLatestFrom(this.store.dayMaskBounds$),
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
    private store: StoreService
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
