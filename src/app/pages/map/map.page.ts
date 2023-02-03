import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MapStateService } from '@app/pages/map/state/map-state.service';
import { ModalController, SegmentCustomEvent } from '@ionic/angular';
import { from, Observable } from 'rxjs';
import { filter, map, switchMap, tap, withLatestFrom, delay, distinctUntilChanged } from 'rxjs/operators';
import { LngLatBoundsLike } from 'maplibre-gl';
import { MapService } from '@app/services/map.service';
import { DayEvent, PartialEvent } from '@app/interfaces/day-event';
import { MapLayer } from '@app/interfaces/map-layer';
import { animations } from '@app/shared/animations';
import { FeatureInfoModalComponent } from './feature-info-modal/feature-info-modal.component';
import { TabsStateService } from '../tabs/state/tabs-state.service';
import { Tab } from '@app/interfaces/tab';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    ...animations.slideInOut,
    ...animations.fadeInOut
  ]
})
export class MapPage implements OnInit, AfterViewInit {

  mapLoaded$: Observable<boolean>;
  mapIdle$: Observable<boolean>;
  days$: Observable<DayEvent[]>;
  events$: Observable<PartialEvent[]>;
  selectedDayId$: Observable<string>;
  selectedEventId$: Observable<string>;
  hideHeader$: Observable<boolean>;
  modalIsOpen$: Observable<boolean>;

  animationOptions: AnimationOptions = {
    path: '/assets/lottiefiles/map.json',
  };

  constructor(
    private mapService: MapService,
    private mapStateService: MapStateService,
    private tabStateService: TabsStateService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit(): void {

    this.mapLoaded$ = this.mapStateService.mapLoaded$;
    this.mapIdle$ = this.mapStateService.mapIdle$;
    this.days$ = this.mapStateService.days$;
    this.events$ = this.mapStateService.events$;

    this.selectedDayId$ = this.mapStateService.selectedDay$.pipe(
      tap((day) => {
        this.mapService.fitBounds(day.bounds as LngLatBoundsLike);
        this.mapService.highlightFeature(MapLayer.DayEventMask, day.id)
        this.mapService.removeFeatureHighlight(MapLayer.EventHighLight);
      }),
      map(day => day.id)
    );

    this.selectedEventId$ = this.mapStateService.selectedEvent$.pipe(
      tap((event) => {
        this.mapService.fitBounds(event.bounds as LngLatBoundsLike);
        this.mapService.highlightFeature(MapLayer.EventHighLight, event.id);
      }),
      map(event => event.id)
    );

    this.hideHeader$ = this.mapStateService.mapInteraction$.pipe(
      map(interaction => !interaction),
      delay(200)
    );

    // Open modal based on clicked map feature
    this.mapStateService.selectedMapFeatures$.pipe(
      filter(features => !!features),
      map(features => features[0]),
      switchMap(feature => {
        if (feature.mapLayer === MapLayer.Stage) {
          return this.openFeatureInfoModal(0.4, [0, 0.4, 1])
        }

        if (feature.mapLayer === MapLayer.Asset || feature.mapLayer === MapLayer.AssetIcon) {
          return this.openFeatureInfoModal(0.3, [0, 0.3, 0.6, 1])
        }
      })
    ).subscribe();

    // Resize map when navigating to map page, to prevent map not fitting container
    this.tabStateService.currentTab$.pipe(
      distinctUntilChanged(),
      filter(tab => tab === Tab.Map),
      withLatestFrom(this.mapStateService.mapLoaded$),
      filter(([, mapLoaded]) => mapLoaded),
      tap(() => this.mapService.resize())
    ).subscribe()
  }

  ngAfterViewInit(): void {
    this.mapService.initMap();
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

  onDayFilterSelect(id: string): void {
    this.mapStateService.selectDay(id);
  }

  onEventFilterSelect(id: string): void {
    this.mapStateService.selectEvent(id);
  }
}
