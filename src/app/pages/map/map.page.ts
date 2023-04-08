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
      filter(dayId => !!dayId),
      withLatestFrom(this.mapStateService.dayMaskBounds$),
      map(([dayId, dayMasks]) => dayMasks.find(day => day.id === dayId)),
      filter(dayMask => !!dayMask),
      tap((dayMask) => {
        this.filterEventsStateService.selectEventType(null);
        this.filterEventsStateService.selectEvent(null);
        this.mapService.fitBounds(dayMask.bounds as LngLatBoundsLike,  80, [0, 30]);
        this.mapService.removeFeatureHighlight(MapLayer.EventHighLight);
        this.mapService.highlightFeature(MapLayer.DayEventMask, dayMask.id);
      }),
      takeUntil(this.abandon$)
    ).subscribe();

    this.filterEventsStateService.selectedEventType$.pipe(
      withLatestFrom(
        this.filterEventsStateService.selectedDayId$,
        this.mapStateService.dayMaskBounds$
      ),
      map(([selectedEventType, selectDayId, dayMasks]) => dayMasks.find(mask => mask.id === `${selectDayId}_${selectedEventType.id}`)),
      tap(mask => {
        this.mapService.fitBounds(mask.bounds as LngLatBoundsLike, 80, [0, 30]);
        this.mapService.highlightFeature(MapLayer.EventHighLight, mask.id);
      }),
      takeUntil(this.abandon$)
    ).subscribe();

    this.filterEventsStateService.selectedEvent$.pipe(
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
          return this.openFeatureInfoModal(0.4, [0, 0.4, 0.9])
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
    this.mapService.initMap();
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
