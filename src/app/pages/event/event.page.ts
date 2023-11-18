import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventViewModel } from '@app/interfaces/event';
import { IonModal, SegmentCustomEvent, IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { EventStateService } from './state/event-state.service';
import { EventsGroupedByType } from '@app/interfaces/event-type';
import { RouteName } from '@app/shared/models/routeName';
import { EventCardComponent } from './event-card/event-card.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-event',
    templateUrl: './event.page.html',
    styleUrls: ['./event.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgIf,
        NgFor,
        EventCardComponent,
        AsyncPipe,
    ],
})
export class EventPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;

  events$: Observable<EventViewModel[]>;
  eventTypes$: Observable<EventsGroupedByType[]>;
  selectedEventTypeId$: Observable<string>;

  constructor(
    private eventStateService: EventStateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.events$ = this.eventStateService.events$;
    this.eventTypes$ = this.eventStateService.eventsGroupedByType;
    this.selectedEventTypeId$ = this.eventStateService.selectedEventTypeId$;
  }

  onGoToEvent(eventId: string): void {
    this.router.navigate([RouteName.Event, eventId]);
  }

  onEventTypeFilterChange(event: Event): void {
    this.eventStateService.selectEventTypeId((event as SegmentCustomEvent).detail.value.toString());
  }


  dismiss() {
    this.modal.dismiss(null, 'cancel');
  }

}
