import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StageTimetableModalComponent } from '@app/components/stage-timetable-modal/stage-timetable-modal.component';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapStateService } from '@app/pages/tab-map/state/map-state.service';
import { ModalController } from '@ionic/angular';
import { combineLatest, from, Observable, of } from 'rxjs';
import { filter, map, switchMap, tap, withLatestFrom, pluck } from 'rxjs/operators';
import { StoreService } from '@app/store/store.service';
import { MapService } from '@app/services/map.service';
import { LngLatBoundsLike } from 'maplibre-gl';
import { DayWithRelations } from '@app/interfaces/entities-with-releation';
import { MapLayer } from '@app/interfaces/map-layer';

@Component({
  selector: 'app-tab-map',
  templateUrl: 'tab-map.page.html',
  styleUrls: ['tab-map.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabMapPage implements OnInit {

  days$: Observable<DayWithRelations[]>;
  events$: Observable<DayWithRelations['event']>;


  constructor(
    private store: StoreService,
    private mapService: MapService,
    private mapStateService: MapStateService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit(): void {
    this.days$ = this.store.days$;

    this.events$ = combineLatest([
      this.days$,
      this.mapStateService.selectedDay$
    ]).pipe(
      filter(([days, selectedDay]) => !!days && !!selectedDay),
      map(([days, selectedDay]) => days.find(day => day.id === selectedDay)),
      pluck('event')
    )

    this.mapStateService.selectedMapFeatures$.pipe(
      filter(features => !!features),
      switchMap(features => this.openFeatureInfoModal(features[0]))
    ).subscribe();

    this.mapStateService.selectedDay$.pipe(
      withLatestFrom(this.store.dayMaskBounds$),
      map(([dayId, dayMasks]) => dayMasks.find(day => day.id === dayId)),
      filter(dayMask => !!dayMask),
      tap((day) => {
          this.mapService.fitBounds(day.bounds as LngLatBoundsLike);
          this.mapService.filterDayMask(day.id)
      })
    ).subscribe()

    this.mapStateService.selectedEvent$.pipe(
      withLatestFrom(this.events$),
      map(([eventId, events]) => events.find(event => event.id === eventId)),
      filter(event => !!event),
      tap((event) => {
          this.mapService.fitBounds(event.bounds as LngLatBoundsLike);
          this.mapService.highlightFeature(MapLayer.Event, event.id);
      })
    ).subscribe()
  }

  openFeatureInfoModal(mapFeature: MapClickedFeature) {
    return from(
      this.modalCtrl.create({
        component: StageTimetableModalComponent,
        initialBreakpoint: 0.4,
        breakpoints: [0.2, 0.4, 0.7, 1]
      })
    ).pipe(
      tap(modal => modal.present())
    );
  }

  onDayFilterChange(event: any): void {
    this.mapStateService.selectDay(event.detail.value);
  }

  onEventFilterChange(event: any): void {
    this.mapStateService.selectEvent(event.detail.value);
  }

}
