import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { GeojsonProperties, MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapLayer } from '@app/interfaces/map-layer';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MapStateService } from '../state/map-state.service';
import { MapService } from '@app/services/map.service';
import { AssetComponent } from './asset/asset.component';
import { StageTimetableComponent } from './stage-timetable/stage-timetable.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-feature-info-modal',
  templateUrl: './feature-info-modal.component.html',
  styleUrls: ['./feature-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, StageTimetableComponent, AssetComponent, AsyncPipe, IonContent]
})
export class FeatureInfoModalComponent implements OnInit {

  private mapStateService = inject(MapStateService);
  private mapService = inject(MapService);

  selectedFeature$: Observable<MapClickedFeature<GeojsonProperties>>;
  mapLayer = MapLayer;

  ngOnInit() {
    this.selectedFeature$ = this.mapStateService.selectedMapFeature$.pipe(
      tap(feature => this.mapService.flyTo(
        feature.geometry.coordinates as [number, number],
        [0, -60]
      ))
    );
  }

}
