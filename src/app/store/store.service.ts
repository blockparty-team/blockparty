import { Injectable } from '@angular/core';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { DayWithRelations } from '@app/interfaces/entities-with-releation';
import { DayEventStageTimetable } from '@app/interfaces/day-event-stage-timetable';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { SupabaseService } from '@app/services/supabase.service';
import { concat, Observable } from 'rxjs';
import { tap, shareReplay, distinctUntilChanged, filter } from 'rxjs/operators';
import { DayEventMask, Event } from '@app/interfaces/database-entities';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  days$: Observable<DayWithRelations[]> = this.supabase.days$.pipe(
    shareReplay(1)
  );

  events$: Observable<Pick<Event, 'id' | 'name' | 'description'>[]> = concat(
    this.deviceStorageService.get('events').pipe(
      filter(events => !!events)
    ),
    this.supabase.events$.pipe(
      tap(events => this.deviceStorageService.set('events', events)),
      filter(events => !!events)
    )
  ).pipe(
    distinctUntilChanged(),
    shareReplay(1)
  )
  
  timetables$: Observable<DayEventStageTimetable[]> = concat(
    this.deviceStorageService.get('timetable').pipe(
      filter(timetables => !!timetables)
    ),
    this.supabase.timetables$.pipe(
      tap(timetables => this.deviceStorageService.set('timetable', timetables)),
      filter(timetables => !!timetables)
    )
  ).pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  artists$: Observable<ArtistWithRelations[]> = concat(
    this.deviceStorageService.get('artists').pipe(
      filter(artists => !!artists)
    ),
    this.supabase.artists$.pipe(
      tap(artists => this.deviceStorageService.set('artists', artists)),
      filter(artists => !!artists)
    )
  ).pipe(
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
