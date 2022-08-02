import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreService } from '@app/store/store.service';
import { SegmentCustomEvent } from '@ionic/angular';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, filter, map, pluck, tap } from 'rxjs/operators';
import eachHourOfInterval from 'date-fns/eachHourOfInterval';
import { TimetableStateService } from './state/timetable-state.service';
import { ArtistStateService } from '@app/pages/tab-artist/state/artist-state.service';
import { DayEventStageTimetable, DayTimetableViewModel, EventTimetableViewModel, StageTimetable, StageTimetableViewModel, TimetbaleViewModel, TimeLabel, EventTimetable } from '@app/interfaces/day-event-stage-timetable';

@Component({
  selector: 'app-tab-timetable',
  templateUrl: 'tab-timetable.page.html',
  styleUrls: ['tab-timetable.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabTimetablePage implements OnInit {

  days$: Observable<DayEventStageTimetable[]>;
  events$: Observable<EventTimetable[]>;
  selectedDayId$: Observable<string>;
  selectedEventId$: Observable<string>;
  timetableConfig$: Observable<DayTimetableViewModel>;

  EVENT_ROW_GAP = 3;
  ACT_ROW_SPAN = 2;
  STAGE_ROW_SPAN = 1

  constructor(
    private store: StoreService,
    private timetableStateService: TimetableStateService,
    private artistStateService: ArtistStateService,
  ) { }

  ngOnInit(): void {

    this.selectedDayId$ = this.timetableStateService.selectedDayId$;
    this.selectedEventId$ = this.timetableStateService.selectedEventId$;

    this.days$ = this.store.timetables$.pipe(
      tap(days => this.timetableStateService.selectDay(days[0].id))
    );

    this.events$ = combineLatest([
      this.days$,
      this.timetableStateService.selectedDayId$,
    ]).pipe(
      filter(([days, selectedDayId]) => !!days && !!selectedDayId),
      map(([days, selectedDayId]) => days.find(day => day.id === selectedDayId)),
      pluck('events'),
      tap(events => this.timetableStateService.selectEvent(events[0].event_id))
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
    this.timetableStateService.selectDay((event as SegmentCustomEvent).detail.value);
  }

  onEventFilterChange(event: Event): void {
    this.timetableStateService.selectEvent((event as SegmentCustomEvent).detail.value);
  }

  addRemoveFavorites(id: string): void {
    this.artistStateService.toggleArtistsFavorites(id);
  }

  isFavorite(id: string): boolean {
    return this.artistStateService.isFavorite(id);
  }

}
