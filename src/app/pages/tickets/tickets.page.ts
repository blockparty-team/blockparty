import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketsStateService } from './state/tickets-state.service';
import { Browser } from '@capacitor/browser';
import { EventsGroupedByType } from '@app/interfaces/event-type';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonList,
    IonIcon
  ],
})
export class TicketsPage implements OnInit {

  private ticketStateService = inject(TicketsStateService);

  eventsGroupedByType$: Observable<EventsGroupedByType[]>;

  ngOnInit() {
    this.eventsGroupedByType$ = this.ticketStateService.eventsGroupedByType$;
  }

  onGoToTicket(ticketUrl: string): void {
    Browser.open({
      url: ticketUrl
    })
  }

}
