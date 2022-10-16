import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SegmentCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import isWithinInterval from 'date-fns/isWithinInterval';
import { TimetableStateService } from './state/timetable-state.service';
import { DayEventStageTimetable, EventTimetable } from '@app/interfaces/day-event-stage-timetable';
import { ActivatedRoute, Router } from '@angular/router';

type TimeTableViewMode = 'gantt' | 'list'

@Component({
  selector: 'app-tab-timetable',
  templateUrl: 'tab-timetable.page.html',
  styleUrls: ['tab-timetable.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabTimetablePage implements OnInit {

  @ViewChild('timetable') timetableElement: ElementRef;

  private _timetableViewMode$ = new BehaviorSubject<TimeTableViewMode>('list');
  timetableViewMode$: Observable<TimeTableViewMode> = this._timetableViewMode$.asObservable();

  days$: Observable<DayEventStageTimetable[]>;
  events$: Observable<EventTimetable[]>;
  selectedDayId$: Observable<string>;
  selectedEventId$: Observable<string>;

  constructor(
    private timetableStateService: TimetableStateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.selectedDayId$ = this.timetableStateService.selectedDayId$;
    this.selectedEventId$ = this.timetableStateService.selectedEventId$;

    this.days$ = this.timetableStateService.days$.pipe(
      withLatestFrom(this.route.queryParamMap),
      tap(([days, param]) => {

        // Check if current time is within on of the days
        const currentDay = days.find(day => isWithinInterval(
          new Date(),
          {
            start: new Date(day.first_start_time),
            end: new Date(day.last_end_time)
          }
        ))

        // Select day based on url query params / current time / default to first day
        if (!!param.get('day') && days.some(day => day.id === param.get('day'))) {
          this.timetableStateService.selectDayId(param.get('day'));
        } else if (currentDay) {
          this.timetableStateService.selectDayId(currentDay.id);
        } else {
          this.timetableStateService.selectDayId(days[0].id);
        }
      }),
      map(([days, ]) => days)
    )

    this.events$ = this.timetableStateService.events$.pipe(
      withLatestFrom(this.route.queryParamMap),
      // Handle url if event query params exists
      tap(([events, param]) => {
        if (!!param.get('event') && events.some(event => event.event_id === param.get('event'))) {
          this.timetableStateService.selectEventId(param.get('event'))
        } else {
          this.timetableStateService.selectEventId(events[0].event_id)
        }
      }),
      map(([events,]) => events)
    )

  }

  

  onDayFilterChange(event: Event): void {
    const dayId = (event as SegmentCustomEvent).detail.value
    this.timetableStateService.selectDayId(dayId);
    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: {
    //       day: dayId
    //     },
    //     queryParamsHandling: 'merge'
    //   }
    // );
  }

  onEventFilterChange(event: Event): void {
    const eventId = (event as SegmentCustomEvent).detail.value;
    this.timetableStateService.selectEventId(eventId);
    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: {
    //       event: eventId
    //     },
    //     queryParamsHandling: 'merge'
    //   }
    // );
  }

  onToggleTimetableView(): void {
    this._timetableViewMode$.value === 'gantt' ?
      this._timetableViewMode$.next('list') :
      this._timetableViewMode$.next('gantt');
  }

}
