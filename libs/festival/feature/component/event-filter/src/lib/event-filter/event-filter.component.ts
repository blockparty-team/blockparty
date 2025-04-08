import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { EventFilterStateService } from '@blockparty/festival/data-access/state/event-filter';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { AppConfigService } from '@blockparty/festival/data-access/state/app-config';
import { AppConfig } from '@blockparty/festival/shared/types';

@Component({
    selector: 'app-event-filter',
    templateUrl: './event-filter.component.html',
    styleUrls: ['./event-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        IonHeader,
        IonToolbar,
        IonSegment,
        IonSegmentButton,
        IonLabel,
    ]
})
export class EventFilterComponent {
  private eventFilterStateService = inject(EventFilterStateService);
  public filterConfig = inject(AppConfigService).appConfig.eventFilter;

  inputConfig = input<Partial<AppConfig['eventFilter']>>();

  days$ = this.eventFilterStateService.days$;
  eventTypes$ = this.eventFilterStateService.eventTypes$;
  events$ = this.eventFilterStateService.events$;

  selectedDayId$ = this.eventFilterStateService.selectedDayId$;
  selectedEventTypeId$ = this.eventFilterStateService.selectedEventTypeId$;
  selectedEventId$ = this.eventFilterStateService.selectedEventId$;

  onDaySelect(id: string): void {
    this.eventFilterStateService.selectDay(id);
  }

  onEventTypeSelect(id: string): void {
    this.eventFilterStateService.selectEventType(id);
  }

  onEventSelect(id: string): void {
    this.eventFilterStateService.selectEvent(id);
  }
}
