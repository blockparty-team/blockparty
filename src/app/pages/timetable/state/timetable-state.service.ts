import { Injectable } from '@angular/core';
import { DayEventStageTimetable, EventTypeViewModel, EventTimetable, TimetableWithStageName } from '@app/interfaces/day-event-stage-timetable';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { FavoritesService } from '@app/services/favorites.service';
import { SupabaseService } from '@app/services/supabase.service';
import { Observable, BehaviorSubject, combineLatest, concat } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class TimetableStateService {

  private _selectedDayId$ = new BehaviorSubject<string>(null);
  selectedDayId$: Observable<string> = this._selectedDayId$.asObservable();

  private _selectedEventTypeId$ = new BehaviorSubject<string>(null);
  selectedEventTypeId$: Observable<string> = this._selectedEventTypeId$.asObservable();

  private _selectedEventId$ = new BehaviorSubject<string>(null);
  selectedEventId$: Observable<string> = this._selectedEventId$.asObservable();
  
  days$: Observable<DayEventStageTimetable[]> = concat(
    this.deviceStorageService.get('timetable').pipe(
      filter(timetables => !!timetables)
    ),
    this.supabase.timetables$.pipe(
      filter(timetables => !!timetables),
      tap(timetables => this.deviceStorageService.set('timetable', timetables))
    )
  ).pipe(
    filter(days => !!days),
    distinctUntilChanged(),
    shareReplay(1)
  );

  eventTypes$: Observable<EventTypeViewModel[]> = combineLatest([
    this.days$,
    this.selectedDayId$,
  ]).pipe(
    filter(([days, selectedDayId]) => !!days && !!selectedDayId),
    map(([days, selectedDayId]) => days.find(day => day.id === selectedDayId)),
    map(day => day.events),
    map(events => events.map(event => {
      return {'event_type_id': event.event_type_id, 'event_type_name': event.event_type_name}
    })),
    distinctUntilChanged(),
    shareReplay(1),
  );

  selectedEventType$: Observable<EventTypeViewModel> = combineLatest([
    this.eventTypes$,
    this.selectedEventTypeId$
  ]).pipe(
    filter(([eventTypes, selectedEventTypeId]) => !!eventTypes && !!selectedEventTypeId),
    map(([eventTypes, selectedEventTypeId]) => eventTypes.find(eventType => eventType.event_type_id === selectedEventTypeId)),
  );


  events$: Observable<EventTimetable[]> = combineLatest([
    this.days$,
    this.selectedDayId$,
    this.selectedEventTypeId$,
  ]).pipe(
    filter(([days, selectedDayId, selectedEventTypeId]) => !!days && !!selectedDayId && !!selectedEventTypeId),
    map(([days, selectedDayId, selectedEventTypeId]) => days.find(day => day.id === selectedDayId).events.filter(event => event.event_type_id === selectedEventTypeId)),
    distinctUntilChanged(),
    shareReplay(1)
  );

  selectedEvent$: Observable<EventTimetable> = combineLatest([
    this.events$,
    this.selectedEventId$,
    this.selectedEventTypeId$,
    this.favoritesService.favorites$
  ]).pipe(
    filter(([events, selectedEventId, ]) => !!events && !!selectedEventId),
    map(([events, selectedEventId, ]) => events.find(event => event.event_id === selectedEventId)),
    filter(event => !!event),
    map(event => {
      // Add favorites
      const stages = event.stages.map(stage => ({
        ...stage,
        timetable: stage.timetable.map(timetable => ({
          ...timetable,
          isFavorite: this.favoritesService.isFavorite('artist', timetable.artist_id)
        }))
      }));
      return {
        ...event,
        stages
      }
    }),
    distinctUntilChanged(),
    shareReplay(1)
  )

  eventTimetableByTime$: Observable<TimetableWithStageName[]> = this.selectedEvent$.pipe(
    filter(event => !!event),
    map(event => event.stages
      .flatMap(stage => stage.timetable
        .flatMap(timetable => ({ stageName: stage.stage_name, ...timetable }))
      )
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    )
  );

  constructor(
    private supabase: SupabaseService,
    private deviceStorageService: DeviceStorageService,
    private favoritesService: FavoritesService
  ) { }

  selectDayId(dayId: string): void {
    this._selectedDayId$.next(dayId);
  }

  selectEventTypeId(eventTypeId: string): void {
    this._selectedEventTypeId$.next(eventTypeId);
  }

  selectEventId(eventId: string): void {
    this._selectedEventId$.next(eventId);
  }
}
