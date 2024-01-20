import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EventViewModel } from '@distortion/app/interfaces/event';
import { MapLayer } from '@distortion/app/interfaces/map-layer';
import { MapService } from '@distortion/app/services/map.service';
import { RouteName } from '@distortion/app/shared/models/routeName';
import { LngLatBoundsLike } from 'maplibre-gl';
import { EntityBadgeColor } from '../entity-badge-color';
import {
  IonItem,
  IonBadge,
  IonLabel,
  IonIcon,
  IonRouterLink,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, IonItem, IonBadge, IonLabel, IonIcon, IonRouterLink],
})
export class EventItemComponent {
  private router = inject(Router);
  private mapService = inject(MapService);

  @Input() event: EventViewModel;

  routeName = RouteName;
  badgeColor = EntityBadgeColor;

  onZoomToEventOnMap(id: string, bounds: number[]) {
    this.router.navigate(['/tabs', RouteName.Map]);
    this.mapService.fitBounds(bounds as LngLatBoundsLike);
    this.mapService.highlightFeature(MapLayer.EventHighLight, id, true);
  }
}
