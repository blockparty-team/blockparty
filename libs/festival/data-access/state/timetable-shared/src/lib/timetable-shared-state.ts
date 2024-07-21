import { Injectable, inject } from '@angular/core';
import { Observable, concat } from 'rxjs';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { SupabaseService } from '@blockparty/shared/data-access/supabase-service';
import { DeviceStorageService } from '@blockparty/shared/data-access/device-storage';
import {
  DayEventStageTimetable,
  ArtistNotification,
  ArtistViewModel,
} from '@blockparty/festival/types';
import { ArtistSharedStateService } from '@blockparty/festival/data-access/state/artist-shared';
import { RefreshService } from '@blockparty/festival/shared/service/refresh';

@Injectable({
  providedIn: 'root',
})
export class TimetableSharedStateService {
  private supabase = inject(SupabaseService);
  private deviceStorageService = inject(DeviceStorageService);
  private artistSharedStateService = inject(ArtistSharedStateService);
  private refreshService = inject(RefreshService);

  timetables$: Observable<DayEventStageTimetable[]> =
    this.refreshService.reloadData$.pipe(
      switchMap(() =>
        concat(
          this.deviceStorageService
            .get('timetable')
            .pipe(filter((timetables) => !!timetables)),
          this.supabase.timetables$.pipe(
            filter((timetables) => !!timetables),
            tap((timetables) =>
              this.deviceStorageService.set('timetable', timetables),
            ),
          ),
        ),
      ),
      filter((days) => !!days),
      shareReplay(1),
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
              }) as any,
          ),
        ),
      ),
      shareReplay(1),
    );
}
