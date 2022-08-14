import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StageTimetable } from '@app/interfaces/day-event-stage-timetable';
import { TimetableStateService } from '../state/timetable-state.service';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-timetable-list',
  templateUrl: './timetable-list.component.html',
  styleUrls: ['./timetable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimetableListComponent implements OnInit {

  stages$: Observable<StageTimetable[]>;
  
  constructor(
    private timetableStateService: TimetableStateService
  ) { }

  ngOnInit() {
    this.stages$ = this.timetableStateService.selectedEvent$.pipe(
      pluck('stages')
    );
  }

}
