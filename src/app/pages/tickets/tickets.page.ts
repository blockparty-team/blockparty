import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketsStateService } from './state/tickets-state.service';
import { tap } from 'rxjs/operators';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {

  eventTypes$: Observable<any[]>;

  constructor(
    private ticketStateService: TicketsStateService,
  ) { }

  ngOnInit() {
    this.eventTypes$ = this.ticketStateService.eventTypes$.pipe(tap(console.log));
  }

  onGoToTicket(ticketUrl: string): void {
    Browser.open({
      url: ticketUrl
    })
  }

}
