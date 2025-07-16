import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { MapStateService } from '@blockparty/festival/data-access/state/map';
import { ModalController } from '@ionic/angular/standalone';
import { merge, from, Subject, EMPTY, combineLatest } from 'rxjs';
import {
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
  distinctUntilChanged,
  takeUntil,
  catchError,
  debounceTime,
} from 'rxjs/operators';
import { LngLatBoundsLike } from 'maplibre-gl';
import { MapService } from '@blockparty/festival/shared/service/map';
import { MapLayer, Tab, RouteName } from '@blockparty/festival/shared/types';
import { animations } from '@blockparty/util/animation';
import { FeatureInfoModalComponent } from './feature-info-modal/feature-info-modal.component';
import { TabsStateService } from '@blockparty/festival/data-access/state/tabs';
import { EventFilterStateService } from '@blockparty/festival/data-access/state/event-filter';
import { RouteHistoryService } from '@blockparty/festival/shared/service/route-history';
import { AsyncPipe } from '@angular/common';
import { EventFilterComponent } from '@blockparty/festival/featurecomponent/event-filter';
import { IonHeader, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  providers: [EventFilterStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    ...animations.slideInOut,
    ...animations.fadeInOut,
    ...animations.slideUpDown,
  ],
  standalone: true,
  imports: [EventFilterComponent, AsyncPipe, IonHeader, IonContent],
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  private mapService = inject(MapService);
  private mapStateService = inject(MapStateService);
  private eventFilterStateService = inject(EventFilterStateService);
  private tabStateService = inject(TabsStateService);
  private modalCtrl = inject(ModalController);
  private routeHistoryService = inject(RouteHistoryService);

  private modal!: HTMLIonModalElement;
  mapLoaded$ = this.mapStateService.mapLoaded$;
  mapIdle$ = this.mapStateService.mapIdle$;
  hideHeader$ = this.mapStateService.mapInteraction$.pipe(
    map((interaction) => !interaction),
  );

  private abandon$ = new Subject<void>();

  ngOnInit(): void {
    this.eventFilterStateService.selectedDayId$
      .pipe(
        withLatestFrom(
          this.mapStateService.dayMaskBounds$,
          this.eventFilterStateService.eventTypes$,
        ),
        filter(
          ([dayId, masks, eventTypes]) => !!dayId && !!masks && !!eventTypes,
        ),
        map(([dayId, masks, eventTypes]) => ({
          eventTypes,
          mask: masks.find((mask) => mask.id === dayId),
        })),
        tap(({ eventTypes, mask }) => {
          this.mapService.fitBounds(
            mask!.bounds as LngLatBoundsLike,
            80,
            [0, 30],
          );
          this.mapService.removeFeatureHighlight(MapLayer.StageHighlight);
          this.mapService.removeFeatureHighlight(MapLayer.AssetHighlight);
          this.mapService.removeFeatureHighlight(MapLayer.EventHighLight);
          this.mapService.highlightFeature(MapLayer.DayEventMask, mask!.id!);
          this.mapStateService.updateMapInteraction(true);

          // Default select event type if only one
          eventTypes.length === 1
            ? this.eventFilterStateService.selectEventType(eventTypes[0].id)
            : this.eventFilterStateService.selectEventType('');
          this.eventFilterStateService.selectEvent('');
        }),
        takeUntil(this.abandon$),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
      )
      .subscribe();

    combineLatest([
      this.eventFilterStateService.selectedEventTypeId$,
      this.eventFilterStateService.selectedDayId$,
      this.mapStateService.dayMaskBounds$,
      this.eventFilterStateService.events$,
    ])
      .pipe(
        filter(
          ([eventTypeId, dayId, masks, events]) =>
            !!eventTypeId && !!dayId && !!masks && !!events,
        ),
        debounceTime(50),
        map(([eventTypeId, dayId, masks, events]) => ({
          events,
          mask: masks.find((mask) => mask.id === `${dayId}_${eventTypeId}`),
        })),
        tap(({ mask, events }) => {
          this.mapService.fitBounds(
            mask!.bounds as LngLatBoundsLike,
            80,
            [0, 30],
          );
          this.mapService.removeFeatureHighlight(MapLayer.StageHighlight);
          this.mapService.removeFeatureHighlight(MapLayer.AssetHighlight);
          this.mapService.highlightFeature(MapLayer.EventHighLight, mask!.id!);
          this.mapStateService.updateMapInteraction(true);

          // Select event if only one
          events.length === 0
            ? this.eventFilterStateService.selectEvent(events[0].id)
            : this.eventFilterStateService.selectEvent('');
        }),
        takeUntil(this.abandon$),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
      )
      .subscribe();

    this.eventFilterStateService.selectedEvent$
      .pipe(
        filter((event) => !!event),
        tap((event) => {
          this.mapService.fitBounds(
            event.bounds as LngLatBoundsLike,
            10,
            [0, 30],
          );
          this.mapService.removeFeatureHighlight(MapLayer.AssetHighlight);
          this.mapService.removeFeatureHighlight(MapLayer.StageHighlight);
          this.mapService.highlightFeature(MapLayer.EventHighLight, event.id);
          this.mapStateService.updateMapInteraction(true);
        }),
        takeUntil(this.abandon$),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
      )
      .subscribe();

    this.mapStateService.selectedMapFeature$
      .pipe(
        switchMap((feature) => {
          if (feature.mapLayer === MapLayer.Stage) {
            return this.openFeatureInfoModal(1, [0, 1]);
          }

          if (
            feature.mapLayer === MapLayer.Asset ||
            feature.mapLayer === MapLayer.AssetIcon
          ) {
            return this.openFeatureInfoModal(0.3, [0, 0.3, 1]);
          }

          return EMPTY;
        }),
        takeUntil(this.abandon$),
        catchError((err) => {
          console.log(err);
          return EMPTY;
        }),
      )
      .subscribe();

    // Remove modal on map interaction
    this.mapStateService.mapInteraction$
      .pipe(
        filter((mapInteraction) => mapInteraction && !!this.modal),
        tap(() => this.modal.dismiss()),
        takeUntil(this.abandon$),
      )
      .subscribe();

    // Resize map when navigating to map page, to prevent map not fitting container
    merge(
      this.tabStateService.currentTab$.pipe(
        distinctUntilChanged(),
        filter((tab) => tab === Tab.Map),
      ),
      this.routeHistoryService.history$.pipe(
        map(
          (history) =>
            history.current === `/${RouteName.Tabs}/${RouteName.Map}`,
        ),
        filter((isMapRoute) => isMapRoute),
      ),
    )
      .pipe(
        withLatestFrom(this.mapStateService.mapLoaded$),
        filter(([, mapLoaded]) => mapLoaded),
        tap(() => {
          // Using timeout because of animation
          setTimeout(() => {
            this.mapService.resize();
          }, 200);
        }),
        takeUntil(this.abandon$),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    // Prevent map partial div rendering on init
    setTimeout(() => {
      this.mapService.initMap();
    }, 200);
  }

  ngOnDestroy(): void {
    this.abandon$.next();
    this.abandon$.complete();
  }

  openFeatureInfoModal(initialBreakpoint: number, breakpoints: number[]) {
    return from(
      this.modalCtrl.create({
        component: FeatureInfoModalComponent,
        initialBreakpoint,
        breakpoints,
        backdropDismiss: false,
        showBackdrop: false,
        backdropBreakpoint: initialBreakpoint,
        cssClass: 'feature-info-modal',
      }),
    ).pipe(
      tap((modal) => {
        this.modal = modal;
        modal.present();
      }),
    );
  }
}
