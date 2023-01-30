import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketsStateService } from './state/tickets-state.service';
import { Browser } from '@capacitor/browser';
import { EventsGroupedByType } from '@app/interfaces/event-type';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {

  eventsGroupedByType$: Observable<EventsGroupedByType[]>;

  constructor(
    private ticketStateService: TicketsStateService,
  ) { }

  ngOnInit() {
    this.eventsGroupedByType$ = this.ticketStateService.eventsGroupedByType$;
  }

  onGoToTicket(ticketUrl: string): void {
    Browser.open({
      url: ticketUrl
    })
  }

}
