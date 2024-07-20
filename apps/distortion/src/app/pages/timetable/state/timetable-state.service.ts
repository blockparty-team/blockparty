import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { FavoriteStateService } from '@blockparty/festival/data-access/favorite-state';
import { FilterEventsStateService } from '@distortion/app/shared/components/filter-events/filter-events-state.service';
import { TimetableSharedStateService } from './timetable-shared-state.service';
import { DayEventStageTimetable } from '@blockparty/festival/types';

@Injectable({
  providedIn: 'root',
})
export class TimetableStateService {
  private favoriteStateService = inject(FavoriteStateService);
  private timetableSharedStateService = inject(TimetableSharedStateService);
  private filterEventsStateService = inject(FilterEventsStateService);

  timetableWithFavorites$: Observable<DayEventStageTimetable[]> = combineLatest(
    [
      this.timetableSharedStateService.timetables$,
      this.favoriteStateService.favorites$
    ]
  ).pipe(
    map(([days, favorites]) => {
      const daysWithFavorites = days.map((day) => ({
        ...day,
        events: day.events.map((event) => ({
          ...event,
          stages: event.stages.map((stage) => ({
            ...stage,
            timetable: stage.timetable.map((act) => ({
              ...act,
              isFavorite: favorites
                .find((favorite) => favorite.entity === 'artist')
                .ids.includes(act.artist_id),
            })),
          })),
        })),
      }));

      return daysWithFavorites;
    }),
    shareReplay(1)
  );

  dayEvents$: Observable<DayEventStageTimetable> = combineLatest([
    this.timetableWithFavorites$,
    this.filterEventsStateService.selectedDayId$,
    this.filterEventsStateService.selectedEventTypeId$,
    this.filterEventsStateService.selectedEventId$,
  ]).pipe(
    filter(
      ([timetableDays, selectedDayId, selectedEventTypeId, selectedEventId]) =>
        !!selectedDayId &&
        !!timetableDays &&
        (!!selectedEventTypeId || !!selectedEventId)
    ),
    // TODO: Since UI is only showing timtable for single event there is no need to deal with days.
    map(
      ([
        timetableDays,
        selectedDayId,
        selectedEventTypeId,
        selectedEventId,
      ]) => {
        const timetableDay: DayEventStageTimetable = timetableDays.find(
          (day) => day.id === selectedDayId
        );
        if (!timetableDay) return null;

        const timetableEvents = timetableDay.events.filter((event) => {
          if (selectedEventId) {
            return event.event_id === selectedEventId;
          }

          if (selectedEventTypeId) {
            return event.event_type_id === selectedEventTypeId;
          }
        });
        if (timetableEvents.length === 0) return null;

        // Find first and last time for events
        const timeSpan = timetableEvents.reduce((acc, val) => {
          acc[0] =
            acc[0] === undefined || val.first_start_time < acc[0]
              ? val.first_start_time
              : acc[0];
          acc[1] =
            acc[1] === undefined || val.last_end_time > acc[1]
              ? val.last_end_time
              : acc[1];
          return acc;
        }, []);

        return {
          ...timetableDay,
          events: timetableEvents,
          // First last time is overwritten based on selected events
          first_start_time: timeSpan[0],
          last_end_time: timeSpan[1],
        };
      }
    )
  );

  eventTypeColor$: Observable<string> =
    this.filterEventsStateService.selectedEventType$.pipe(
      map((eventType) => eventType.color)
    );
}
