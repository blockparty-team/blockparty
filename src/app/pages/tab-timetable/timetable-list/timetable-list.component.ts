import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StageTimetable, TimetableWithStageName } from '@app/interfaces/day-event-stage-timetable';
import { TimetableStateService } from '../state/timetable-state.service';
import { pluck } from 'rxjs/operators';
import { SegmentCustomEvent } from '@ionic/angular';
import { animations } from '@app/shared/animations';
import { FavoritesService } from '@app/services/favorites.service';

type ListViewMode = 'byTime' | 'byStage';

@Component({
  selector: 'app-timetable-list',
  templateUrl: './timetable-list.component.html',
  styleUrls: ['./timetable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: animations.slideLeft
})
export class TimetableListComponent implements OnInit {

  timetableByStage$: Observable<StageTimetable[]>;
  timetableByTime$: Observable<TimetableWithStageName[]>

  private _listViewMode$ = new BehaviorSubject<ListViewMode>('byTime');
  listViewMode$: Observable<ListViewMode> = this._listViewMode$.asObservable();

  constructor(
    private timetableStateService: TimetableStateService,
    private favoritesSerive: FavoritesService
  ) { }

  ngOnInit() {
    this.timetableByStage$ = this.timetableStateService.selectedEvent$.pipe(
      pluck('stages')
    );

    this.timetableByTime$ = this.timetableStateService.eventTimetableByTime$
  }

  onChangeListViewMode(event: Event): void {
    const mode = (event as SegmentCustomEvent).detail.value as ListViewMode;
      this._listViewMode$.next(mode);
  }

  onToggleFavorite(id: string): void {
    this.favoritesSerive.toggleFavorite('artists', id);
  }

}
