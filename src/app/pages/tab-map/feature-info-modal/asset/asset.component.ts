import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapLayer } from '@app/interfaces/map-layer';
import { definitions } from '@app/interfaces/supabase';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MapStateService } from '../../state/map-state.service';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetComponent implements OnInit {

  asset$: Observable<MapClickedFeature<definitions['asset_geojson']>>

  constructor(
    private mapStateService: MapStateService
  ) { }

  ngOnInit() {
    this.asset$ = this.mapStateService.selectedMapFeatures$.pipe(
      map(features => features[0]),
      filter(feature => (
        feature.mapLayer === MapLayer.Asset ||
        feature.mapLayer === MapLayer.AssetIcon
      ))
    )
  }

}
