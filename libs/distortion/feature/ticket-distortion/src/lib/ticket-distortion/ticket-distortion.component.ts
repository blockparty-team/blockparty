import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonAccordion,
  IonItem,
  IonList,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';
import { TicketsPage } from '@blockparty/festival/feature/page/ticket';

@Component({
  selector: 'lib-ticket-distortion',
  imports: [IonLabel, IonIcon, IonList, IonItem, IonAccordion, TicketsPage],
  templateUrl: './ticket-distortion.component.html',
  styleUrl: './ticket-distortion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketDistortionComponent {
  onGoToTicket(ticketUrl: string): void {
    Browser.open({
      url: ticketUrl,
    });
  }
}
