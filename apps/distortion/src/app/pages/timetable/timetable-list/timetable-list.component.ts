import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import {
  StageTimetable,
  TimetableWithStageName,
  RouteName,
} from '@blockparty/festival/types';
import { TimetableStateService } from '@blockparty/festival/data-access/state/timetable';
import { filter, map } from 'rxjs/operators';
import { SegmentCustomEvent } from '@ionic/angular/standalone';
import { animations } from '@distortion/app/shared/animations';
import { FilterEventsStateService } from '@blockparty/festival/data-access/state/filter-events';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import {
  IonFooter,
  IonContent,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonItem,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { FavoriteStateService } from '@blockparty/festival/data-access/state/favorite';

enum ListViewMode {
  ByTime = 'byTime',
  ByStage = 'byStage',
}
@Component({
  selector: 'app-timetable-list',
  templateUrl: './timetable-list.component.html',
  styleUrls: ['./timetable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: animations.slideLeft,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    AsyncPipe,
    DatePipe,
    IonFooter,
    IonContent,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonItem,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonText,
    IonRouterLink,
  ],
})
export class TimetableListComponent {
  private filterEventsStateService = inject(FilterEventsStateService);
  private timetableStateService = inject(TimetableStateService);
  private favoriteStateService = inject(FavoriteStateService);

  private event$ = combineLatest([
    this.timetableStateService.timetableWithFavorites$,
    this.filterEventsStateService.selectedDayId$,
    this.filterEventsStateService.selectedEventId$,
  ]).pipe(
    filter(
      ([timetableDays, selectedDayId, eventId]) =>
        !!timetableDays && !!selectedDayId && !!eventId,
    ),
    map(([timetableDays, selectedDayId, eventId]) =>
      timetableDays
        .find((day) => day.id === selectedDayId)
        ?.events.find((event) => event.event_id === eventId),
    ),
  );

  public timetableByTime$: Observable<TimetableWithStageName[]> =
    this.event$.pipe(
      map(
        (event) =>
          event?.stages
            .flatMap((stage) =>
              stage.timetable.flatMap((timetable) => ({
                stageName: stage.stage_name,
                ...timetable,
              })),
            )
            .sort(
              (a, b) =>
                new Date(a.start_time).getTime() -
                new Date(b.start_time).getTime(),
            ) ?? null,
      ),
    );

  public timetableByStage$: Observable<StageTimetable[]> = this.event$.pipe(
    map((event) => event?.stages ?? null),
  );

  public routeName = RouteName;
  public viewMode = ListViewMode;

  public selectedListViewMode = signal<ListViewMode>(ListViewMode.ByStage);

  onChangeListViewMode(event: SegmentCustomEvent): void {
    const mode = event.detail.value as ListViewMode;
    this.selectedListViewMode.set(mode);
  }

  onToggleFavorite(id: string): void {
    this.favoriteStateService.toggleFavorite('artist', id);
  }
}
