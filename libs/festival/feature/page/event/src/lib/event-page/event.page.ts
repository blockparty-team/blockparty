import { Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouteName } from '@blockparty/festival/shared/types';
import {
  EventViewModel,
  EventsGroupedByType,
} from '@blockparty/festival/data-access/supabase';
import { SegmentCustomEvent } from '@ionic/angular/standalone';
import { EventStateService } from '@blockparty/festival/data-access/state/event';
import { EventCardComponent } from './event-card/event-card.component';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonTitle,
  IonContent,
  IonModal,
  IonIcon,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  imports: [
    EventCardComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonTitle,
    IonContent,
    IonModal,
    IonIcon,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
  ],
})
export class EventPage {
  private eventStateService = inject(EventStateService);
  private router = inject(Router);
  private emptyEvents: EventViewModel[] = [];
  private emptyEventTypes: EventsGroupedByType[] = [];

  readonly modal = viewChild.required(IonModal);

  events = toSignal(this.eventStateService.events$, {
    initialValue: this.emptyEvents,
  });
  eventTypes = toSignal(this.eventStateService.eventsGroupedByType, {
    initialValue: this.emptyEventTypes,
  });

  onGoToEvent(eventId: string): void {
    this.router.navigate([RouteName.Event, eventId]);
  }

  onEventTypeFilterChange(event: Event): void {
    this.eventStateService.selectEventTypeId(
      (event as SegmentCustomEvent).detail.value!.toString(),
    );
  }

  dismiss() {
    this.modal().dismiss(null, 'cancel');
  }
}
