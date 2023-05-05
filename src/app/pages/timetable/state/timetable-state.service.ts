import { Injectable, inject } from '@angular/core';
import { DayEventStageTimetable } from '@app/interfaces/day-event-stage-timetable';
import { ArtistNotification } from '@app/interfaces/favorite-notification';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { FavoriteStateService } from '@app/pages/favorite/state/favorite-state.service';
import { SupabaseService } from '@app/services/supabase.service';
import { FilterEventsStateService } from '@app/shared/components/filter-events/filter-events-state.service';
import { Observable, combineLatest, concat } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class TimetableStateService {

  private supabase = inject(SupabaseService);
  private deviceStorageService = inject(DeviceStorageService);
  private favoriteStateService = inject(FavoriteStateService);
  private filterEventsStateService = inject(FilterEventsStateService);

  private timetables$: Observable<DayEventStageTimetable[]> = concat(
    this.deviceStorageService.get('timetable').pipe(
      filter(timetables => !!timetables)
    ),
    this.supabase.timetables$.pipe(
      filter(timetables => !!timetables),
      tap(timetables => this.deviceStorageService.set('timetable', timetables))
    )
  ).pipe(
    filter(days => !!days),
    shareReplay(1)
  );

 timetableWithFavorites$: Observable<DayEventStageTimetable[]> = combineLatest([
    this.timetables$,
    this.favoriteStateService.favorites$
  ]).pipe(
    map(([days, favorites]) => {

      const daysWithFavorites = days
        .map(day => ({
          ...day, events: day.events
            .map(event => ({
              ...event, stages: event.stages
                .map(stage => ({
                  ...stage, timetable: stage.timetable
                    .map(act => ({
                      ...act,
                      isFavorite: favorites
                        .find(favorite => favorite.entity === 'artist').ids
                        .includes(act.artist_id)
                    }))
                }))
            }))
        }));

      return daysWithFavorites
    }),
    shareReplay(1)
  )

  // Flattened timetables for rescheduling notificationens
  timetableArtistNotification$: Observable<ArtistNotification[]> = this.timetables$.pipe(
    map(days => days
      .flatMap(day => day.events
        .flatMap(event => event.stages
          .flatMap(stage => stage.timetable
            .flatMap(act => ({
              artistId: act.artist_id,
              artistName: act.artist_name,
              startTime: act.start_time,
              stageName: stage.stage_name,
              eventName: event.event_name
            }))
          )
        )
      )
    )
  );

  dayEvents$: Observable<DayEventStageTimetable> = combineLatest([
    this.timetableWithFavorites$,
    this.filterEventsStateService.selectedDayId$,
    this.filterEventsStateService.selectedEventTypeId$,
    this.filterEventsStateService.selectedEventId$,
  ]).pipe(
    filter(([timetableDays, selectedDayId, selectedEventTypeId, selectedEventId]) => (
      !!selectedDayId
      && !!timetableDays
      && (!!selectedEventTypeId || !!selectedEventId)
    )),
    // TODO: Since UI is only showing timtable for single event there is no need to deal with days.
    map(([timetableDays, selectedDayId, selectedEventTypeId, selectedEventId]) => {
      const timetableDay: DayEventStageTimetable = timetableDays
        .find(day => day.id === selectedDayId);
      if (!timetableDay) return null;

      const timetableEvents = timetableDay.events
        .filter(event => {
          if (selectedEventId) {
            return event.event_id === selectedEventId
          }

          if (selectedEventTypeId) {
            return event.event_type_id === selectedEventTypeId
          }
        })
      if (timetableEvents.length === 0) return null;

      // Find first and last time for events
      const timeSpan = timetableEvents.reduce((acc, val) => {
        acc[0] = (acc[0] === undefined || val.first_start_time < acc[0]) ? val.first_start_time : acc[0]
        acc[1] = (acc[1] === undefined || val.last_end_time > acc[1]) ? val.last_end_time : acc[1]
        return acc;
      }, []);

      return {
        ...timetableDay,
        events: timetableEvents,
        // First last time is overwritten based on selected events
        first_start_time: timeSpan[0],
        last_end_time: timeSpan[1]
      };
    })
  )

  eventTypeColor$: Observable<string> = this.filterEventsStateService.selectedEventType$.pipe(
    map(eventType => eventType.color)
  );

}
