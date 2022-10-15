/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { DayEventStageTimetable, EventTimetable, Timetable, TimetableWithStageName } from '@app/interfaces/day-event-stage-timetable';
import { StoreService } from '@app/store/store.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, pluck, shareReplay } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class TimetableStateService {

  private _selectedDayId$ = new BehaviorSubject<string>(null);
  selectedDayId$: Observable<string> = this._selectedDayId$.asObservable();

  private _selectedEventId$ = new BehaviorSubject<string>(null);
  selectedEventId$: Observable<string> = this._selectedEventId$.asObservable();

  days$: Observable<DayEventStageTimetable[]> = this.store.timetables$.pipe(
    filter(days => !!days),
    shareReplay()
  );

  events$: Observable<EventTimetable[]> = combineLatest([
    this.days$,
    this.selectedDayId$,
  ]).pipe(
    filter(([days, selectedDayId]) => !!days && !!selectedDayId),
    map(([days, selectedDayId]) => days.find(day => day.id === selectedDayId)),
    pluck('events'),
    shareReplay()
  );

  selectedEvent$: Observable<EventTimetable> = combineLatest([
    this.events$,
    this.selectedEventId$
  ]).pipe(
    filter(([events, selectedEventId]) => !!events && !!selectedEventId),
    map(([events, selectedEventId]) => events.find(event => event.event_id === selectedEventId)),
    shareReplay()
  )

  eventTimetableByTime$: Observable<TimetableWithStageName[]> = this.selectedEvent$.pipe(
    filter(event => !!event),
    map(event => event.stages
      .flatMap(stage => stage.timetable
        .flatMap(timeTable => ({ stageName: stage.stage_name, ...timeTable }))
      )
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    )
  );

  constructor(
    private store: StoreService
  ) { }

  selectDayId(dayId: string): void {
    this._selectedDayId$.next(dayId);
  }

  selectEventId(eventId: string): void {
    this._selectedEventId$.next(eventId);
  }
}
