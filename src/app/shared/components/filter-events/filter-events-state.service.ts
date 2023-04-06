import { Injectable, inject } from '@angular/core';
import { DayEvent, PartialEvent, PartialEventType } from '@app/interfaces/day-event';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { SupabaseService } from '@app/services/supabase.service';
import { Observable, BehaviorSubject, combineLatest, concat } from 'rxjs';
import { filter, map, pluck, shareReplay, tap } from 'rxjs/operators';

@Injectable()
export class FilterEventsStateService {

  private supabase = inject(SupabaseService);
  private deviceStorageService = inject(DeviceStorageService);

  private _selectedDayId$ = new BehaviorSubject<string | null>(null);
  selectedDayId$: Observable<string> = this._selectedDayId$.asObservable();

  private _selectedEventTypeId$ = new BehaviorSubject<string | null>(null);
  selectedEventTypeId$: Observable<string> = this._selectedEventTypeId$.asObservable();

  private _selectedEventId$ = new BehaviorSubject<string | null>(null);
  selectedEventId$: Observable<string> = this._selectedEventId$.asObservable();

  days$: Observable<DayEvent[]> = concat(
    this.deviceStorageService.get('days').pipe(
      filter(days => !!days)
    ),
    this.supabase.days$.pipe(
      filter(days => !!days),
      tap(days => this.deviceStorageService.set('days', days))
    )
  ).pipe(
    filter(days => !!days),
    shareReplay(1)
  );

  eventTypes$: Observable<PartialEventType[]> = combineLatest([
    this.days$,
    this.selectedDayId$,
  ]).pipe(
    filter(([days, selectedDayId]) => !!days && !!selectedDayId),
    map(([days, selectedDayId]) => days.find(day => day.id === selectedDayId)),
    pluck('event'),
    map(events => events
      .map(event => event.event_type)
      .filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)),
    tap(eventTypes => {
      if (eventTypes) {
        this.selectEventType(eventTypes[0].id);
      }
    }),
    shareReplay(1),
  );

  events$: Observable<PartialEvent[]> = combineLatest([
    this.days$,
    this.selectedDayId$,
    this.selectedEventTypeId$,
  ]).pipe(
    filter(([days, selectedDayId,]) => !!days && !!selectedDayId),
    map(([days, selectedDayId, selectedEventTypeId]) => {
      const events = days
        .find(day => day.id === selectedDayId).event
        .filter(event => event.event_type.id === selectedEventTypeId)
      // Template hides segments when events$ emits null
      return events.length > 0 ? events : null;
    }),
    tap(events => {
      if (events) {
        this.selectEvent(events[0].id);
      }
    }),
    shareReplay(1)
  );

  selectedEventType$: Observable<PartialEventType> = combineLatest([
    this.selectedEventTypeId$,
    this.eventTypes$
  ]).pipe(
    filter(([selectedEventTypeId, eventTypes]) => !!eventTypes && !!selectedEventTypeId),
    map(([selectedEventTypeId, eventTypes]) => eventTypes.find(eventType => eventType.id === selectedEventTypeId)),
    filter(eventType => !!eventType),
    shareReplay(1)
  );

  selectedEvent$: Observable<PartialEvent> = combineLatest([
    this.selectedEventId$,
    this.events$
  ]).pipe(
    filter(([selectedEventId, events]) => !!events && !!selectedEventId),
    map(([selectedEventId, events]) => events.find(event => event.id === selectedEventId)),
    filter(event => !!event),
    shareReplay(1)
  )

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