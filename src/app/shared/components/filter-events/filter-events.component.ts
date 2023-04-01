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

    onDayFilterSelect(id: string): void {
        this.filterEventsStateService.selectDay(id);
    }

    onEventTypeFilterSelect(id: string): void {
        this.filterEventsStateService.selectEventType(id);
    }

    onEventFilterSelect(id: string): void {
        this.filterEventsStateService.selectEvent(id);
    }
}