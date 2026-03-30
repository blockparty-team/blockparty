import { Component, inject } from '@angular/core';
import { TicketStateService } from '@blockparty/festival/data-access/state/ticket';
import { Browser } from '@capacitor/browser';
import { EventsGroupedByType } from '@blockparty/festival/data-access/supabase';
import {
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
  IonIcon,
} from '@ionic/angular/standalone';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
  imports: [
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
    IonIcon,
  ],
})
export class TicketsPage {
  private ticketStateService = inject(TicketStateService);
  private emptyEventTypes: EventsGroupedByType[] = [];

  eventsGroupedByType = toSignal(this.ticketStateService.eventsGroupedByType$, {
    initialValue: this.emptyEventTypes,
  });

  onGoToTicket(ticketUrl: string): void {
    Browser.open({
      url: ticketUrl,
    });
  }
}
