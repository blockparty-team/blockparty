import { Injectable } from '@angular/core';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { DayWithRelations } from '@app/interfaces/entities-with-releation';
import { DayEventStageTimetable } from '@app/interfaces/day-event-stage-timetable';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { SupabaseService } from '@app/services/supabase.service';
import { concat, Observable } from 'rxjs';
import { tap, shareReplay, distinctUntilChanged, filter } from 'rxjs/operators';
import { DayEventMask } from '@app/interfaces/database-entities';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  days$: Observable<DayWithRelations[]> = this.supabase.days$.pipe(
    shareReplay(1)
  );

  timetables$: Observable<DayEventStageTimetable[]> = concat(
    this.deviceStorageService.get('timetable').pipe(
      filter(days => !!days)
    ),
    this.supabase.timetables$.pipe(
      tap(timetable => this.deviceStorageService.set('timetable', timetable))
    )
  ).pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  artists$: Observable<ArtistWithRelations[]> = concat(
    this.deviceStorageService.get('artists'),
    this.supabase.artists$.pipe(
      tap(artists => this.deviceStorageService.set('artists', artists))
    )
  ).pipe(
    filter(artists => !!artists),
    distinctUntilChanged(),
    shareReplay(1)
  );

  dayMaskBounds$: Observable<DayEventMask[]> = this.supabase.dayMaskBounds$.pipe(
    shareReplay(1)
  );

  constructor(
    private supabase: SupabaseService,
    private deviceStorageService: DeviceStorageService
  ) { }

}
