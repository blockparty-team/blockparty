import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterEventsStateService } from '@app/shared/components/filter-events/filter-events-state.service';

type TimeTableViewMode = 'gantt' | 'list'

@Component({
  selector: 'app-timetable',
  templateUrl: 'timetable.page.html',
  styleUrls: ['timetable.page.scss'],
  providers: [FilterEventsStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimetablePage {

  private _timetableViewMode$ = new BehaviorSubject<TimeTableViewMode>('gantt');
  timetableViewMode$: Observable<TimeTableViewMode> = this._timetableViewMode$.asObservable();
  
  onToggleTimetableView(): void {
    this._timetableViewMode$.value === 'gantt' ?
      this._timetableViewMode$.next('list') :
      this._timetableViewMode$.next('gantt');
  }
}
