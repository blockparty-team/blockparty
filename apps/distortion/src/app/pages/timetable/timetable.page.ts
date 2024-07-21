import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { isSameDay, sub } from 'date-fns';
import { FilterEventsStateService } from '@blockparty/festival/data-access/state/filter-events';
import { TimetableStateService } from '@blockparty/festival/data-access/state/timetable';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { TimetableListComponent } from './timetable-list/timetable-list.component';
import { TimetableGanttComponent } from './timetable-gantt/timetable-gantt.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { FilterEventsComponent } from '../../shared/components/filter-events/filter-events.component';
import {
  IonHeader,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';

type TimeTableViewMode = 'gantt' | 'list';

@Component({
  selector: 'app-timetable',
  templateUrl: 'timetable.page.html',
  styleUrls: ['timetable.page.scss'],
  providers: [TimetableStateService, FilterEventsStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FilterEventsComponent,
    NgIf,
    TimetableGanttComponent,
    TimetableListComponent,
    AsyncPipe,
    IonHeader,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class TimetablePage implements OnInit, OnDestroy {
  private filterEventsStateService = inject(FilterEventsStateService);

  private _timetableViewMode$ = new BehaviorSubject<TimeTableViewMode>('gantt');
  timetableViewMode$: Observable<TimeTableViewMode> =
    this._timetableViewMode$.asObservable();

  private abandon$ = new Subject<void>();

  ngOnInit(): void {
    // Default select first day, event type and event
    this.filterEventsStateService.days$
      .pipe(
        tap((days) => {
          // Change day at 7am next day (for events running during nighttime)
          const now = sub(new Date(), { hours: 7 });
          const day = days.find((day) => isSameDay(now, new Date(day.day)));

          if (day) {
            this.filterEventsStateService.selectDay(day.id);
          } else {
            this.filterEventsStateService.selectDay(days[0].id);
          }
        }),
        takeUntil(this.abandon$)
      )
      .subscribe();

    this.filterEventsStateService.eventTypes$
      .pipe(
        tap((eventTypes) =>
          this.filterEventsStateService.selectEventType(eventTypes[0].id)
        ),
        takeUntil(this.abandon$)
      )
      .subscribe();

    this.filterEventsStateService.events$
      .pipe(
        filter((events) => !!events),
        tap((events) =>
          this.filterEventsStateService.selectEvent(events[0].id)
        ),
        takeUntil(this.abandon$)
      )
      .subscribe();
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
