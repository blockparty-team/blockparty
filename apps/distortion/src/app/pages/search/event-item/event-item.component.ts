import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EventViewModel, MapLayer, RouteName } from '@blockparty/festival/types';
import { MapService } from '@blockparty/festival/service/map';
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
