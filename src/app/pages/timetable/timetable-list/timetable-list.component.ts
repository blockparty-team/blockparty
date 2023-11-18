import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { StageTimetable, TimetableWithStageName } from '@app/interfaces/day-event-stage-timetable';
import { TimetableStateService } from '../state/timetable-state.service';
import { filter, map } from 'rxjs/operators';
import { SegmentCustomEvent } from '@ionic/angular/standalone';
import { animations } from '@app/shared/animations';
import { FavoritesService } from '@app/services/favorites.service';
import { RouteName } from '@app/shared/models/routeName';
import { FilterEventsStateService } from '@app/shared/components/filter-events/filter-events-state.service';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { addIcons } from "ionicons";
import { sadOutline } from "ionicons/icons";
import { IonContent, IonList, IonItemGroup, IonItemDivider, IonLabel, IonItem, IonIcon, IonSegment, IonSegmentButton, IonText } from "@ionic/angular/standalone";

type ListViewMode = 'byTime' | 'byStage';

@Component({
  selector: 'app-timetable-list',
  templateUrl: './timetable-list.component.html',
  styleUrls: ['./timetable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: animations.slideLeft,
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, AsyncPipe, DatePipe, IonContent, IonList, IonItemGroup, IonItemDivider, IonLabel, IonItem, IonIcon, IonSegment, IonSegmentButton, IonText]
})
export class TimetableListComponent implements OnInit {

  private filterEventsStateService = inject(FilterEventsStateService);
  private timetableStateService = inject(TimetableStateService);
  private favoritesSerive = inject(FavoritesService);

  routeName = RouteName;

  timetableByStage$: Observable<StageTimetable[]>;
  timetableByTime$: Observable<TimetableWithStageName[]>

  private _listViewMode$ = new BehaviorSubject<ListViewMode>('byTime');
  listViewMode$: Observable<ListViewMode> = this._listViewMode$.asObservable();

  constructor() {
    addIcons({ sadOutline });
  }

  ngOnInit() {

    const event$ = combineLatest([
      this.timetableStateService.timetableWithFavorites$,
      this.filterEventsStateService.selectedDayId$,
      this.filterEventsStateService.selectedEventId$
    ]).pipe(
      filter(([timetableDays, selectedDayId, eventId]) => !!timetableDays && !!selectedDayId && !!eventId),
      map(([timetableDays, selectedDayId, eventId]) => timetableDays
        .find(day => day.id === selectedDayId)?.events
        .find(event => event.event_id === eventId)
      )
    );

    this.timetableByTime$ = event$.pipe(
      map(event => event?.stages
        .flatMap(stage => stage.timetable
          .flatMap(timetable => ({ stageName: stage.stage_name, ...timetable }))
        )
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        ?? null
      )
    )

    this.timetableByStage$ = event$.pipe(
      map(event => event?.stages ?? null)
    );
  }

  onChangeListViewMode(event: Event): void {
    const mode = (event as SegmentCustomEvent).detail.value as ListViewMode;
    this._listViewMode$.next(mode);
  }

  onToggleFavorite(id: string): void {
    this.favoritesSerive.toggleFavorite('artist', id);
  }

}
