import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Feature, Point, Position } from 'geojson';
import { RouteName } from '@distortion/app/shared/models/routeName';
import { MapService } from '@blockparty/festival/service/map';
import { AssetGeojsonProperties } from '@blockparty/festival/types';
import {
  IonItem,
  IonThumbnail,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-asset-item',
  templateUrl: './asset-item.component.html',
  styleUrls: ['./asset-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonItem, IonThumbnail, IonLabel, IonIcon],
})
export class AssetItemComponent {
  private router = inject(Router);
  private mapService = inject(MapService);

  @Input() asset: Feature<Point, AssetGeojsonProperties>;

  onShowOnMap(coords: Position) {
    this.router.navigate(['/tabs', RouteName.Map]);
    this.mapService.flyTo(coords as [number, number]);
  }
}
