import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AssetGeojson } from '@app/interfaces/database-entities';
import { GeojsonProperties, MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapLayer } from '@app/interfaces/map-layer';
import { StageGeojsonProperties } from '@app/interfaces/stage-geojson-properties';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MapStateService } from '../state/map-state.service';
import { MapService } from '@app/services/map.service';

@Component({
  selector: 'app-feature-info-modal',
  templateUrl: './feature-info-modal.component.html',
  styleUrls: ['./feature-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureInfoModalComponent implements OnInit {
  selectedFeature$: Observable<MapClickedFeature<GeojsonProperties>>;
  mapLayer = MapLayer

  constructor(
    private mapStateService: MapStateService,
    private mapService: MapService
  ) { }

  ngOnInit(
  ) {
    this.selectedFeature$ = this.mapStateService.selectedMapFeature$.pipe(
      tap(feature => this.mapService.flyTo(
        feature.geometry.coordinates as [number, number],
        [0, -60]
      ))
    );
  }

}
