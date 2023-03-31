import { ChangeDetectionStrategy, Component, ElementRef, OnChanges, OnInit, Input, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { SegmentCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import isWithinInterval from 'date-fns/isWithinInterval';
import { TimetableStateService } from './state/timetable-state.service';
import { DayEventStageTimetable, EventTypeViewModel, EventTimetable } from '@app/interfaces/day-event-stage-timetable';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterEventsStateService } from '@app/shared/components/filter-events/filter-events-state.service';

type TimeTableViewMode = 'gantt' | 'list'

@Component({
  selector: 'app-timetable',
  templateUrl: 'timetable.page.html',
  styleUrls: ['timetable.page.scss'],
  providers: [FilterEventsStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimetablePage implements OnInit {

  @ViewChild('timetable') timetableElement: ElementRef;

  private _timetableViewMode$ = new BehaviorSubject<TimeTableViewMode>('gantt');
  timetableViewMode$: Observable<TimeTableViewMode> = this._timetableViewMode$.asObservable();

  
  days$: Observable<DayEventStageTimetable[]>;
  eventTypes$: Observable<EventTypeViewModel[]>;
  events$: Observable<EventTimetable[]>;
  selectedDayId$: Observable<string>;
  selectedEventTypeId$: Observable<string>;
  selectedEventId$: Observable<string>;

  constructor(
    private timetableStateService: TimetableStateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.selectedDayId$ = this.timetableStateService.selectedDayId$;
    this.selectedEventTypeId$ = this.timetableStateService.selectedEventTypeId$;
    this.selectedEventId$ = this.timetableStateService.selectedEventId$;

    this.events$ = this.timetableStateService.events$
    // .pipe(
      // withLatestFrom(this.route.queryParamMap),
      // Handle url if event query params exists
      // tap(([events, param]) => {
      //   if (!!param.get('event') && events.some(event => event.event_id === param.get('event'))) {
      //     this.timetableStateService.selectEventId(param.get('event'))
      //   } else {
      //     this.timetableStateService.selectEventId(events[0].event_id)
      //   }
      // }),
      // map((events) => { return events}),
    // )

  }
  

  // onDayFilterChange(event: Event): void {
  //   const dayId = (event as SegmentCustomEvent).detail.value
  //   this.timetableStateService.selectDayId(dayId);
  //   // this.router.navigate(
  //   //   [],
  //   //   {
  //   //     relativeTo: this.route,
  //   //     queryParams: {
  //   //       day: dayId
  //   //     },
  //   //     queryParamsHandling: 'merge'
  //   //   }
  //   // );
  // }

  onDayFilterSelect(id: string): void {
    this.timetableStateService.selectDayId(id);
  }

  onEventTypeFilterSelect(id: string): void {
    this.timetableStateService.selectEventTypeId(id);
  }
  onEventFilterSelect(id: string): void {
    this.timetableStateService.selectEventId(id);
  }

  // onEventTypeFilterChange(event: Event): void {
  //   const eventTypeId = (event as SegmentCustomEvent).detail.value
  //   this.timetableStateService.selectEventTypeId(eventTypeId);
  // }

  // onEventFilterChange(event: Event): void {
  //   const eventId = (event as SegmentCustomEvent).detail.value;
  //   this.timetableStateService.selectEventId(eventId);
  //   // this.router.navigate(
  //   //   [],
  //   //   {
  //   //     relativeTo: this.route,
  //   //     queryParams: {
  //   //       event: eventId
  //   //     },
  //   //     queryParamsHandling: 'merge'
  //   //   }
  //   // );
  // }

  onToggleTimetableView(): void {
    this._timetableViewMode$.value === 'gantt' ?
      this._timetableViewMode$.next('list') :
      this._timetableViewMode$.next('gantt');
  }

}
