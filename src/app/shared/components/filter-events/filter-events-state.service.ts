import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, concat } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { isSameDay } from 'date-fns';
import { SupabaseService } from '@app/services/supabase.service';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { TimetableSharedStateService } from '@app/pages/timetable/state/timetable-shared-state.service';
import { TabsStateService } from '@app/pages/tabs/state/tabs-state.service';
import { DayEvent, PartialEvent, PartialEventType } from '@app/interfaces/day-event';
import { DayEventStageTimetable } from '@app/interfaces/day-event-stage-timetable';
import { Tab } from '@app/interfaces/tab';

@Injectable()
export class FilterEventsStateService {

  private supabase = inject(SupabaseService);
  private deviceStorageService = inject(DeviceStorageService);
  private tabsStateService = inject(TabsStateService);
  private timetableSharedStateService = inject(TimetableSharedStateService)

  private _selectedDayId$ = new BehaviorSubject<string>('');
  selectedDayId$: Observable<string> = this._selectedDayId$.asObservable();

  private _selectedEventTypeId$ = new BehaviorSubject<string>('');
  selectedEventTypeId$: Observable<string> = this._selectedEventTypeId$.asObservable();

  private _selectedEventId$ = new BehaviorSubject<string>('');
  selectedEventId$: Observable<string> = this._selectedEventId$.asObservable();

  private timetableDayEvents$ = this.timetableSharedStateService.timetables$
    .pipe(
      map((days: DayEventStageTimetable[]) => {
        return days.map(day => ({
          dayId: day.id,
          eventIds: day.events.map(event => event.event_id)
        }))
      }),
      shareReplay(1)
    )

  private _days$: Observable<DayEvent[]> = concat(
    this.deviceStorageService.get('days').pipe(
      filter(days => !!days)
    ),
    this.supabase.days$.pipe(
      filter(days => !!days),
      // Modify object for event filter
      map(days => {
        return days.map(({ day_event, ...rest }) => {
          return {
            ...rest,
            event: (day_event as any[]).map(events => events.event)
          };
        }) as DayEvent[];
      }),
      tap(days => this.deviceStorageService.set('days', days))
    )
  ).pipe(
    filter(days => !!days),
    tap(days => {
      const now = new Date();
      const day = days.find(day => isSameDay(now, new Date(day.day)));

      if (day) this.selectDay(day.id);
    }),
    shareReplay(1)
  );

  // Combine current tab and timetables 
  days$ = combineLatest([
    this._days$,
    this.tabsStateService.currentTab$,
    this.timetableDayEvents$
  ]).pipe(
    filter(([days,]) => !!days),
    map(([days, tab, timetableDayEvents]) => {
      // Only return days with timetables in timetable page
      if (tab === Tab.Timetable) {
        return days
          .filter(day => timetableDayEvents.map(day => day.dayId).includes(day.id))
          .map(day => ({
            ...day,
            event: day.event.filter(e => timetableDayEvents
              .find(d => d.dayId === day.id).eventIds.includes(e.id)
            )
          }))
      }

      return days
    }),
    shareReplay(1)
  );

  eventTypes$: Observable<PartialEventType[]> = combineLatest([
    this.days$,
    this.selectedDayId$,
  ]).pipe(
    filter(([days, selectedDayId]) => !!days && !!selectedDayId),
    map(([days, selectedDayId]) => days.find(day => day.id === selectedDayId)),
    filter(day => !!day),
    map(day => day.event),
    filter(events => !!events),
    map(events => events
      .map(event => event.event_type)
      .filter((eventType, index, eventTypes) => eventTypes.findIndex(v2 => (v2.id === eventType.id)) === index)
    ),
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
        .find(day => day.id === selectedDayId)?.event
        .filter(event => event.event_type.id === selectedEventTypeId)
      // Template hides segments when events$ emits null
      return events?.length > 0 ? events : null;
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