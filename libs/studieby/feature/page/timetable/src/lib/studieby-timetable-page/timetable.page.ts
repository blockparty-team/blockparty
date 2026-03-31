import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { combineLatest } from 'rxjs';
import { isSameDay, sub } from 'date-fns';
import { EventFilterStateService } from '@blockparty/festival/data-access/state/event-filter';
import { TimetableStateService } from '@blockparty/festival/data-access/state/timetable';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { AsyncPipe, DatePipe } from '@angular/common';
import { EventFilterComponent } from '@blockparty/festival/featurecomponent/event-filter';
import {
  IonHeader,
  IonContent,
  IonList,
  IonLabel,
  IonItem,
  IonItemGroup,
  IonItemDivider,
} from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventTimetable } from '@blockparty/festival/data-access/supabase';
import { FavoriteStateService } from '@blockparty/festival/data-access/state/favorite';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-timetable',
  templateUrl: 'timetable.page.html',
  styleUrls: ['timetable.page.scss'],
  providers: [TimetableStateService, EventFilterStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonItemDivider,
    IonItemGroup,
    IonItem,
    IonLabel,
    IonList,
    EventFilterComponent,
    AsyncPipe,
    DatePipe,
    RouterLink,
    IonHeader,
    IonContent,
  ],
})
export class TimetablePage implements OnInit {
  private eventFilterStateService = inject(EventFilterStateService);
  private timetableStateService = inject(TimetableStateService);
  private favoriteStateService = inject(FavoriteStateService);
  private destroyRef = inject(DestroyRef);

  private selectedEventTypeId$ =
    this.eventFilterStateService.selectedEventTypeId$;

  private timetableGroupedByEventType$ =
    this.timetableStateService.timetableWithFavorites$.pipe(
      map((days) => days.map((day) => day.events)),
      map((events) => this.groupByEventType(events.flat())),
      shareReplay(1),
    );

  eventTimetables$ = combineLatest([
    this.timetableGroupedByEventType$,
    this.selectedEventTypeId$,
  ]).pipe(
    map(([timetable, selectedEventTypeId]) => timetable[selectedEventTypeId]),
    map((events) => {
      return events?.map(({ stages, ...rest }) => {
        const timetable = stages
          ?.flatMap((stage) =>
            stage.timetable?.map((timetable) => ({
              ...timetable,
              stage_name: stage.stage_name,
              last_end_time: stage.last_end_time,
              first_start_time: stage.first_start_time,
            })),
          )
          .sort(
            (a, b) =>
              new Date(a.start_time).getTime() -
              new Date(b.start_time).getTime(),
          );
        return {
          timetable,
          ...rest,
        };
      });
    }),
    shareReplay(1),
  );

  ngOnInit(): void {
    // Default select first day, event type and event
    this.eventFilterStateService.days$
      .pipe(
        tap((days) => {
          const firstDay = days[0];
          if (!firstDay) {
            return;
          }

          // Change day at 7am next day (for events running during nighttime)
          const now = sub(new Date(), { hours: 7 });
          const day = days.find((day) => isSameDay(now, new Date(day.day)));

          if (day) {
            this.eventFilterStateService.selectDay(day.id);
          } else {
            this.eventFilterStateService.selectDay(firstDay.id);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.eventFilterStateService.eventTypes$
      .pipe(
        tap((eventTypes) => {
          const firstEventType = eventTypes[0];
          if (!firstEventType) {
            return;
          }

          this.eventFilterStateService.selectEventType(firstEventType.id);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.eventFilterStateService.events$
      .pipe(
        filter((events) => !!events),
        tap((events) => {
          const firstEvent = events[0];
          if (!firstEvent) {
            return;
          }

          this.eventFilterStateService.selectEvent(firstEvent.id);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private groupByEventType(events: EventTimetable[]): {
    [key: string]: EventTimetable[];
  } {
    return events.reduce((acc: { [key: string]: EventTimetable[] }, event) => {
      const eventTypeId = event.event_type_id;
      const grouped = acc[eventTypeId] ?? [];

      if (!acc[eventTypeId]) {
        acc[eventTypeId] = grouped;
      }

      grouped.push(event);
      return acc;
    }, {});
  }

  onToggleFavorite(id: string): void {
    this.favoriteStateService.toggleFavorite('artist', id);
  }
}
