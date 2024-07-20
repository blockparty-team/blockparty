import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { MapClickedFeature, MapLayer, StageGeojsonProperties, RouteName } from '@blockparty/festival/types';
import { MapStateService } from '@blockparty/festival/data-access/map-state';
import { MapService } from '@blockparty/festival/service/map';
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
