import { Injectable } from '@angular/core';
import { EventsGroupedByType } from '@app/interfaces/event-type';
import { EventStateService } from '@app/pages/event/state/event-state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketsStateService {

  eventsGroupedByType$: Observable<EventsGroupedByType[]> = this.eventStateService.eventsGroupedByType.pipe(
    map(eventTypes => eventTypes
      // Only include eventtypes/events with tickets
      .filter(eventType => eventType.event.some(event => event.ticket_url))
      .map(eventType => ({
        ...eventType,
        event: eventType.event.filter(event => !!event.ticket_url)
      }))
    )
  );

  constructor(
    private eventStateService: EventStateService,
  ) { }
}
