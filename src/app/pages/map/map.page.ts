import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MapStateService } from '@app/pages/map/state/map-state.service';
import { ModalController } from '@ionic/angular';
import { from, Subject } from 'rxjs';
import { filter, map, switchMap, tap, withLatestFrom, delay, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LngLatBoundsLike } from 'maplibre-gl';
import { MapService } from '@app/services/map.service';
import { MapLayer } from '@app/interfaces/map-layer';
import { animations } from '@app/shared/animations';
import { FeatureInfoModalComponent } from './feature-info-modal/feature-info-modal.component';
import { TabsStateService } from '../tabs/state/tabs-state.service';
import { Tab } from '@app/interfaces/tab';
import { AnimationOptions } from 'ngx-lottie';
import { FilterEventsStateService } from '@app/shared/components/filter-events/filter-events-state.service';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  providers: [FilterEventsStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    ...animations.slideInOut,
    ...animations.fadeInOut
  ]
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {

  private mapService = inject(MapService);
  private mapStateService = inject(MapStateService);
  private filterEventsStateService = inject(FilterEventsStateService);
  private tabStateService = inject(TabsStateService);
  private modalCtrl = inject(ModalController);

  mapLoaded$ = this.mapStateService.mapLoaded$;
  mapIdle$ = this.mapStateService.mapIdle$;
  hideHeader$ = this.mapStateService.mapInteraction$.pipe(
    map(interaction => !interaction),
    delay(200)
  );

  private abandon$ = new Subject<void>();

  animationOptions: AnimationOptions = {
    path: '/assets/lottiefiles/map.json',
  };

  ngOnInit(): void {

    this.filterEventsStateService.selectedDayId$.pipe(
      withLatestFrom(
        this.mapStateService.dayMaskBounds$,
        this.filterEventsStateService.eventTypes$
      ),
      filter(([dayId, masks, eventTypes]) => !!dayId && !!masks && !!eventTypes),
      map(([dayId, masks, eventTypes]) => ({
        eventTypes,
        mask: masks.find(mask => mask.id === dayId)
      })),
      tap(({ eventTypes, mask }) => {
        this.mapService.fitBounds(mask.bounds as LngLatBoundsLike, 80, [0, 30]);
        this.mapService.removeFeatureHighlight(MapLayer.EventHighLight);
        this.mapService.highlightFeature(MapLayer.DayEventMask, mask.id);

        // Default select event type if only one
        eventTypes.length === 1
          ? this.filterEventsStateService.selectEventType(eventTypes[0].id)
          : this.filterEventsStateService.selectEventType('');
        this.filterEventsStateService.selectEvent('');
      }),
      takeUntil(this.abandon$)
    ).subscribe();

    this.filterEventsStateService.selectedEventTypeId$.pipe(
      withLatestFrom(
        this.filterEventsStateService.selectedDayId$,
        this.mapStateService.dayMaskBounds$,
        this.filterEventsStateService.events$
      ),
      filter(([eventTypeId, dayId, masks, events]) => !!eventTypeId && !!dayId && !!masks && !!events),
      map(([eventTypeId, dayId, masks, events]) => ({
        events,
        mask: masks
          .find(mask => mask.id === `${dayId}_${eventTypeId}`)
      })),
      tap(({ mask, events }) => {
        this.mapService.fitBounds(mask.bounds as LngLatBoundsLike, 80, [0, 30]);
        this.mapService.highlightFeature(MapLayer.EventHighLight, mask.id);

        // Select event if only one
        events.length === 0
          ? this.filterEventsStateService.selectEvent(events[0].id)
          : this.filterEventsStateService.selectEvent('');
      }),
      takeUntil(this.abandon$)
    ).subscribe();

    this.filterEventsStateService.selectedEvent$.pipe(
      filter(event => !!event),
      tap(event => {
        this.mapService.fitBounds(event.bounds as LngLatBoundsLike, 10, [0, 30]);
        this.mapService.highlightFeature(MapLayer.EventHighLight, event.id);
      }),
      takeUntil(this.abandon$)
    ).subscribe();

    // Open modal based on clicked map feature
    this.mapStateService.selectedMapFeature$.pipe(
      switchMap(feature => {
        if (feature.mapLayer === MapLayer.Stage) {
          return this.openFeatureInfoModal(0.5, [0, 0.5, 0.9])
        }

        if (feature.mapLayer === MapLayer.Asset || feature.mapLayer === MapLayer.AssetIcon) {
          return this.openFeatureInfoModal(0.3, [0, 0.3, 0.6])
        }
      }),
      takeUntil(this.abandon$)
    ).subscribe();

    // Resize map when navigating to map page, to prevent map not fitting container
    this.tabStateService.currentTab$.pipe(
      distinctUntilChanged(),
      filter(tab => tab === Tab.Map),
      withLatestFrom(this.mapStateService.mapLoaded$),
      filter(([, mapLoaded]) => mapLoaded),
      tap(() => this.mapService.resize()),
      takeUntil(this.abandon$)
    ).subscribe()
  }

  ngAfterViewInit(): void {
    // Prevent map partial div rendering on init
    setTimeout(() => {
      this.mapService.initMap();
    }, 50);
  }

  ngOnDestroy(): void {
    this.abandon$.next();
    this.abandon$.complete();
  }

  openFeatureInfoModal(
    initialBreakpoint: number = 0.4,
    breakpoints: number[] = [0.2, 0.4, 0.7, 1]
  ) {
    return from(
      this.modalCtrl.create({
        component: FeatureInfoModalComponent,
        initialBreakpoint,
        breakpoints
      })
    ).pipe(
      tap(modal => modal.present())
    );
  }
}
