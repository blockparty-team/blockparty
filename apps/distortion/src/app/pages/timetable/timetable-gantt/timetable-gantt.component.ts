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
  RouteName,
} from '@blockparty/festival/types';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, NgClass, AsyncPipe, DatePipe } from '@angular/common';
import { IonIcon, IonText, IonRouterLink } from '@ionic/angular/standalone';
import { FavoriteStateService } from '@blockparty/festival/data-access/state/favorite';

@Component({
  selector: 'app-timetable-gantt',
  templateUrl: './timetable-gantt.component.html',
  styleUrls: ['./timetable-gantt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    RouterLink,
    AsyncPipe,
    DatePipe,
    IonIcon,
    IonText,
    IonRouterLink,
  ],
})
export class TimetableGanttComponent {
  private timetableStateService = inject(TimetableStateService);
  private favoriteStateService = inject(FavoriteStateService);

  routeName = RouteName;

  private currentTimeElement = viewChild<ElementRef>('currentTime');

  timetableConfig$: Observable<DayTimetableViewModel> =
    this.timetableStateService.dayEvents$.pipe(
      map((day) => this.timetableGridConfig(day)),
    );

  private currentTimeWithinTimetable$: Observable<boolean> =
    this.timetableConfig$.pipe(
      filter((config) => !!config),
      map((config) => {
        const now = new Date();
        const firstActStart = config.timeLabels[0].label;
        const lastActEnd = config.timeLabels.slice(-1)[0].label;

        return now >= firstActStart && now <= lastActEnd;
      }),
    );
  private currentTimeWithinTimetable = toSignal(
    this.currentTimeWithinTimetable$,
  );

  currentTimeColumn$: Observable<number> = combineLatest([
    interval(1000 * 60).pipe(startWith(0)),
    this.timetableConfig$,
    this.currentTimeWithinTimetable$,
  ]).pipe(
    filter(([, , withinTimetable]) => withinTimetable),
    map(([, config, withinTimetable]) => {
      const now = new Date();
      const firstActStart = config.timeLabels[0].label;

      if (withinTimetable) {
        return differenceInMinutes(now, firstActStart);
      }
    }),
    shareReplay(1),
  );

  eventTypeColor$ = this.timetableStateService.eventTypeColor$;

  EVENT_ROW_GAP = 3;
  ACT_ROW_SPAN = 2;
  STAGE_ROW_SPAN = 1;
  COLUMN_SIZE = 3.5; // 1min = COLUMN_SIZE - Defined in CSS

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
    const offset =
      (firstStartTime.getTime() - timeLabels[0].label.getTime()) / (1000 * 60);

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
  ): DayTimetableViewModel {
    if (!day) return;

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
}
