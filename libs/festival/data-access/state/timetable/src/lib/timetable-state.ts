import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { FavoriteStateService } from '@blockparty/festival/data-access/state/favorite';
import { EventFilterStateService } from '@blockparty/festival/data-access/state/event-filter';
import { TimetableSharedStateService } from '@blockparty/festival/data-access/state/timetable-shared';
import { DayEventStageTimetable } from '@blockparty/festival/data-access/supabase';

@Injectable({
  providedIn: 'root',
})
export class TimetableStateService {
  private favoriteStateService = inject(FavoriteStateService);
  private timetableSharedStateService = inject(TimetableSharedStateService);
  private eventFilterStateService = inject(EventFilterStateService);

  timetableWithFavorites$: Observable<DayEventStageTimetable[]> = combineLatest(
    [
      this.timetableSharedStateService.timetables$,
      this.favoriteStateService.favorites$,
    ],
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
                .find((favorite) => favorite.entity === 'artist')!
                .ids.includes(act.artist_id),
            })),
          })),
        })),
      }));

      return daysWithFavorites;
    }),
    shareReplay(1),
  );

  dayEvents$: Observable<DayEventStageTimetable | null> = combineLatest([
    this.timetableWithFavorites$,
    this.eventFilterStateService.selectedDayId$,
    this.eventFilterStateService.selectedEventTypeId$,
    this.eventFilterStateService.selectedEventId$,
  ]).pipe(
    filter(
      ([timetableDays, selectedDayId, selectedEventTypeId, selectedEventId]) =>
        !!selectedDayId &&
        !!timetableDays &&
        (!!selectedEventTypeId || !!selectedEventId),
    ),
    // TODO: Since UI is only showing timtable for single event there is no need to deal with days.
    map(
      ([
        timetableDays,
        selectedDayId,
        selectedEventTypeId,
        selectedEventId,
      ]) => {
        const timetableDay = timetableDays.find(
          (day) => day.id === selectedDayId,
        );
        if (!timetableDay) return null;

        const timetableEvents = timetableDay.events.filter((event) => {
          if (selectedEventId) {
            return event.event_id === selectedEventId;
          }

          if (selectedEventTypeId) {
            return event.event_type_id === selectedEventTypeId;
          }

          return;
        });
        if (timetableEvents.length === 0) return null;

        // Find first and last time for events
        const timeSpan = timetableEvents.reduce((acc, val) => {
          (acc[0] as Date) =
            acc[0] === undefined || val.first_start_time < (acc[0] as Date)
              ? val.first_start_time
              : acc[0];
          (acc[1] as Date) =
            acc[1] === undefined || val.last_end_time > (acc[1] as Date)
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
      },
    ),
  );

  eventTypeColor$: Observable<string | null> =
    this.eventFilterStateService.selectedEventType$.pipe(
      map((eventType) => eventType.color),
    );
}
