import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsPage } from '@blockparty/festival/feature/page/ticket';
import {
  IonItem,
  IonAccordion,
  IonLabel,
  IonList,
  IonIcon,
} from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'lib-ticket-karrusel',
  imports: [
    IonIcon,
    IonList,
    IonLabel,
    IonAccordion,
    IonItem,
    CommonModule,
    TicketsPage,
  ],
  templateUrl: './ticket-karrusel.component.html',
  styleUrl: './ticket-karrusel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketKarruselComponent {
  onGoToTicket(ticketUrl: string): void {
    Browser.open({
      url: ticketUrl,
    });
  }
}
