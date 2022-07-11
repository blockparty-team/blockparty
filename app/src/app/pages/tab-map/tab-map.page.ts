import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StageTimetableModalComponent } from '@app/components/stage-timetable-modal/stage-timetable-modal.component';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { SupabaseService } from '@app/services/supabase.service';
import { MapStateService } from '@app/pages/tab-map/state/map-state.service';
import { ModalController } from '@ionic/angular';
import { from, Observable } from 'rxjs';
import { filter, switchMap, tap, pluck } from 'rxjs/operators';
import { StoreService } from '@app/store/store.service';

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
    private mapStateService: MapStateService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit(): void {
    this.days$ = this.store.daysWithRelations$;

    this.mapStateService.selectedMapFeatures$.pipe(
      filter(features => !!features),
      switchMap(features => this.openFeatureInfoModal(features[0]))
    ).subscribe();
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

}
