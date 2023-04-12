import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FilterEventsStateService } from '@app/shared/components/filter-events/filter-events-state.service';
import { TimetableStateService } from './state/timetable-state.service';
import { filter, takeUntil, tap } from 'rxjs/operators';

type TimeTableViewMode = 'gantt' | 'list'

@Component({
  selector: 'app-timetable',
  templateUrl: 'timetable.page.html',
  styleUrls: ['timetable.page.scss'],
  providers: [
    TimetableStateService,
    FilterEventsStateService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimetablePage implements OnInit, OnDestroy {

  private filterEventsStateService = inject(FilterEventsStateService);

  private _timetableViewMode$ = new BehaviorSubject<TimeTableViewMode>('gantt');
  timetableViewMode$: Observable<TimeTableViewMode> = this._timetableViewMode$.asObservable();

  private abandon$ = new Subject<void>();

  ngOnInit(): void {
    // Default select first day, event type and event
    this.filterEventsStateService.days$.pipe(
      tap(days => this.filterEventsStateService.selectDay(days[0].id)),
      takeUntil(this.abandon$)
    ).subscribe();

    this.filterEventsStateService.eventTypes$.pipe(
      tap(eventTypes => this.filterEventsStateService.selectEventType(eventTypes[0].id)),
      takeUntil(this.abandon$),
    ).subscribe();

    this.filterEventsStateService.events$.pipe(
      filter(events => !!events),
      tap(events => this.filterEventsStateService.selectEvent(events[0].id)),
      takeUntil(this.abandon$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.abandon$.next();
    this.abandon$.complete();
  }

  onToggleTimetableView(): void {
    this._timetableViewMode$.value === 'gantt'
      ? this._timetableViewMode$.next('list')
      : this._timetableViewMode$.next('gantt');
  }
}
