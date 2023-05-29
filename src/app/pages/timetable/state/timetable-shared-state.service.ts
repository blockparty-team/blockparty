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
  timetableArtistNotification$: Observable<ArtistNotification[]> = 
  concat(
    this.deviceStorageService.get('artists').pipe(
      filter(artists => !!artists)
    ),
    this.supabase.artists$.pipe(
      filter(artists => !!artists),
      tap(artists => this.deviceStorageService.set('artists', artists))
    )
  ).pipe(
    map(artists => artists
      .flatMap(artist => artist.timetable
        .flatMap(timetable => ({
          artistId: artist.id,
          artistName: artist.name,
          startTime: timetable.start_time,
          stageName: timetable.stage.name,
          eventName: timetable.stage.event.name
          }))
          )
        ),
    shareReplay(1)
  );
}
