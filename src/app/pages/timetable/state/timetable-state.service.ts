import { Injectable, inject } from '@angular/core';
import { DayEventStageTimetable } from '@app/interfaces/day-event-stage-timetable';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { FavoritesService } from '@app/services/favorites.service';
import { SupabaseService } from '@app/services/supabase.service';
import { Observable, combineLatest, concat } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class TimetableStateService {

  private supabase = inject(SupabaseService);
  private deviceStorageService = inject(DeviceStorageService);
  private favoritesService = inject(FavoritesService)

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
    this.favoritesService.favorites$
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
                      isFavorite: favorites.find(favorite => favorite.entity === 'artist').ids.includes(act.artist_id)
                    }))
                }))
            }))
        }));

      return daysWithFavorites
    }),
    shareReplay(1)
  )
}
