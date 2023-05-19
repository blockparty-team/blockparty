import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MapIconViewModel } from '@app/interfaces/map-icon';
import { ToggleCustomEvent } from '@ionic/angular';
import { Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { MapService } from '@app/services/map.service';
import { MapLayer } from '@app/interfaces/map-layer';
import { MapStateService } from '../state/map-state.service';

interface IconsViewModel extends MapIconViewModel {
  visible: boolean;
}

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendComponent implements OnInit {

  iconsWithToggleState$: Observable<IconsViewModel[]>;

  constructor(
    private mapService: MapService,
    private mapStateService: MapStateService,
  ) { }

  ngOnInit() {
    this.iconsWithToggleState$ = combineLatest([
      this.mapStateService.mapIcons$,
      this.mapStateService.removedAssetIconNames$
    ]).pipe(
      map(([assets, removed]) => assets
        // Remove stage since not part of asset entity
        .filter(asset => asset.name !== 'stage')
        .map(asset => ({
          ...asset,
          visible: !removed.includes(asset.name)
        }))),
      distinctUntilChanged(),
      tap(assets => {
        const visible = assets
          .filter(asset => asset.visible)
          .map(asset => asset.name);

        this.mapService.filterLayer(MapLayer.AssetIcon, 'icon', visible);
        this.mapService.filterLayer(MapLayer.Asset, 'icon', visible);
      })
    )
  }

  onToggleChange(event: Event) {
    const name = (event as ToggleCustomEvent).target.value;
    const visible = (event as ToggleCustomEvent).detail.checked;
    this.mapStateService.updateRemovedAssetIconNames(name, visible);
  }

  public trackBy(index, asset: MapIconViewModel) {
    return asset.name;
  }
}
