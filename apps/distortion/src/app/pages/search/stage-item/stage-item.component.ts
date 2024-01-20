import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { MapClickedFeature } from '@distortion/app/interfaces/map-clicked-feature';
import { MapLayer } from '@distortion/app/interfaces/map-layer';
import { StageGeojsonProperties } from '@distortion/app/interfaces/stage-geojson-properties';
import { MapStateService } from '@distortion/app/pages/map/state/map-state.service';
import { MapService } from '@distortion/app/services/map.service';
import { RouteName } from '@distortion/app/shared/models/routeName';
import { Feature, Point } from 'geojson';
import {
  IonItem,
  IonThumbnail,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-stage-item',
  templateUrl: './stage-item.component.html',
  styleUrls: ['./stage-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonItem, IonThumbnail, IonLabel, IonIcon],
})
export class StageItemComponent {
  private router = inject(Router);
  private mapService = inject(MapService);
  private mapStateService = inject(MapStateService);

  @Input() stage: Feature<Point, StageGeojsonProperties>;

  onShowOnMap() {
    this.router.navigate(['/tabs', RouteName.Map]);
    this.mapService.flyTo(this.stage.geometry.coordinates as [number, number]);

    const feature: MapClickedFeature<StageGeojsonProperties> = {
      id: this.stage.properties.id,
      mapLayer: MapLayer.Stage,
      properties: {
        ...this.stage.properties,
        timetables: this.stage.properties.timetables,
        tickets: this.stage.properties.tickets,
      },
      geometry: this.stage.geometry,
    };

    this.mapStateService.selectMapFeatures([feature]);
  }
}
