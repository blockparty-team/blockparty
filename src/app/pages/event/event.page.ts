import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventViewModel } from '@app/interfaces/event';
import { Observable } from 'rxjs';
import { EventStateService } from './state/event-state.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  events$: Observable<EventViewModel[]>;

  constructor(
    private eventStateService: EventStateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.events$ = this.eventStateService.events$;
  }

  onGoToEvent(eventId: string) {
    this.router.navigate(['/event', eventId]);
  }

}
