import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapLayer } from '@app/interfaces/map-layer';
import { StageGeojsonProperties } from '@app/interfaces/stage-geojson-properties';
import { MapStateService } from '@app/pages/map/state/map-state.service';
import { MapService } from '@app/services/map.service';
import { RouteName } from '@app/shared/models/routeName';
import { Feature, Point } from 'geojson';

@Component({
  selector: 'app-stage-item',
  templateUrl: './stage-item.component.html',
  styleUrls: ['./stage-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StageItemComponent {
  @Input() stage: Feature<Point, StageGeojsonProperties>;

  constructor(
    private router: Router,
    private mapService: MapService,
    private mapStateService: MapStateService
  ) { }

  onShowOnMap() {
    this.router.navigate(['/tabs', RouteName.Map])
    this.mapService.flyTo(this.stage.geometry.coordinates as [number, number])

    const feature: MapClickedFeature<StageGeojsonProperties> = {
      id: this.stage.properties.id,
      mapLayer: MapLayer.Stage,
      properties: {
        ...this.stage.properties, 
        timetables: this.stage.properties.timetables,
        tickets: this.stage.properties.tickets
      },
      geometry: this.stage.geometry
    };

    this.mapStateService.selectMapFeatures([feature]);
  }

}
