import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Feature, Point, Position } from 'geojson';
import { RouteName } from '@app/shared/models/routeName';
import { MapService } from '@app/services/map.service';
import { AssetGeojsonProperties } from '@app/interfaces/asset-geojson-properties';
import { IonItem, IonThumbnail, IonLabel, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-asset-item',
  templateUrl: './asset-item.component.html',
  styleUrls: ['./asset-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonItem, IonThumbnail, IonLabel, IonIcon]
})
export class AssetItemComponent {

  private router = inject(Router);
  private mapService = inject(MapService);

  @Input() asset: Feature<Point, AssetGeojsonProperties>

  onShowOnMap(coords: Position) {
    this.router.navigate(['/tabs', RouteName.Map])
    this.mapService.flyTo(coords as [number, number])
  }

}
