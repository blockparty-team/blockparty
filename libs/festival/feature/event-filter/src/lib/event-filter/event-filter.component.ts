import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FilterEventsStateService } from '@blockparty/festival/data-access/state/filter-events';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
})
export class EventFilterComponent {
  private filterEventsStateService = inject(FilterEventsStateService);

  days$ = this.filterEventsStateService.days$;
  eventTypes$ = this.filterEventsStateService.eventTypes$;
  events$ = this.filterEventsStateService.events$;

  selectedDayId$ = this.filterEventsStateService.selectedDayId$;
  selectedEventTypeId$ = this.filterEventsStateService.selectedEventTypeId$;
  selectedEventId$ = this.filterEventsStateService.selectedEventId$;

  onDaySelect(id: string): void {
    this.filterEventsStateService.selectDay(id);
  }

  onEventTypeSelect(id: string): void {
    this.filterEventsStateService.selectEventType(id);
  }

  onEventSelect(id: string): void {
    this.filterEventsStateService.selectEvent(id);
  }
}
