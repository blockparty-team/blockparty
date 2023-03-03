import { ChangeDetectionStrategy, Component, ElementRef, Output, OnInit, ViewChild } from '@angular/core';
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

    @Output() selectedEvent$: Observable<PartialEvent>;

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
      }
    
    onEventTypeFilterSelect(id: string): void {
        this.filterEventsService.selectEventType(id);
    }

    onEventFilterSelect(id: string): void {
        this.filterEventsService.selectEvent(id);
    }

    ngOnInit(): void {
        this.days$ = this.filterEventsService.days$;
        this.days$.pipe(tap(console.log));
        this.selectedEvent$ = this.filterEventsService.selectedEvent$;
    }
}