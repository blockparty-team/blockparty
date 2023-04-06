import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { combineLatest, EMPTY, interval, Observable } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, take, tap } from 'rxjs/operators';
import eachHourOfInterval from 'date-fns/eachHourOfInterval';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import { TimetableStateService } from '../state/timetable-state.service';
import { DayEventStageTimetable, DayTimetableViewModel, EventTimetableViewModel, StageTimetable, StageTimetableViewModel, TimetableViewModel, TimeLabel } from '@app/interfaces/day-event-stage-timetable';
import { FavoritesService } from '@app/services/favorites.service';
import { RouteName } from '@app/shared/models/routeName';
import { FilterEventsStateService } from '@app/shared/components/filter-events/filter-events-state.service';


@Component({
  selector: 'app-timetable-gantt',
  templateUrl: './timetable-gantt.component.html',
  styleUrls: ['./timetable-gantt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimetableGanttComponent implements OnInit {

  private filterEventStateService = inject(FilterEventsStateService);
  private timetableStateService = inject(TimetableStateService);
  private favoritesService = inject(FavoritesService);
  // private route = inject(ActivatedRoute);

  routeName = RouteName;

  @ViewChild('timetable') timetableElement: ElementRef;

  timetableConfig$: Observable<DayTimetableViewModel>;
  currentTimeColumn$: Observable<number>;
  selectedEvent$ = this.filterEventStateService.selectedEvent$;
  eventTypeColor$: Observable<string>;

  EVENT_ROW_GAP = 3;
  ACT_ROW_SPAN = 2;
  STAGE_ROW_SPAN = 1
  COLUMN_SIZE = 2.5 // 1min = COLUMN_SIZE - Defined in CSS

  ngOnInit(): void {

    this.timetableConfig$ = combineLatest([
      this.timetableStateService.timetableWithFavorites$,
      this.filterEventStateService.selectedDayId$,
      this.filterEventStateService.selectedEventId$
    ]).pipe(
      filter(([timetableDays, selectedDayId, selectedEventId]) => !!selectedDayId && !!timetableDays && !!selectedEventId),
      // TODO: Since UI is only showing timtable for single event there is no need to deal with days.
      map(([timetableDays, selectedDayId, selectedEventId]) => {
        const timetableDay: DayEventStageTimetable = timetableDays.find(day => day.id === selectedDayId);
        if (!timetableDay) return;

        const timetableEvent = timetableDay.events.find(e => e.event_id === selectedEventId);
        if (!timetableEvent) return;

        return {
          ...timetableDay,
          events: [timetableEvent],
          first_start_time: timetableEvent.first_start_time,
          last_end_time: timetableEvent.last_end_time
        };
      }),
      map(day => this.timetableGridConfig(day)),
      catchError(err => {
        console.log(err);
        return EMPTY;
      }),
      shareReplay(1)
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

    this.eventTypeColor$ = this.selectedEvent$.pipe(
      map(event => event.event_type.color)
    );

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

    if (!day) return;

    let row = 0; // First row is time labels
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
