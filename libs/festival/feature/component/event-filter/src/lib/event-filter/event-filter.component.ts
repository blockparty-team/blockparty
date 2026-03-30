import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { EventFilterStateService } from '@blockparty/festival/data-access/state/event-filter';
import {
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { AppConfigService } from '@blockparty/festival/data-access/state/app-config';
import { AppConfig } from '@blockparty/festival/data-access/supabase';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonToolbar, IonSegment, IonSegmentButton, IonLabel],
})
export class EventFilterComponent {
  private eventFilterStateService = inject(EventFilterStateService);
  public filterConfig = inject(AppConfigService).appConfig.eventFilter;

  inputConfig = input<Partial<AppConfig['eventFilter']>>();

  days = toSignal(this.eventFilterStateService.days$, {
    initialValue: [],
  });
  eventTypes = toSignal(this.eventFilterStateService.eventTypes$, {
    initialValue: [],
  });
  events = toSignal(this.eventFilterStateService.events$, {
    initialValue: [],
  });

  selectedDayId = toSignal(this.eventFilterStateService.selectedDayId$, {
    initialValue: null,
  });
  selectedEventTypeId = toSignal(
    this.eventFilterStateService.selectedEventTypeId$,
    {
      initialValue: null,
    },
  );
  selectedEventId = toSignal(this.eventFilterStateService.selectedEventId$, {
    initialValue: null,
  });

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
