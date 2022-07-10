import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '@app/services/supabase.service';
import { MapStateService } from '@app/pages/tab-map/state/map-state.service';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { filter, switchMap, map, tap, first } from 'rxjs/operators';
import { Geometry, Point } from 'geojson';

@Component({
  selector: 'app-stage-timetable-modal',
  templateUrl: './stage-timetable-modal.component.html',
  styleUrls: ['./stage-timetable-modal.component.scss'],
})
export class StageTimetableModalComponent implements OnInit {

  timetable$: Observable<any>;
  location$: Observable<[number, number]>;

  constructor(
    private mapStateService: MapStateService,
    private supabaseService: SupabaseService,
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.timetable$ = this.mapStateService.selectedMapFeatures$.pipe(
      filter(features => !!features && features[0].layerName === 'stage'),
      switchMap(stage => this.supabaseService.stageTimeTable(stage[0].id))
    );

    this.location$ = this.mapStateService.selectedMapFeatures$.pipe(
      filter(features => !!features && features[0].layerName === 'stage'),
      map(features => [
        features[0].geometry.coordinates[1],
        features[0].geometry.coordinates[0]
      ] as [number, number])
    );
  }

  onDismissModal() {
    this.modalCtrl.dismiss();
  }

  onGoToArtist(artistId: string): void {
    this.modalCtrl.dismiss();
    this.router.navigate(['/tabs/', 'artist', artistId]);
  }

  onDirectionsTo(coords: [number, number]): void {

    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;

    window.open(url, '_blank');
  }

}
