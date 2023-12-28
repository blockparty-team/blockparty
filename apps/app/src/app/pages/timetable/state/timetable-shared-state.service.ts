import { Injectable, inject } from '@angular/core';
import { Observable, concat } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { SupabaseService } from '@shared/data-access/supabase';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { DayEventStageTimetable } from '@app/interfaces/day-event-stage-timetable';
import { ArtistNotification } from '@app/interfaces/favorite-notification';
import { ArtistViewModel } from '@app/interfaces/artist';
import { ArtistSharedStateService } from '@app/pages/artist/state/artist-shared-state.service';

@Injectable({
  providedIn: 'root',
})
export class TimetableSharedStateService {
  private supabase = inject(SupabaseService);
  private deviceStorageService = inject(DeviceStorageService);
  private artistSharedStateService = inject(ArtistSharedStateService);

  timetables$: Observable<DayEventStageTimetable[]> = concat(
    this.deviceStorageService
      .get('timetable')
      .pipe(filter((timetables) => !!timetables)),
    this.supabase.timetables$.pipe(
      filter((timetables) => !!timetables),
      tap((timetables) =>
        this.deviceStorageService.set('timetable', timetables)
      )
    )
  ).pipe(
    filter((days) => !!days),
    shareReplay(1)
  );

  // Flattened timetables for rescheduling local notifications
  timetableArtistNotification$: Observable<ArtistNotification[]> =
    this.artistSharedStateService.artists$.pipe(
      map((artists: ArtistViewModel[]) =>
        artists.flatMap((artist) =>
          artist.timetable.flatMap(
            (timetable) =>
            ({
              artistId: artist.id,
              artistName: artist.name,
              startTime: timetable.start_time,
              stageName: timetable.stage.name,
              eventName: timetable.stage.event.name,
            } as any)
          )
        )
      ),
      shareReplay(1)
    );
}
