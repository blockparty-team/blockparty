import { Injectable } from '@angular/core';
import { DayEvent, PartialEvent, PartialEventType } from '@app/interfaces/day-event';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { SupabaseService } from '@app/services/supabase.service';
import { Observable, BehaviorSubject, combineLatest, concat } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, shareReplay, tap, withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilterEventsStateService {

  private _selectedDayId$ = new BehaviorSubject<string>(null);
  selectedDayId$: Observable<string> = this._selectedDayId$.asObservable();

  private _selectedEventTypeId$ = new BehaviorSubject<string>(null);
  selectedEventTypeId$: Observable<string> = this._selectedEventTypeId$.asObservable();

  private _selectedEventId$ = new BehaviorSubject<string>(null);
  selectedEventId$: Observable<string> = this._selectedEventId$.asObservable();

  eventFilterInput$: Observable<DayEvent[]> = concat(
    this.deviceStorageService.get('days').pipe(
      filter(days => !!days)
    ),
    this.supabase.days$.pipe(
      filter(days => !!days),
      tap(days => this.deviceStorageService.set('days', days))
    )
  ).pipe(
    filter(days => !!days),
    distinctUntilChanged(),
    shareReplay(1)
  );

  eventTypes$: Observable<PartialEventType[]> = combineLatest([
    this.eventFilterInput$,
    this.selectedDayId$,
  ]).pipe(
    filter(([days, selectedDayId]) => !!days && !!selectedDayId),
    map(([days, selectedDayId]) => days.find(day => day.id === selectedDayId)),
    pluck('event'),
    map(events => events.map(event => event.event_type).filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)),
    distinctUntilChanged(),
    shareReplay(1),
  );

  events$: Observable<PartialEvent[]> = combineLatest([
    this.eventFilterInput$,
    this.selectedDayId$,
    this.selectedEventTypeId$,
  ]).pipe(
    filter(([days, selectedDayId, selectedEventTypeId]) => !!days && !!selectedDayId && !!selectedEventTypeId),
    map(([days, selectedDayId, selectedEventTypeId]) => days.find(day => day.id === selectedDayId).event.filter(event => event.event_type.id === selectedEventTypeId)),
    distinctUntilChanged(),
    shareReplay(1)
  );

  selectedEventType$: Observable<PartialEventType> = this.selectedEventId$
    .pipe(
      withLatestFrom(this.eventTypes$),
      filter(([selectedEventTypeId, eventTypes]) => !!eventTypes && !!selectedEventTypeId),
      map(([selectedEventTypeId, eventTypes]) => eventTypes.find(eventType => eventType.id === selectedEventTypeId)),
    );

  // TODO: Generalize and return selectedEvents$: Observable<PartialEvent[]> instead. Make it up to consumer (parent) to process.
  selectedEvent$: Observable<PartialEvent> = this.selectedEventId$
    .pipe(
      withLatestFrom(this.events$),
      filter(([selectedEventId, events]) => !!events && !!selectedEventId),
      map(([selectedEventId, events]) => events.find(event => event.id === selectedEventId)),
      filter(event => !!event),
      shareReplay(1)
    )
  constructor(
    private supabase: SupabaseService,
    private deviceStorageService: DeviceStorageService,
  ) { }

  selectDay(dayId: string): void {
    this._selectedDayId$.next(dayId);
  }

  selectEventType(eventTypeId: string): void {
    this._selectedEventTypeId$.next(eventTypeId);
  }

  selectEvent(eventId: string): void {
    this._selectedEventId$.next(eventId);
  }
}