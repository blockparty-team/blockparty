import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MapIconViewModel, MapLayer } from '@blockparty/festival/shared/types';
import { ToggleCustomEvent } from '@ionic/angular/standalone';
import { Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { MapService } from '@blockparty/festival/shared/service/map';
import { MapStateService } from '@blockparty/festival/data-access/state/map';
import { AsyncPipe } from '@angular/common';
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

interface IconsViewModel extends MapIconViewModel {
  visible: boolean;
}

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonToggle,
  ],
})
export class LegendComponent implements OnInit {
  iconsWithToggleState$!: Observable<IconsViewModel[]>;

  constructor(
    private mapService: MapService,
    private mapStateService: MapStateService,
  ) {}

  ngOnInit() {
    this.iconsWithToggleState$ = combineLatest([
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
    );
  }

  onToggleChange(event: Event) {
    const name = (event as ToggleCustomEvent).target.value;
    const visible = (event as ToggleCustomEvent).detail.checked;
    this.mapStateService.updateRemovedAssetIconNames(name!, visible);
  }

  public trackBy(_index: number, asset: MapIconViewModel) {
    return asset.name;
  }
}
