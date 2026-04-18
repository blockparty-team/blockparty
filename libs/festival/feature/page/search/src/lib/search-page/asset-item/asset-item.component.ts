import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { Feature, Point, Position } from 'geojson';
import { MapService } from '@blockparty/festival/shared/service/map';
import { RouteName } from '@blockparty/festival/shared/types';
import { AssetGeojsonProperties } from '@blockparty/festival/data-access/supabase';
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
  imports: [IonItem, IonThumbnail, IonLabel, IonIcon],
})
export class AssetItemComponent {
  private router = inject(Router);
  private mapService = inject(MapService);

  readonly asset = input.required<Feature<Point, AssetGeojsonProperties>>();
  readonly placeholderImgSrc =
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Crect width=%2240%22 height=%2240%22 rx=%226%22 fill=%22%2335334f%22/%3E%3Cpath d=%22M10 26l6-7 5 5 4-4 5 6v4H10z%22 fill=%22%23b5b0cb%22/%3E%3Ccircle cx=%2215%22 cy=%2215%22 r=%223%22 fill=%22%23b5b0cb%22/%3E%3C/svg%3E';

  imageSrc(): string {
    return this.asset().properties.imgUrl?.trim() || this.placeholderImgSrc;
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (!image) {
      return;
    }

    image.onerror = null;
    image.src = this.placeholderImgSrc;
  }

  onShowOnMap(coords: Position) {
    this.router.navigate(['/tabs', RouteName.Map]);
    this.mapService.flyTo(coords as [number, number]);
  }
}
