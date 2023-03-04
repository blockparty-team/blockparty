import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Feature, Point, Position } from 'geojson';
import { RouteName } from '@app/shared/models/routeName';
import { MapService } from '@app/services/map.service';
import { AssetGeojson } from '@app/interfaces/database-entities';

interface AssetProperties extends AssetGeojson {
  imgUrl?: string;
}

@Component({
  selector: 'app-asset-item',
  templateUrl: './asset-item.component.html',
  styleUrls: ['./asset-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetItemComponent {
  @Input() asset: Feature<Point, AssetProperties>

  constructor(
    private router: Router,
    private mapService: MapService
  ) { }

  onShowOnMap(coords: Position) {
    this.router.navigate(['/tabs', RouteName.Map])
    this.mapService.flyTo(coords as [number, number])
  }

}
