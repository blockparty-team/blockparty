import { Injectable } from '@angular/core';
import { SupabaseService } from '@app/services/supabase.service';
import { Observable, concat } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketsStateService {

  constructor(
    private supabase: SupabaseService
  ) { }

  eventTypes$: Observable<any[]> = concat(
    this.supabase.eventTypes$.pipe(
      filter(eventTypes => !!eventTypes),
      map(eventTypes => eventTypes.map(eventType => ({
        ...eventType,
        event: eventType.event.filter(event => !!event.ticket_url)
      })))
    )
  ).pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );
}
