import { ChangeDetectionStrategy, Component, EventEmitter, ElementRef, Output, OnInit, ViewChild } from '@angular/core';
import { SegmentCustomEvent } from '@ionic/angular';
import { DayEvent, PartialEvent, PartialEventType } from '@app/interfaces/day-event';
import { Observable, BehaviorSubject, combineLatest, concat } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, shareReplay, startWith, tap, withLatestFrom } from 'rxjs/operators'
import { FilterEventsService } from './filter-events.service';

@Component({
    selector: 'app-filter-events',
    templateUrl: './filter-events.component.html',
    styleUrls: ['./filter-events.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterEventsComponent implements OnInit {

    @Output() selectedDayId: EventEmitter<string> = new EventEmitter<string>();
    @Output() selectedEventTypeId: EventEmitter<string> = new EventEmitter<string>();
    @Output() selectedEventId: EventEmitter<string> = new EventEmitter<string>();

    days$: Observable<DayEvent[]>;
    eventTypes$: Observable<PartialEventType[]>;
    events$: Observable<PartialEvent[]>;
    
    selectedDayId$: Observable<string>;
    selectedEventTypeId$: Observable<string>;
    selectedEventId$: Observable<string>;

    constructor(
        private filterEventsService: FilterEventsService,
    ) {}

    onDayFilterSelect(id: string): void {
        this.filterEventsService.selectDay(id);
        this.selectedDayId.emit(id);
      }
    
    onEventTypeFilterSelect(id: string): void {
        this.filterEventsService.selectEventType(id);
        this.selectedEventTypeId.emit(id);
    }

    onEventFilterSelect(id: string): void {
        this.filterEventsService.selectEvent(id);
        this.selectedEventId.emit(id);
    }

    ngOnInit(): void {
        this.days$ = this.filterEventsService.days$;
        this.eventTypes$ = this.filterEventsService.eventTypes$;
        this.events$ = this.filterEventsService.events$;
        this.selectedDayId$ = this.filterEventsService.selectedDayId$;
        this.selectedEventTypeId$ = this.filterEventsService.selectedEventTypeId$;

        // this.filterEventsService.selectedEvent$.subscribe(event => this.selectedEvent.emit(event.id));
    }
}