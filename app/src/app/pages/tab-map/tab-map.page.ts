import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StageTimetableModalComponent } from '@app/components/stage-timetable-modal/stage-timetable-modal.component';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapStateService } from '@app/pages/tab-map/state/map-state.service';
import { ModalController } from '@ionic/angular';
import { from, Observable, of } from 'rxjs';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { StoreService } from '@app/store/store.service';
import { MapService } from '@app/services/map.service';
import { LngLatBoundsLike } from 'maplibre-gl';

@Component({
  selector: 'app-tab-map',
  templateUrl: 'tab-map.page.html',
  styleUrls: ['tab-map.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabMapPage implements OnInit {

  days$: Observable<any>;

  constructor(
    private store: StoreService,
    private mapService: MapService,
    private mapStateService: MapStateService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit(): void {
    this.days$ = this.store.daysWithRelations$;

    this.mapStateService.selectedMapFeatures$.pipe(
      filter(features => !!features),
      switchMap(features => this.openFeatureInfoModal(features[0]))
    ).subscribe();

    this.mapStateService.selectedDay$.pipe(
      withLatestFrom(this.store.dayMaskBounds$),
      map(([dayId, dayMasks]) => dayMasks.find(day => day.day_id === dayId)),
      filter(dayMask => !!dayMask),
      tap((day) => {
          this.mapService.fitBounds(day.bounds as LngLatBoundsLike);
          this.mapService.filterDayMask(day.day_id)
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
    this.mapStateService.selectedDay(event.detail.value);
  }

}
