import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { combineLatest, EMPTY, interval, Observable } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, shareReplay, startWith, take, tap, withLatestFrom } from 'rxjs/operators';
import eachHourOfInterval from 'date-fns/eachHourOfInterval';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import { TimetableStateService } from '../state/timetable-state.service';
import { DayEventStageTimetable, DayTimetableViewModel, EventTimetableViewModel, StageTimetable, StageTimetableViewModel, TimetableViewModel, TimeLabel, EventTimetable } from '@app/interfaces/day-event-stage-timetable';
import { ActivatedRoute } from '@angular/router';
import { FavoritesService } from '@app/services/favorites.service';
import { RouteName } from '@app/shared/models/routeName';


@Component({
  selector: 'app-timetable-gantt',
  templateUrl: './timetable-gantt.component.html',
  styleUrls: ['./timetable-gantt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimetableGanttComponent implements OnInit {

  routeName = RouteName;

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
  COLUMN_SIZE = 2.5 // 1min = COLUMN_SIZE - Defined in CSS

  constructor(
    private timetableStateService: TimetableStateService,
    private favoritesService: FavoritesService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.selectedDayId$ = this.timetableStateService.selectedDayId$;
    this.selectedEventId$ = this.timetableStateService.selectedEventId$;
    this.days$ = this.timetableStateService.days$;
    this.events$ = this.timetableStateService.events$;

    this.timetableConfig$ = this.timetableStateService.selectedEventId$
    // combineLatest([

    //   this.timetableStateService.days$,
    //   this.timetableStateService.selectedDayId$,
    //   this.timetableStateService.selectedEvent$,
    //   this.favoritesService.favorites$
    // ])
    .pipe(
      withLatestFrom(
        this.timetableStateService.selectedEvent$,
        this.timetableStateService.days$,
        this.timetableStateService.selectedDayId$,
        this.favoritesService.favorites$
      ),
      // tap(console.log),
      filter(([,, days, dayId, ]) => !!dayId && !!days),
      // TODO: Since UI is only showing timtable for single event there is no need to deal with days.
      map(([,event,days, dayId,,]) => {
        const day: DayEventStageTimetable = days.find(day => day.id === dayId);
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
        return EMPTY;
      }),
      distinctUntilChanged(),
      shareReplay()
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
      columnStart: i === 0 ? 1 : i * 60, // Grid column index starts at 1
      columnEnd: i === 0 ? 60 : (i * 60) + 60,
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

    const timetable: TimetableViewModel[] = stage.timetable
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
    });

    return {
      dayId: day.id,
      dayName: day.name,
      gridTemplateColumns,
      gridTemplateRows: row - 2,
      timeLabels,
      events
    }
  }

  toggleArtistFavorite(id: string): void {
    this.favoritesService.toggleFavorite('artist', id);
  }

}
