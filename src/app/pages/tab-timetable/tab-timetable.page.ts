import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DayWithRelations } from '@app/interfaces/entities-with-releation';
import { StoreService } from '@app/store/store.service';
import { SegmentCustomEvent } from '@ionic/angular';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, pluck } from 'rxjs/operators';
import { TimetableStateService } from './state/timetable-state.service';

@Component({
  selector: 'app-tab-timetable',
  templateUrl: 'tab-timetable.page.html',
  styleUrls: ['tab-timetable.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabTimetablePage implements OnInit {

  days$: Observable<DayWithRelations[]>;
  events$: Observable<DayWithRelations['event']>;
  selectedDayId$: Observable<string>;
  selectedEventId$: Observable<string>;


  constructor(
    private store: StoreService,
    private timetableStateService: TimetableStateService
  ) { }

  ngOnInit(): void {
    this.days$ = this.store.days$;
    this.selectedDayId$ = this.timetableStateService.selectedDay$
    this.events$ = combineLatest([
      this.days$,
      this.timetableStateService.selectedDay$
    ]).pipe(
      filter(([days, selectedDay]) => !!days && !!selectedDay),
      map(([days, selectedDay]) => days.find(day => day.id === selectedDay)),
      pluck('event')
    );
  }

  onDayFilterChange(event: Event): void {
    this.timetableStateService.selectDay((event as SegmentCustomEvent).detail.value);
  }

  onEventFilterChange(event: Event): void {
    this.timetableStateService.selectEvent((event as SegmentCustomEvent).detail.value);
  }


}
