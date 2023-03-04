import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapLayer } from '@app/interfaces/map-layer';
import { StageGeojsonProperties } from '@app/interfaces/stage-geojson-properties';
import { MapStateService } from '@app/pages/map/state/map-state.service';
import { MapService } from '@app/services/map.service';
import { RouteName } from '@app/shared/models/routeName';
import { Feature, Point } from 'geojson';

interface StageProperties extends Omit<StageGeojsonProperties, 'timetables'> {
  imgUrl?: string;
  timetables: any;
}

@Component({
  selector: 'app-stage-item',
  templateUrl: './stage-item.component.html',
  styleUrls: ['./stage-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StageItemComponent {
  @Input() stage: Feature<Point, StageProperties>;

  constructor(
    private router: Router,
    private mapService: MapService,
    private mapStateService: MapStateService
  ) { }

  onShowOnMap() {
    this.router.navigate(['/tabs', RouteName.Map])
    this.mapService.flyTo(this.stage.geometry.coordinates as [number, number])

    const feature: MapClickedFeature<StageProperties> = {
      id: this.stage.properties.id,
      mapLayer: MapLayer.Stage,
      properties: {
        ...this.stage.properties, 
        // TODO(barfod): this object is stringified because of mapblibre 
        // features not supporting nested properties. No need to enforce this
        // in MapClickedFeature.
        timetables: JSON.stringify(this.stage.properties.timetables)
      },
      geometry: this.stage.geometry
    };

    this.mapStateService.selectMapFeatures([feature]);
  }

}
