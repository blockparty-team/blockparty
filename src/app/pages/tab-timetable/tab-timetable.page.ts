import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DayWithRelations } from '@app/interfaces/entities-with-releation';
import { StoreService } from '@app/store/store.service';
import { SegmentCustomEvent } from '@ionic/angular';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, pluck, tap } from 'rxjs/operators';
import { TimetableStateService } from './state/timetable-state.service';

interface StageTimetables {
  stage: string;
  timetables: {
    name: string;
    start_time: string;
    end_time: string;
  }[];
}

interface TimeSpan {
  minStartTime: number;
  maxEndTime: number;
  intervalInHours: number;
}


@Component({
  selector: 'app-tab-timetable',
  templateUrl: 'tab-timetable.page.html',
  styleUrls: ['tab-timetable.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabTimetablePage implements OnInit {

  // https://www.bennadel.com/blog/3961-having-fun-with-the-horizontal-usage-of-position-sticky-in-angular-11-0-5.htm

  days$: Observable<DayWithRelations[]>;
  events$: Observable<DayWithRelations['event']>;
  selectedDayId$: Observable<string>;
  selectedEventId$: Observable<string>;

  timeLabels: { time: string, min: number }[] = [...Array(24).keys()].map(x => ({ time: `${x}:00`, min: x * 60 }));



  stageTimetables: StageTimetables[] = [
    {
      stage: 'Main',
      timetables: [
        { name: 'DJ Aligator', start_time: '2023-06-02 21:00', end_time: '2023-06-02 23:00' },
        { name: 'The Whitest Boy Alive', start_time: '2023-06-02 23:00', end_time: '2023-06-03 01:00' },
        { name: 'Jeff Mills', start_time: '2023-06-03 01:00', end_time: '2023-06-03 04:00' },
      ]
    },
    {
      stage: 'Woods',
      timetables: [
        { name: 'Snoop Dog', start_time: '2023-06-02 20:30', end_time: '2023-06-02 21:30' },
        { name: 'Cran Berries', start_time: '2023-06-02 22:00', end_time: '2023-06-02 23:30' },
        { name: 'Kelly Family', start_time: '2023-06-03 0:00', end_time: '2023-06-03 05:35' },
      ]
    },
  ]

  constructor(
    private store: StoreService,
    private timetableStateService: TimetableStateService
  ) { }

  ngOnInit(): void {

    console.log(this.normalize(this.stageTimetables))


    this.days$ = this.store.days$.pipe(
      tap(console.log)
    );

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


  normalize(stageTimetables: StageTimetables[]): TimeSpan {
    const minStartTime = stageTimetables
      .flatMap(x => x.timetables.map(x => new Date(x.start_time).getTime()))
      .sort()[0];

    const maxEndTime = stageTimetables
      .flatMap(x => x.timetables.map(x => new Date(x.end_time).getTime()))
      .sort((a, b) => b - a)[0];

    const intervalInHours = Math.ceil((maxEndTime - minStartTime) / (1000 * 60 * 60))

    

    return {
      minStartTime,
      maxEndTime,
      intervalInHours
    }

  }

  onDayFilterChange(event: Event): void {
    this.timetableStateService.selectDay((event as SegmentCustomEvent).detail.value);
  }

  onEventFilterChange(event: Event): void {
    this.timetableStateService.selectEvent((event as SegmentCustomEvent).detail.value);
  }


}
