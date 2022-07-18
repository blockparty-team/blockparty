import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '@app/services/supabase.service';
import { MapStateService } from '@app/pages/tab-map/state/map-state.service';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { filter, switchMap, map } from 'rxjs/operators';
import { MapLayer } from '@app/interfaces/map-layer';

@Component({
  selector: 'app-stage-timetable',
  templateUrl: './stage-timetable.component.html',
  styleUrls: ['./stage-timetable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StageTimetableComponent implements OnInit {

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
      filter(features => !!features && features[0].mapLayer === MapLayer.Stage),
      switchMap(stage => this.supabaseService.stageTimeTable(stage[0].id))
    );

    this.location$ = this.mapStateService.selectedMapFeatures$.pipe(
      filter(features => !!features && features[0].mapLayer === MapLayer.Stage),
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

  onOpenGoogleMapseDirections(coords: [number, number]): void {

    const url = `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${coords[0]},${coords[1]}`;

    window.open(url, '_blank');
  }

}
