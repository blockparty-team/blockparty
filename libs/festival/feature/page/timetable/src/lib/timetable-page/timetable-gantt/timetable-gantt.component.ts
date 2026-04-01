import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, interval, Observable } from 'rxjs';
import { filter, map, shareReplay, startWith } from 'rxjs/operators';
import { differenceInMinutes, eachHourOfInterval } from 'date-fns';
import { TimetableStateService } from '@blockparty/festival/data-access/state/timetable';
import {
  DayEventStageTimetable,
  DayTimetableViewModel,
  EventTimetableViewModel,
  StageTimetable,
  StageTimetableViewModel,
  TimetableViewModel,
  TimeLabel,
} from '@blockparty/festival/data-access/supabase';
import { RouteName } from '@blockparty/festival/shared/types';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IonIcon, IonText, IonRouterLink } from '@ionic/angular/standalone';
import { FavoriteStateService } from '@blockparty/festival/data-access/state/favorite';

@Component({
  selector: 'app-timetable-gantt',
  templateUrl: './timetable-gantt.component.html',
  styleUrls: ['./timetable-gantt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, IonIcon, IonText, IonRouterLink],
})
export class TimetableGanttComponent {
  private timetableStateService = inject(TimetableStateService);
  private favoriteStateService = inject(FavoriteStateService);

  routeName = RouteName;

  private currentTimeElement = viewChild<ElementRef>('currentTime');

  private timetableConfig$: Observable<DayTimetableViewModel | null> =
    this.timetableStateService.dayEvents$.pipe(
      map((day) => this.timetableGridConfig(day!)),
    );
  timetableConfig = toSignal(this.timetableConfig$, { initialValue: null });

  private currentTimeWithinTimetable$: Observable<boolean> =
    this.timetableConfig$.pipe(
      filter((config) => !!config),
      map((config) => {
        const firstTimeLabel = config.timeLabels[0];
        const lastTimeLabel = config.timeLabels.at(-1);
        if (!firstTimeLabel || !lastTimeLabel) {
          return false;
        }

        const now = new Date();
        const firstActStart = firstTimeLabel.label;
        const lastActEnd = lastTimeLabel.label;

        return now >= firstActStart && now <= lastActEnd;
      }),
    );
  private currentTimeWithinTimetable = toSignal(
    this.currentTimeWithinTimetable$,
  );

  private currentTimeColumn$: Observable<number | null> = combineLatest([
    interval(1000 * 60).pipe(startWith(0)),
    this.timetableConfig$,
    this.currentTimeWithinTimetable$,
  ]).pipe(
    filter(([, , withinTimetable]) => withinTimetable),
    map(([, config, withinTimetable]) => {
      if (!config) {
        return null;
      }

      const firstTimeLabel = config.timeLabels[0];
      if (!firstTimeLabel) {
        return null;
      }

      const now = new Date();
      const firstActStart = firstTimeLabel.label;

      if (withinTimetable) {
        return differenceInMinutes(now, firstActStart);
      }

      return null;
    }),
    shareReplay(1),
  );
  currentTimeColumn = toSignal(this.currentTimeColumn$, { initialValue: null });

  eventTypeColor = toSignal(this.timetableStateService.eventTypeColor$, {
    initialValue: '',
  });

  EVENT_ROW_GAP = 3;
  ACT_ROW_SPAN = 2;
  STAGE_ROW_SPAN = 1;
  COLUMN_SIZE = 3.5; // 1min = COLUMN_SIZE - Defined in CSS
  TINY_SLOT_MAX_MINUTES = 20;
  COMPACT_SLOT_MAX_MINUTES = 35;

  constructor() {
    effect(() => {
      const withinTimetable = this.currentTimeWithinTimetable();
      const currentTimeElement = this.currentTimeElement()?.nativeElement;

      if (withinTimetable && currentTimeElement) {
        currentTimeElement.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior: 'smooth',
        });
      }
    });
  }

  private timeLables(firstStartTime: Date, lastEndTime: Date): TimeLabel[] {
    return eachHourOfInterval({
      start: firstStartTime.getTime(),
      end: lastEndTime.getTime(),
    }).map((t, i) => ({
      columnStart: i === 0 ? 1 : i * 60, // Grid column index starts at 1
      columnEnd: i === 0 ? 60 : i * 60 + 60,
      label: t,
    }));
  }

  private stageTimetableToGrid(
    stage: StageTimetable,
    firstStartTime: Date,
    rowStart: number,
    timeLabels: TimeLabel[],
  ): StageTimetableViewModel {
    const firstTimeLabel = timeLabels[0];
    if (!firstTimeLabel) {
      throw new Error('Expected at least one timetable time label');
    }

    const offset =
      (firstStartTime.getTime() - firstTimeLabel.label.getTime()) / (1000 * 60);

    const timetable: TimetableViewModel[] = stage.timetable.map((timetable) => {
      const relativeStartTime =
        (new Date(timetable.start_time).getTime() - firstStartTime.getTime()) /
          (1000 * 60) +
        offset;
      const relativeEndTime =
        (new Date(timetable.end_time).getTime() - firstStartTime.getTime()) /
          (1000 * 60) +
        offset;

      return {
        ...timetable,
        columnStart: relativeStartTime === 0 ? 1 : relativeStartTime,
        columnEnd: relativeEndTime,
        rowStart: rowStart + this.ACT_ROW_SPAN + this.STAGE_ROW_SPAN,
      };
    });

    return {
      stageName: stage.stage_name,
      rowStart,
      timetable,
    };
  }

  private timetableGridConfig(
    day: DayEventStageTimetable,
  ): DayTimetableViewModel | null {
    if (!day) return null;

    let row = 0; // First row is time labels
    const firstStartTime = new Date(day.first_start_time);
    const lastEndTime = new Date(day.last_end_time);

    const gridTemplateColumns = Math.ceil(
      (lastEndTime.getTime() - firstStartTime.getTime()) / (1000 * 60 * 60),
    );
    const timeLabels: TimeLabel[] = this.timeLables(
      firstStartTime,
      lastEndTime,
    );
    const events: EventTimetableViewModel[] = day.events.map((event) => {
      const eventConfig = {
        eventId: event.event_id,
        eventName: event.event_name,
        rowStart: row,
        rowEnd:
          row +
          1 +
          event.stages.length * (this.ACT_ROW_SPAN + this.STAGE_ROW_SPAN),
        stages: event.stages.map((stage) => {
          const timetable = this.stageTimetableToGrid(
            stage,
            firstStartTime,
            row,
            timeLabels,
          );
          row += this.ACT_ROW_SPAN + this.STAGE_ROW_SPAN;
          return timetable;
        }),
      };

      row += row === 1 ? 1 : this.EVENT_ROW_GAP;

      return eventConfig;
    });

    return {
      dayId: day.id,
      dayName: day.name,
      gridTemplateColumns,
      gridTemplateRows: row - 2,
      timeLabels,
      events,
    };
  }

  onToggleArtistFavorite(id: string): void {
    this.favoriteStateService.toggleFavorite('artist', id);
  }

  isTinyAct(act: TimetableViewModel): boolean {
    return this.actDurationMinutes(act) <= this.TINY_SLOT_MAX_MINUTES;
  }

  isCompactAct(act: TimetableViewModel): boolean {
    return this.actDurationMinutes(act) <= this.COMPACT_SLOT_MAX_MINUTES;
  }

  private actDurationMinutes(act: TimetableViewModel): number {
    return Math.max(
      0,
      differenceInMinutes(new Date(act.end_time), new Date(act.start_time)),
    );
  }
}
