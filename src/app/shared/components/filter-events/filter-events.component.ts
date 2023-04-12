import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FilterEventsStateService } from './filter-events-state.service';

@Component({
    selector: 'app-filter-events',
    templateUrl: './filter-events.component.html',
    styleUrls: ['./filter-events.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterEventsComponent {

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