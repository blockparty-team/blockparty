import { Injectable } from '@angular/core';
import { Event } from '@app/interfaces/database-entities';
import { EventViewModel, EventWithRelations } from '@app/interfaces/event';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { FileService } from '@app/services/file.service';
import { SupabaseService } from '@app/services/supabase.service';
import { getBucketAndPath } from '@app/shared/functions/storage';
import { BehaviorSubject, concat, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventStateService {

  private _selectedEventTypeId$ = new BehaviorSubject<string>(null);
  selectedEventTypeId$: Observable<string> = this._selectedEventTypeId$.asObservable();

  events$: Observable<EventViewModel[]> = concat(
    this.deviceStorageService.get('events').pipe(
      filter(events => !!events)
    ),
    this.supabase.events$.pipe(
      filter(events => !!events),
      tap(events => this.deviceStorageService.set('events', events))
    )
  ).pipe(
    map(events => events.map((event: EventWithRelations) => {
      // Make artist and day root properties
      const { day_event, stage, ...rest } = event
      return {
        ...rest,
        artists: stage
          .flatMap(stage => stage.timetable.map(t => t.artist))
          .sort((a, b) => a.name.localeCompare(b.name)),
        days: day_event.map(day => day.day.name)
      }
    })),
    map(events => events.map((event: Event) => {

      const [bucket, path] = getBucketAndPath(event.storage_path);

      const srcset = bucket && path
        ? this.fileService.imageSrcset(bucket, path)
        : 'assets/distortion_logo.png';

      return {
        ...event,
        imgUrl: bucket && path
          ? this.supabase.publicImageUrl(bucket, path)
          : 'assets/distortion_logo.png',
        srcset
      }
    })),
    distinctUntilChanged(),
    shareReplay(1)
  )

  eventTypes$: Observable<EventViewModel['event_type'][]> = this.events$.pipe(
    map(events => {
      const eventTypes = events.map(event => event.event_type)
      // Get unique event types
      return [...new Map(eventTypes.map(i => [i.id, i])).values()]
    })
  )

  constructor(
    private supabase: SupabaseService,
    private deviceStorageService: DeviceStorageService,
    private fileService: FileService
  ) { }

  selectEventTypeId(eventTypeId: string): void {
    this._selectedEventTypeId$.next(eventTypeId);

  }

}
