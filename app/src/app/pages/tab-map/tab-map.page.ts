import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StageTimetableModalComponent } from '@app/components/stage-timetable-modal/stage-timetable-modal.component';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { SupabaseService } from '@app/services/supabase.service';
import { UiStateService } from '@app/services/ui-state.service';
import { ModalController } from '@ionic/angular';
import { empty, from, Observable } from 'rxjs';
import { catchError, filter, finalize, map, mapTo, pluck, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tab-map',
  templateUrl: 'tab-map.page.html',
  styleUrls: ['tab-map.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabMapPage implements OnInit {

  // timetable$: Observable<any>;
  // showTimetableModal = false;
  showTimetableModal$: Observable<boolean>;

  constructor(
    private uiStateService: UiStateService,
    private supabaseService: SupabaseService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit(): void {
    this.uiStateService.selectedMapFeatures$.pipe(
      filter(features => !!features),
      switchMap(features => this.openFeatureInfoModal(features[0])),
      // switchMap(stage => this.supabaseService.stageTimeTable(stage[0].id)),
      pluck('data'),
      finalize(() => console.log('asdf'))
    ).subscribe();

    // this.showTimetableModal$ = this.timetable$.pipe(
    //   startWith(false),
    //   tap(console.log),
    //   filter(timetable => !!timetable),
    //   mapTo(true),
    //   tap(console.log),
    //   catchError(err => {
    //     console.log(err);
    //     return empty();
    //   })
    // );
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
