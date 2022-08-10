import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '@app/store/store.service';
import { SegmentCustomEvent } from '@ionic/angular';
import { combineLatest, EMPTY, interval, Observable } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, pluck, shareReplay, startWith, take, tap, withLatestFrom } from 'rxjs/operators';
import eachHourOfInterval from 'date-fns/eachHourOfInterval';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import isWithinInterval from 'date-fns/isWithinInterval';
import { TimetableStateService } from './state/timetable-state.service';
import { ArtistStateService } from '@app/pages/tab-artist/state/artist-state.service';
import { DayEventStageTimetable, DayTimetableViewModel, EventTimetableViewModel, StageTimetable, StageTimetableViewModel, TimetbaleViewModel, TimeLabel, EventTimetable } from '@app/interfaces/day-event-stage-timetable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tab-timetable',
  templateUrl: 'tab-timetable.page.html',
  styleUrls: ['tab-timetable.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabTimetablePage implements OnInit {

  @ViewChild('timetable') timetableElement: ElementRef;

  days$: Observable<DayEventStageTimetable[]>;
  events$: Observable<EventTimetable[]>;
  selectedDayId$: Observable<string>;
  selectedEventId$: Observable<string>;
  timetableConfig$: Observable<DayTimetableViewModel>;
  currentTimeColumn$: Observable<number>;

  EVENT_ROW_GAP = 3;
  ACT_ROW_SPAN = 2;
  STAGE_ROW_SPAN = 1
  COLUMN_SIZE = 2.5 // 1min = COLUMN_SIZE - Defined i CSS

  constructor(
    private store: StoreService,
    private timetableStateService: TimetableStateService,
    private artistStateService: ArtistStateService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.selectedDayId$ = this.timetableStateService.selectedDayId$;
    this.selectedEventId$ = this.timetableStateService.selectedEventId$;

    this.days$ = this.store.timetables$.pipe(
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
      map(([days,]) => days),
      shareReplay()
    );

    this.events$ = combineLatest([
      this.days$,
      this.timetableStateService.selectedDayId$,
    ]).pipe(
      filter(([days, selectedDayId]) => !!days && !!selectedDayId),
      map(([days, selectedDayId]) => days.find(day => day.id === selectedDayId)),
      pluck('events'),
      withLatestFrom(this.route.queryParamMap),
      // Handle url query params if exists
      tap(([events, param]) => {
        if (!!param.get('event') && events.some(event => event.event_id === param.get('event'))) {
          this.timetableStateService.selectEventId(param.get('event'))
        } else {
          this.timetableStateService.selectEventId(events[0].event_id)
        }
      }),
      map(([events,]) => events)
    );

    this.timetableConfig$ = combineLatest([
      this.store.timetables$,
      this.timetableStateService.selectedDayId$,
      this.timetableStateService.selectedEventId$,
    ]).pipe(
      filter(([days, dayId,]) => !!dayId && !!days),
      map(([days, dayId, eventId]) => {
        const day: DayEventStageTimetable = days.find(day => day.id === dayId);
        const event: EventTimetable = day.events.find(event => event.event_id === eventId);

        if (event) {
          return {
            ...day,
            events: [event],
            first_start_time: event.first_start_time,
            last_end_time: event.last_end_time
          };
        }

        return day;

      }),
      map(day => this.timetableGridConfig(day)),
      catchError(err => {
        console.log(err);
        return EMPTY;
      })
    );

    this.currentTimeColumn$ = combineLatest([
      interval(1000 * 60).pipe(startWith(0)),
      this.timetableConfig$
    ]).pipe(
      filter(([, config]) => !!config),
      map(([, config]) => {
        const now = new Date();
        const firstActStart = config.timeLabels[0].label;
        const lastActEnd = config.timeLabels.slice(-1)[0].label;

        if (now >= firstActStart && now <= lastActEnd) {
          return differenceInMinutes(now, firstActStart);
        }
      }),
      shareReplay()
    )

  }

  ionViewDidEnter(): void {
    // Scroll to current time
    this.currentTimeColumn$.pipe(
      filter(currentTime => !!currentTime),
      take(1),
      tap(currentTimeCol => {
        if (!!currentTimeCol && this.timetableElement) {
          this.timetableElement.nativeElement.scrollTo({
            top: 0,
            left: (currentTimeCol * this.COLUMN_SIZE) - (window.innerWidth / 2),
            behavior: 'smooth'
          })
        }
      })
    ).subscribe()
  }

  timeLables(firstStartTime: Date, lastEndTime: Date): TimeLabel[] {
    return eachHourOfInterval({
      start: firstStartTime.getTime(),
      end: lastEndTime.getTime()
    }).map((t, i) => ({
      columnStart: i * 60 === 0 ? 1 : i * 60, // Grid column index starts at 1
      columnEnd: i * 60 === 0 ? 60 : (i * 60) + 60,
      label: t
    }));
  }

  stageTimetableToGrid(
    stage: StageTimetable,
    firstStartTime: Date,
    rowStart: number,
    timeLabels: TimeLabel[]
  ): StageTimetableViewModel {

    const offset = (firstStartTime.getTime() - timeLabels[0].label.getTime()) / (1000 * 60);

    const timetable: TimetbaleViewModel[] = stage.timetable
      .map(timetable => {

        const relativeStartTime = (new Date(timetable.start_time).getTime() - firstStartTime.getTime()) / (1000 * 60) + offset;
        const relativeEndTime = (new Date(timetable.end_time).getTime() - firstStartTime.getTime()) / (1000 * 60) + offset;

        return {
          ...timetable,
          columnStart: relativeStartTime === 0 ? 1 : relativeStartTime,
          columnEnd: relativeEndTime,
          rowStart: rowStart + this.ACT_ROW_SPAN + this.STAGE_ROW_SPAN
        }
      });

    return {
      stageName: stage.stage_name,
      rowStart,
      timetable
    }
  }

  timetableGridConfig(day: DayEventStageTimetable): DayTimetableViewModel {

    let row = 1; // First row is time labels

    const firstStartTime = new Date(day.first_start_time);
    const lastEndTime = new Date(day.last_end_time);

    const gridTemplateColumns = Math.ceil((lastEndTime.getTime() - firstStartTime.getTime()) / (1000 * 60 * 60));
    const timeLabels: TimeLabel[] = this.timeLables(firstStartTime, lastEndTime);
    const events: EventTimetableViewModel[] = day.events.map(event => {

      const eventConfig = {
        eventId: event.event_id,
        eventName: event.event_name,
        rowStart: row,
        rowEnd: row + 1 + (event.stages.length * (this.ACT_ROW_SPAN + this.STAGE_ROW_SPAN)),
        stages: event.stages.map(stage => {
          const timetable = this.stageTimetableToGrid(stage, firstStartTime, row, timeLabels);
          row += this.ACT_ROW_SPAN + this.STAGE_ROW_SPAN
          return timetable
        })
      }

      row += row === 1 ? 1 : this.EVENT_ROW_GAP;

      return eventConfig
    })

    return {
      dayId: day.id,
      dayName: day.name,
      gridTemplateColumns,
      gridTemplateRows: row - 2,
      timeLabels,
      events
    }

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

  addRemoveFavorites(id: string): void {
    this.artistStateService.toggleArtistsFavorites(id);
  }

  isFavorite(id: string): boolean {
    return this.artistStateService.isFavorite(id);
  }

  onToggleTimetableView(): void {

  }

}
