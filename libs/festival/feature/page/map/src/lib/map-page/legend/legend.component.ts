import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MapIconViewModel,
  MapLayer,
} from '@blockparty/festival/data-access/supabase';
import { ToggleCustomEvent } from '@ionic/angular/standalone';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { MapService } from '@blockparty/festival/shared/service/map';
import { MapStateService } from '@blockparty/festival/data-access/state/map';
import { SafePipe } from '@blockparty/festival/shared/pipes';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonToggle,
} from '@ionic/angular/standalone';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonToggle,
    SafePipe,
  ],
})
export class LegendComponent {
  private mapService = inject(MapService);
  private mapStateService = inject(MapStateService);

  iconsWithToggleState = toSignal(
    combineLatest([
      this.mapStateService.mapIcons$,
      this.mapStateService.removedAssetIconNames$,
    ]).pipe(
      map(([assets, removed]) =>
        assets
          // Remove stage since not part of asset entity
          .filter((asset) => asset.name !== 'stage')
          .map((asset) => ({
            ...asset,
            visible: !removed.includes(asset.name),
          })),
      ),
      distinctUntilChanged(),
      tap((assets) => {
        const visible = assets
          .filter((asset) => asset.visible)
          .map((asset) => asset.name);

        this.mapService.filterLayer(MapLayer.AssetIcon, 'icon', visible as any);
        this.mapService.filterLayer(MapLayer.Asset, 'icon', visible as any);
      }),
    ),
    { initialValue: [] },
  );

  onToggleChange(event: Event) {
    const name = (event as ToggleCustomEvent).target.value;
    const visible = (event as ToggleCustomEvent).detail.checked;
    this.mapStateService.updateRemovedAssetIconNames(name!, visible);
  }

  public trackBy(_index: number, asset: MapIconViewModel): string {
    return asset.name ?? '';
  }
}
