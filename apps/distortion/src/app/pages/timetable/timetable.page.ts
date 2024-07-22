import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { isSameDay, sub } from 'date-fns';
import { EventFilterStateService } from '@blockparty/festival/data-access/state/event-filter';
import { TimetableStateService } from '@blockparty/festival/data-access/state/timetable';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { TimetableListComponent } from './timetable-list/timetable-list.component';
import { TimetableGanttComponent } from './timetable-gantt/timetable-gantt.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { EventFilterComponent } from '@blockparty/festival/feature/event-filter';
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
  providers: [TimetableStateService, EventFilterStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    EventFilterComponent,
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
  private eventFilterStateService = inject(EventFilterStateService);

  private _timetableViewMode$ = new BehaviorSubject<TimeTableViewMode>('gantt');
  timetableViewMode$: Observable<TimeTableViewMode> =
    this._timetableViewMode$.asObservable();

  private abandon$ = new Subject<void>();

  ngOnInit(): void {
    // Default select first day, event type and event
    this.eventFilterStateService.days$
      .pipe(
        tap((days) => {
          // Change day at 7am next day (for events running during nighttime)
          const now = sub(new Date(), { hours: 7 });
          const day = days.find((day) => isSameDay(now, new Date(day.day)));

          if (day) {
            this.eventFilterStateService.selectDay(day.id);
          } else {
            this.eventFilterStateService.selectDay(days[0].id);
          }
        }),
        takeUntil(this.abandon$),
      )
      .subscribe();

    this.eventFilterStateService.eventTypes$
      .pipe(
        tap((eventTypes) =>
          this.eventFilterStateService.selectEventType(eventTypes[0].id),
        ),
        takeUntil(this.abandon$),
      )
      .subscribe();

    this.eventFilterStateService.events$
      .pipe(
        filter((events) => !!events),
        tap((events) => this.eventFilterStateService.selectEvent(events[0].id)),
        takeUntil(this.abandon$),
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
