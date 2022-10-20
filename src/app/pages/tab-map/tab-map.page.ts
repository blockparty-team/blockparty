import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MapStateService } from '@app/pages/tab-map/state/map-state.service';
import { ModalController, SegmentCustomEvent } from '@ionic/angular';
import { combineLatest, from, Observable } from 'rxjs';
import { filter, map, switchMap, tap, withLatestFrom, pluck, delay, distinctUntilChanged } from 'rxjs/operators';
import { LngLatBoundsLike } from 'maplibre-gl';
import { StoreService } from '@app/store/store.service';
import { MapService } from '@app/services/map.service';
import { DayWithRelations } from '@app/interfaces/entities-with-releation';
import { MapLayer } from '@app/interfaces/map-layer';
import { animations } from '@app/shared/animations';
import { FeatureInfoModalComponent } from './feature-info-modal/feature-info-modal.component';
import { TabsStateService } from '../tabs/state/tabs-state.service';
import { Tab } from '@app/interfaces/tab';

@Component({
  selector: 'app-tab-map',
  templateUrl: 'tab-map.page.html',
  styleUrls: ['tab-map.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: animations.slideInOut
})
export class TabMapPage implements OnInit {

  days$: Observable<DayWithRelations[]>;
  events$: Observable<DayWithRelations['event']>;
  selectedDayId$: Observable<string>;
  selectedEventId$: Observable<string>;
  hideHeader$: Observable<boolean>;
  modalIsOpen$: Observable<boolean>;

  constructor(
    private mapService: MapService,
    private mapStateService: MapStateService,
    private tabStateService: TabsStateService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit(): void {

    this.days$ = this.mapStateService.days$;
    this.events$ = this.mapStateService.events$;

    this.selectedDayId$ = this.mapStateService.selectedDay$.pipe(
      tap((day) => {
        this.mapService.fitBounds(day.bounds as LngLatBoundsLike);
        this.mapService.highlightFeature(MapLayer.DayEventMask, day.id)
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
          return this.openFeatureInfoModal(0.1, [0, 0.1, 0.5, 1])
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

  onDayFilterChange(event: Event): void {
    this.mapStateService.selectDay((event as SegmentCustomEvent).detail.value);
  }

  onEventFilterChange(event: Event): void {
    this.mapStateService.selectEvent((event as SegmentCustomEvent).detail.value);
  }

}
