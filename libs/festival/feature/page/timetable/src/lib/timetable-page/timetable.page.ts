import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { isSameDay, sub } from 'date-fns';
import { EventFilterStateService } from '@blockparty/festival/data-access/state/event-filter';
import { TimetableStateService } from '@blockparty/festival/data-access/state/timetable';
import { combineLatest } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { TimetableListComponent } from './timetable-list/timetable-list.component';
import { TimetableGanttComponent } from './timetable-gantt/timetable-gantt.component';
import { EventFilterComponent } from '@blockparty/festival/featurecomponent/event-filter';
import {
  IonHeader,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { AppConfigService } from '@blockparty/festival/data-access/state/app-config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-timetable',
  templateUrl: 'timetable.page.html',
  styleUrls: ['timetable.page.scss'],
  providers: [TimetableStateService, EventFilterStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EventFilterComponent,
    TimetableGanttComponent,
    TimetableListComponent,
    IonHeader,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class TimetablePage implements OnInit {
  private eventFilterStateService = inject(EventFilterStateService);
  private timetableConfig = inject(AppConfigService).appConfig.timetable;
  private destroyRef = inject(DestroyRef);

  private _timetableMode = signal(this.timetableConfig.mode());
  timetableMode = this._timetableMode.asReadonly();

  ngOnInit(): void {
    combineLatest([
      this.eventFilterStateService.days$,
      this.eventFilterStateService.selectedDayId$,
    ])
      .pipe(
        tap(([days, selectedDayId]) => {
          const firstDay = days[0];
          if (!firstDay) {
            return;
          }

          if (selectedDayId && days.some((day) => day.id === selectedDayId)) {
            return;
          }

          // Change day at 7am next day (for events running during nighttime)
          const now = sub(new Date(), { hours: 7 });
          const day = days.find((day) => isSameDay(now, new Date(day.day)));

          if (day) {
            this.eventFilterStateService.selectDay(day.id);
          } else {
            this.eventFilterStateService.selectDay(firstDay.id);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    combineLatest([
      this.eventFilterStateService.eventTypes$,
      this.eventFilterStateService.selectedEventTypeId$,
    ])
      .pipe(
        tap(([eventTypes, selectedEventTypeId]) => {
          const firstEventType = eventTypes[0];
          if (!firstEventType) {
            return;
          }

          if (eventTypes.length === 0) {
            return;
          }

          if (
            selectedEventTypeId &&
            eventTypes.some((eventType) => eventType.id === selectedEventTypeId)
          ) {
            return;
          }

          this.eventFilterStateService.selectEventType(firstEventType.id);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    combineLatest([
      this.eventFilterStateService.events$,
      this.eventFilterStateService.selectedEventId$,
    ])
      .pipe(
        filter(([events]) => !!events && events.length > 0),
        tap(([events, selectedEventId]) => {
          const firstEvent = events[0];
          if (!firstEvent) {
            return;
          }

          if (
            selectedEventId &&
            events.some((event) => event.id === selectedEventId)
          ) {
            return;
          }

          this.eventFilterStateService.selectEvent(firstEvent.id);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onToggleTimetableView(): void {
    this.timetableMode() === 'gantt'
      ? this._timetableMode.set('list')
      : this._timetableMode.set('gantt');
  }
}
