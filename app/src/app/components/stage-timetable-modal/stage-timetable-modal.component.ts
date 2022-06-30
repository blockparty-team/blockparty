import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '@app/services/supabase.service';
import { UiStateService } from '@app/services/ui-state.service';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { filter, switchMap, pluck, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-stage-timetable-modal',
  templateUrl: './stage-timetable-modal.component.html',
  styleUrls: ['./stage-timetable-modal.component.scss'],
})
export class StageTimetableModalComponent implements OnInit {

  timetable$: Observable<any>;

  constructor(
    private uiStateService: UiStateService,
    private supabaseService: SupabaseService,
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.timetable$ = this.uiStateService.selectedMapFeatures$.pipe(
      filter(features => !!features),
      switchMap(stage => this.supabaseService.stageTimeTable(stage[0].id)),
      pluck('data'),
      finalize(() => console.log('asdf'))
    );
  }

  onDismissModal() {
    this.modalCtrl.dismiss();
  }

  onGoToArtist(artistId: string): void {
    this.modalCtrl.dismiss();
    this.router.navigate(['/tabs/', 'artist', artistId]);
  }

}
