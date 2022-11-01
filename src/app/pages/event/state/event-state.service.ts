import { Injectable } from '@angular/core';
import { EventViewModel, EventWithRelations } from '@app/interfaces/event';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { SupabaseService } from '@app/services/supabase.service';
import { pathToImageUrl } from '@app/shared/utils';
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
    map(events => events.map(event => ({
      ...event,
      imgUrl: pathToImageUrl(event.storage_path)
    }))),
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
  ) { }

  selectEventTypeId(eventTypeId: string): void {
    console.log(eventTypeId);
    this._selectedEventTypeId$.next(eventTypeId);

  }

}
