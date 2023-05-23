import { Injectable, inject } from '@angular/core';
import { Observable, concat } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators'
import { SupabaseService } from '@app/services/supabase.service';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { DayEventStageTimetable } from '@app/interfaces/day-event-stage-timetable';
import { ArtistNotification } from '@app/interfaces/favorite-notification';


@Injectable({
  providedIn: 'root'
})
export class TimetableSharedStateService {

  private supabase = inject(SupabaseService);
  private deviceStorageService = inject(DeviceStorageService);

  timetables$: Observable<DayEventStageTimetable[]> = concat(
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

  // Flattened timetables for rescheduling local notifications
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
    ),
    shareReplay(1)
  );

}
