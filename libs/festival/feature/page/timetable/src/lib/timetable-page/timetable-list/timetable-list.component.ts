import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { RouteName } from '@blockparty/festival/shared/types';
import {
  StageTimetable,
  TimetableWithStageName,
} from '@blockparty/festival/data-access/supabase';
import { TimetableStateService } from '@blockparty/festival/data-access/state/timetable';
import { filter, map } from 'rxjs/operators';
import { SegmentCustomEvent } from '@ionic/angular/standalone';
import { animations } from '@blockparty/util/animation';
import { EventFilterStateService } from '@blockparty/festival/data-access/state/event-filter';
import { RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  IonFooter,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonItem,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { FavoriteStateService } from '@blockparty/festival/data-access/state/favorite';
import { AppConfigService } from '@blockparty/festival/data-access/state/app-config';

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
  imports: [
    RouterLink,
    AsyncPipe,
    DatePipe,
    IonFooter,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonItem,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonRouterLink,
  ],
})
export class TimetableListComponent {
  private eventFilterStateService = inject(EventFilterStateService);
  private timetableStateService = inject(TimetableStateService);
  private favoriteStateService = inject(FavoriteStateService);
  private timetableConfig = inject(AppConfigService).appConfig.timetable;

  private event$ = combineLatest([
    this.timetableStateService.timetableWithFavorites$,
    this.eventFilterStateService.selectedDayId$,
    this.eventFilterStateService.selectedEventId$,
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

  public timetableByTime$: Observable<TimetableWithStageName[] | null> =
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

  public timetableByStage$: Observable<StageTimetable[] | null> =
    this.event$.pipe(map((event) => event?.stages ?? null));

  public routeName = RouteName;

  public selectedListViewMode = signal(this.timetableConfig.listMode());

  onChangeListViewMode(event: SegmentCustomEvent): void {
    const mode = event.detail.value as ListViewMode;
    this.selectedListViewMode.set(mode);
  }

  onToggleFavorite(id: string): void {
    this.favoriteStateService.toggleFavorite('artist', id);
  }
}
