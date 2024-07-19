import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EventViewModel, EventsGroupedByType } from '@blockparty/festival/types';
import { SegmentCustomEvent } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { EventStateService } from './state/event-state.service';
import { RouteName } from '@distortion/app/shared/models/routeName';
import { EventCardComponent } from './event-card/event-card.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
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

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    EventCardComponent,
    AsyncPipe,
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
export class EventPage implements OnInit {
  private eventStateService = inject(EventStateService);
  private router = inject(Router);

  @ViewChild(IonModal) modal: IonModal;

  events$: Observable<EventViewModel[]>;
  eventTypes$: Observable<EventsGroupedByType[]>;
  selectedEventTypeId$: Observable<string>;

  ngOnInit() {
    this.events$ = this.eventStateService.events$;
    this.eventTypes$ = this.eventStateService.eventsGroupedByType;
    this.selectedEventTypeId$ = this.eventStateService.selectedEventTypeId$;
  }

  onGoToEvent(eventId: string): void {
    this.router.navigate([RouteName.Event, eventId]);
  }

  onEventTypeFilterChange(event: Event): void {
    this.eventStateService.selectEventTypeId(
      (event as SegmentCustomEvent).detail.value.toString()
    );
  }

  dismiss() {
    this.modal.dismiss(null, 'cancel');
  }
}
