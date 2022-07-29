import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DayWithRelations, StageWithRelations } from '@app/interfaces/entities-with-releation';
import { StoreService } from '@app/store/store.service';
import { SegmentCustomEvent } from '@ionic/angular';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, filter, map, pluck, tap } from 'rxjs/operators';
import eachHourOfInterval from 'date-fns/eachHourOfInterval';
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes';
import { TimetableStateService } from './state/timetable-state.service';
import { ArtistStateService } from '@app/pages/tab-artist/state/artist-state.service';
import { definitions } from '@app/interfaces/supabase';
import { DayEventStageTimetable, EventTimetables, StageTimetables } from '@app/interfaces/day-event-stage-timetable';

interface TimeLabel {
  column: number,
  label: Date
}

interface GridTranformedStageTimetable {
  name: definitions['stage']['name'];
  acts: {
    name: definitions['artist']['name'];
    id: definitions['artist']['id'];
    startTime: definitions['timetable']['start_time'];
    endTime: definitions['timetable']['end_time'];
    columnStart: number;
    columnEnd: number;
    rowStart: number;
  }[];
}

interface TimetableConfig {
  gridTemplate: {
    columns: number;
  }
  timeLabels: TimeLabel[];
  timetable: GridTranformedStageTimetable[]
}


@Component({
  selector: 'app-tab-timetable',
  templateUrl: 'tab-timetable.page.html',
  styleUrls: ['tab-timetable.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabTimetablePage implements OnInit {

  // https://www.bennadel.com/blog/3961-having-fun-with-the-horizontal-usage-of-position-sticky-in-angular-11-0-5.htm

  days$: Observable<DayWithRelations[]>;
  events$: Observable<DayWithRelations['event']>;
  selectedDayId$: Observable<string>;
  selectedEventId$: Observable<string>;
  timetableConfig$: Observable<TimetableConfig>;


  constructor(
    private store: StoreService,
    private timetableStateService: TimetableStateService,
    private artistStateService: ArtistStateService,
  ) { }

  ngOnInit(): void {

    combineLatest([
      this.store.timetables$,
      this.timetableStateService.selectedDayId$
    ]).pipe(
      filter(([days, dayId]) => !!dayId && !!days),
      map(([days, dayId]) => days.find(day => day.id === dayId)),
      map(day => this.trans(day)),
      tap(console.log),
      catchError(err => {
        console.log(err);
        return EMPTY;
      })
    ).subscribe();

    this.days$ = this.store.days$.pipe(
      tap(days => this.timetableStateService.selectDay(days[0].id))
    );

    this.timetableConfig$ = combineLatest([
      this.timetableStateService.selectedDayId$,
      this.store.days$,
    ]).pipe(
      filter(([dayId, days]) => !!dayId && !!days),
      map(([dayId, days]) => (
        {
          dayId,
          stages: days
            .find(day => day.id === dayId).event
            .map(event => event.stage)[0]
        }
      )),
      map(x => this.transformToGrid(x.stages, x.dayId)),
      catchError(err => {
        console.log(err);
        return EMPTY;
      })
    )

    this.selectedDayId$ = this.timetableStateService.selectedDayId$

    this.events$ = combineLatest([
      this.days$,
      this.timetableStateService.selectedDayId$
    ]).pipe(
      filter(([days, selectedDay]) => !!days && !!selectedDay),
      map(([days, selectedDay]) => days.find(day => day.id === selectedDay)),
      pluck('event')
    );

  }

  trans(day: DayEventStageTimetable): any {
    console.log(day)

    const firstStartTime = new Date(day.first_start_time).getTime();
    const lastEndTime = new Date(day.last_end_time).getTime();

    // Calculate number of grid template rows and columns
    const gridTemplateColumns = Math.ceil((lastEndTime - firstStartTime) / (1000 * 60 * 60));

    const timeLabels: TimeLabel[] = eachHourOfInterval({
      start: firstStartTime,
      end: lastEndTime
    }).map((t, i) => ({
      column: i * 60 === 0 ? 1 : i * 60, // column index starts at 1
      label: t
    }));

    return {
      gridTemplateColumns,
      timeLabels
    }
  }

  transformToGrid(stageTimetables: StageWithRelations[], dayId: string): TimetableConfig {

    // Find time for first act
    const minStartTime = stageTimetables
      .flatMap(stage => stage.timetable
        .filter(x => x.day_id === dayId)
        .map(act => roundToNearestMinutes(new Date(act.start_time)).getTime())
      )
      .sort()[0];

    // Find time for last act
    const maxEndTime = stageTimetables
      .flatMap(x => x.timetable
        .filter(x => x.day_id === dayId)
        .map(act => roundToNearestMinutes(new Date(act.end_time)).getTime())
      )
      .sort((a, b) => b - a)[0];

    // Handle when no timetables are assigned to day
    if (!maxEndTime && !minStartTime) return null;

    // Create labels based on the time span between first and last act
    const timeLabels: TimeLabel[] = eachHourOfInterval({
      start: minStartTime,
      end: maxEndTime
    }).map((t, i) => ({
      column: i * 60 === 0 ? 1 : i * 60, // column index starts at 1
      label: t
    }));

    const stageNames = stageTimetables.filter(s => s.timetable.length > 0).map(stage => stage.name)

    // Transform acts start and end time into grid columns
    const timetable = stageTimetables.map(stage => {

      const offset = (minStartTime - timeLabels[0].label.getTime()) / (1000 * 60);

      if (stage.timetable.filter(t => t.day_id === dayId).length > 0) {

        const acts = stage.timetable
          .filter(t => t.day_id === dayId)
          .map(act => {
            const relativeStart = ((roundToNearestMinutes(new Date(act.start_time)).getTime() - minStartTime) / (1000 * 60)) + offset;
            const relativeEnd = ((roundToNearestMinutes(new Date(act.end_time)).getTime() - minStartTime) / (1000 * 60)) + offset;

            return {
              name: act.artist.name,
              id: act.artist.id,
              startTime: act.start_time,
              endTime: act.end_time,
              columnStart: relativeStart === 0 ? 1 : relativeStart,
              columnEnd: relativeEnd,
              rowStart: stageNames.indexOf(stage.name) === 0 ? 3 : (stageNames.indexOf(stage.name) + 1) * 3
            }
          })
          .sort((a, b) => a.columnStart - b.columnStart)

        return {
          name: stage.name,
          acts
        }
      }

    }).filter(t => t !== undefined);

    // Calculate number of grid template rows and columns
    const columns = Math.ceil((maxEndTime - minStartTime) / (1000 * 60 * 60));

    return {
      gridTemplate: {
        columns
      },
      timeLabels,
      timetable
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
