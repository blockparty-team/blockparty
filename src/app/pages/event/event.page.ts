import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventViewModel } from '@app/interfaces/event';
import { SegmentCustomEvent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { EventStateService } from './state/event-state.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  events$: Observable<EventViewModel[]>;
  eventTypes$: Observable<EventViewModel['event_type'][]>;
  selectedEventTypeId$: Observable<string>;

  constructor(
    private eventStateService: EventStateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.events$ = this.eventStateService.events$;
    this.eventTypes$ = this.eventStateService.eventTypes$;
    this.selectedEventTypeId$ = this.eventStateService.selectedEventTypeId$;
  }

  onGoToEvent(eventId: string): void {
    this.router.navigate(['/event', eventId]);
  }

  onEventTypeFilterChange(event: Event): void {
    this.eventStateService.selectEventTypeId((event as SegmentCustomEvent).detail.value);
  }

}
