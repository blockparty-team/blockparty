import { Injectable, inject } from '@angular/core';
import { DayEventStageTimetable } from '@app/interfaces/day-event-stage-timetable';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { SupabaseService } from '@app/services/supabase.service';
import { Observable, concat } from 'rxjs';
import { distinctUntilChanged, filter, shareReplay, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class TimetableStateService {

  private supabase = inject(SupabaseService);
  private deviceStorageService = inject(DeviceStorageService);
  
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

  selectedEventType$: Observable<EventTypeViewModel> = this.selectedEventTypeId$
  //   this.eventTypes$,
  //   this.selectedEventTypeId$
  // ])
  .pipe(
    withLatestFrom(this.eventTypes$),
    filter(([selectedEventTypeId, eventTypes]) => !!eventTypes && !!selectedEventTypeId),
    map(([selectedEventTypeId, eventTypes]) => eventTypes.find(eventType => eventType.event_type_id === selectedEventTypeId)),
  );


  events$: Observable<EventTimetable[]> = combineLatest([
    this.days$,
    this.selectedDayId$,
    this.selectedEventTypeId$,
  ]).pipe(
    // tap(console.log),
    filter(([days, selectedDayId, selectedEventTypeId]) => !!days && !!selectedDayId && !!selectedEventTypeId),
    map(([days, selectedDayId, selectedEventTypeId]) => days.find(day => day.id === selectedDayId).events.filter(event => event.event_type_id === selectedEventTypeId)),
    distinctUntilChanged(),
    shareReplay(1)
  );

  selectedEvent$: Observable<EventTimetable> = this.selectedEventId$
  // combineLatest([
  //   this.events$,
  //   this.selectedEventId$,
  //   this.favoritesService.favorites$
  // ])
  .pipe(
    withLatestFrom(this.events$),
    filter(([selectedEventId, events ]) => !!events && !!selectedEventId),
    map(([selectedEventId, events ]) => events.find(event => event.event_id === selectedEventId)),
    map(event => {
      // Add favorites - 
      // TODO: Move to timetable logic, this is not part of filter as such.
      // Reckon filter should be strictly on days, any augmentation of data could/should
      // be later.
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
    filter(event => !!event),
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
