import { Injectable } from '@angular/core';
import { EventsGroupedByType } from '@app/interfaces/event-type';
import { DeviceStorageService } from '@app/services/device-storage.service';
import { SupabaseService } from '@app/services/supabase.service';
import { Observable, concat } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketsStateService {

  eventsGroupedByType$: Observable<EventsGroupedByType[]> = concat(
    this.deviceStorageService.get('eventsGroupedByType').pipe(
      filter(eventTypes => !!eventTypes)
    ),
    this.supabase.eventsGroupedByTypes$.pipe(
      filter(eventTypes => !!eventTypes),
      map(eventTypes => eventTypes
        // Only include eventtypes/events with tickets
        .filter(eventType => eventType.event.some(event => event.ticket_url))
        .map(eventType => ({
          ...eventType,
          event: eventType.event.filter(event => !!event.ticket_url)
        }))
      ),
      tap(eventTypes => this.deviceStorageService.set('eventsGroupedByType', eventTypes))
    )
  ).pipe(
    shareReplay(1)
  );

  constructor(
    private supabase: SupabaseService,
    private deviceStorageService: DeviceStorageService
  ) { }
}
