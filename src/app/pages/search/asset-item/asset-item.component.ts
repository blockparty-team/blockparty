import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Feature, Point, Position } from 'geojson';
import { AssetGeojson } from '@app/interfaces/database-entities';
import { EntityBadgeColor } from '../entity-badge-color';
import { Router } from '@angular/router';
import { RouteName } from '@app/shared/models/routeName';
import { MapService } from '@app/services/map.service';

@Component({
  selector: 'app-asset-item',
  templateUrl: './asset-item.component.html',
  styleUrls: ['./asset-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetItemComponent {
  @Input() asset: Feature<Point, AssetGeojson>

  badgeColor = EntityBadgeColor;

  constructor(
    private router: Router,
    private mapService: MapService
  ) { }

  onShowOnMap(coords: Position) {
    this.router.navigate(['/tabs', RouteName.Map])
    this.mapService.flyTo(coords as [number, number])
  }

}
