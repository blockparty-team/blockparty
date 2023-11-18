import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FilterEventsStateService } from './filter-events-state.service';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-filter-events',
    templateUrl: './filter-events.component.html',
    styleUrls: ['./filter-events.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, IonicModule, NgFor, AsyncPipe]
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