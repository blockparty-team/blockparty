import { Injectable } from '@angular/core';
import { Event } from '@distortion/app/interfaces/database-entities';
import {
  EventViewModel,
  EventWithRelations,
} from '@distortion/app/interfaces/event';
import { EventsGroupedByType } from '@distortion/app/interfaces/event-type';
import { DeviceStorageService } from '@blockparty/shared/data-access/device-storage';
import { FileService } from '@distortion/app/services/file.service';
import { SupabaseService } from '@blockparty/shared/data-access/supabase-service';
import { getBucketAndPath } from '@distortion/app/shared/functions/storage';
import { BehaviorSubject, concat, EMPTY, Observable } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  tap,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EventStateService {
  private _selectedEventTypeId$ = new BehaviorSubject<string>(null);
  selectedEventTypeId$: Observable<string> =
    this._selectedEventTypeId$.asObservable();

  events$: Observable<EventViewModel[]> = concat(
    this.deviceStorageService.get('events').pipe(filter((events) => !!events)),
    this.supabase.events$.pipe(
      filter((events) => !!events),
      tap((events) => this.deviceStorageService.set('events', events))
    )
  ).pipe(
    map((events) =>
      events.map((event: EventWithRelations) => {
        // Make artist and day root properties
        const { day_event, stage, ...rest } = event;
        return {
          ...rest,
          artists: stage
            .flatMap((stage) => stage.timetable.map((t) => t.artist))
            .filter((artist) => !!artist)
            .sort((a, b) => a.name.localeCompare(b.name)),
          days: day_event.map((day) => day.day.name),
        };
      })
    ),
    map((events) =>
      events.map((event: Event) => {
        const [bucket, path] = getBucketAndPath(event.storage_path);

        const srcset =
          bucket && path ? this.fileService.imageSrcset(bucket, path) : null;

        return {
          ...event,
          imgUrl:
            bucket && path ? this.supabase.publicImageUrl(bucket, path) : null,
          srcset,
        };
      })
    ),
    distinctUntilChanged(),
    catchError((err) => {
      console.error(err);
      return EMPTY;
    }),
    shareReplay(1)
  );

  eventsGroupedByType: Observable<EventsGroupedByType[]> = concat(
    this.deviceStorageService
      .get('eventsGroupedByType')
      .pipe(filter((eventTypes) => !!eventTypes)),
    this.supabase.eventsGroupedByTypes$.pipe(
      filter((eventTypes) => !!eventTypes),
      tap((eventTypes) =>
        this.deviceStorageService.set('eventsGroupedByType', eventTypes)
      )
    )
  );

  constructor(
    private supabase: SupabaseService,
    private deviceStorageService: DeviceStorageService,
    private fileService: FileService
  ) { }

  selectEventTypeId(eventTypeId: string): void {
    this._selectedEventTypeId$.next(eventTypeId);
  }
}
