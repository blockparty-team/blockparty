import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input
} from '@angular/core';
import { Router } from '@angular/router';
import { RouteName } from '@blockparty/festival/shared/types';
import {
  MapClickedFeature,
  MapLayer,
  StageGeojsonProperties,
} from '@blockparty/festival/data-access/supabase';
import { MapStateService } from '@blockparty/festival/data-access/state/map';
import { MapService } from '@blockparty/festival/shared/service/map';
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
  imports: [IonItem, IonThumbnail, IonLabel, IonIcon],
})
export class StageItemComponent {
  private router = inject(Router);
  private mapService = inject(MapService);
  private mapStateService = inject(MapStateService);

  readonly stage = input.required<Feature<Point, StageGeojsonProperties>>();

  onShowOnMap() {
    this.router.navigate(['/tabs', RouteName.Map]);
    const stage = this.stage();
    this.mapService.flyTo(stage.geometry.coordinates as [number, number]);

    const feature: MapClickedFeature<StageGeojsonProperties> = {
      id: stage.properties.id,
      mapLayer: MapLayer.Stage,
      properties: {
        ...stage.properties,
        timetables: stage.properties.timetables,
        tickets: stage.properties.tickets,
      },
      geometry: stage.geometry,
    };

    this.mapStateService.selectMapFeatures([feature]);
  }
}
