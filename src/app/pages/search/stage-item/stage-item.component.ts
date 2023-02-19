import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StageGeojsonProperties } from '@app/interfaces/stage-geojson-properties';
import { MapService } from '@app/services/map.service';
import { RouteName } from '@app/shared/models/routeName';
import { Feature, Point, Position } from 'geojson';
import { EntityBadgeColor } from '../entity-badge-color';

@Component({
  selector: 'app-stage-item',
  templateUrl: './stage-item.component.html',
  styleUrls: ['./stage-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StageItemComponent {
  @Input() stage: Feature<Point, StageGeojsonProperties>;
  
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
