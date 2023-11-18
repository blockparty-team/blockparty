import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EventViewModel } from '@app/interfaces/event';
import { MapLayer } from '@app/interfaces/map-layer';
import { MapService } from '@app/services/map.service';
import { RouteName } from '@app/shared/models/routeName';
import { LngLatBoundsLike } from 'maplibre-gl';
import { EntityBadgeColor } from '../entity-badge-color';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-event-item',
    templateUrl: './event-item.component.html',
    styleUrls: ['./event-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, RouterLink]
})
export class EventItemComponent {
  @Input() event: EventViewModel;

  routeName = RouteName;
  badgeColor = EntityBadgeColor;

  constructor(
    private router: Router,
    private mapService: MapService
  ) { }

  onZoomToEventOnMap(id: string, bounds: number[]) {
    this.router.navigate(['/tabs', RouteName.Map]);
    this.mapService.fitBounds(bounds as LngLatBoundsLike);
    this.mapService.highlightFeature(MapLayer.EventHighLight, id, true);
  }
}
