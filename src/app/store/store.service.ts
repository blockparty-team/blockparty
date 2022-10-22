import { Injectable } from '@angular/core';
import { ArtistWithRelations } from '@app/interfaces/artist';
import { DayEvent } from '@app/interfaces/day-event';
import { DayEventStageTimetable } from '@app/interfaces/day-event-stage-timetable';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { SupabaseService } from '@app/services/supabase.service';
import { concat, forkJoin, Observable } from 'rxjs';
import { tap, shareReplay, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { DayEventMask } from '@app/interfaces/database-entities';
import { EventWithRelations } from '@app/interfaces/event';
import { MapSource, MapSourceGeojson } from '@app/interfaces/map-layer';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  days$: Observable<DayEvent[]> = concat(
    this.deviceStorageService.get('days').pipe(
      filter(days => !!days)
    ),
    this.supabase.days$.pipe(
      filter(days => !!days),
      tap(days => this.deviceStorageService.set('days', days))
    )
  ).pipe(
    distinctUntilChanged(),
    shareReplay(1)
  )

  events$: Observable<EventWithRelations[]> = concat(
    this.deviceStorageService.get('events').pipe(
      filter(events => !!events)
    ),
    this.supabase.events$.pipe(
      filter(events => !!events),
      tap(events => this.deviceStorageService.set('events', events))
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
      filter(timetables => !!timetables),
      tap(timetables => this.deviceStorageService.set('timetable', timetables))
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
      filter(artists => !!artists),
      tap(artists => this.deviceStorageService.set('artists', artists))
    )
  ).pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  dayMaskBounds$: Observable<DayEventMask[]> = this.supabase.dayMaskBounds$.pipe(
    shareReplay(1)
  );

  mapLayers$: Observable<MapSourceGeojson[]> = concat(
    this.deviceStorageService.get('mapLayers').pipe(
      filter(layers => !!layers)
    ),
    forkJoin(
      Object.values(MapSource)
        .map(layer => this.supabase.tableAsGeojson(layer))
    ).pipe(
      filter(layers => !!layers),
      map(layers => Object.values(MapSource)
        .map((mapSource, i) => ({ mapSource, geojson: layers[i] }))
      ),
      tap(layers => this.deviceStorageService.set('mapLayers', layers))
    )
  ).pipe(
    distinctUntilChanged(),
    shareReplay(1)
  )

  constructor(
    private supabase: SupabaseService,
    private deviceStorageService: DeviceStorageService
  ) { }

}
