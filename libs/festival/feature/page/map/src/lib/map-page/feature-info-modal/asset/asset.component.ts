import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MapClickedFeature,
  MapLayer,
} from '@blockparty/festival/data-access/supabase';
import { filter, map } from 'rxjs/operators';
import { MapStateService } from '@blockparty/festival/data-access/state/map';
import {
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonToolbar, IonTitle, IonButtons, IonButton],
})
export class AssetComponent {
  private mapStateService = inject(MapStateService);

  private asset$ = this.mapStateService.selectedMapFeature$.pipe(
    filter(
      (feature) =>
        feature.mapLayer === MapLayer.Asset ||
        feature.mapLayer === MapLayer.AssetIcon,
    ),
  );

  private location$ = this.asset$.pipe(
    map((stage) => stage.geometry.coordinates as [number, number]),
  );

  asset = toSignal<MapClickedFeature<any> | null>(this.asset$, {
    initialValue: null,
  });

  location = toSignal<[number, number] | null>(this.location$, {
    initialValue: null,
  });

  onOpenGoogleMapsDirections(coords: [number, number]): void {
    const url = `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${coords[1]},${coords[0]}`;
    window.open(url, '_blank');
  }
}
