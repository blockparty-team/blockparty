import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapLayer } from '@app/interfaces/map-layer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MapStateService } from '../state/map-state.service';

@Component({
  selector: 'app-feature-info-modal',
  templateUrl: './feature-info-modal.component.html',
  styleUrls: ['./feature-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureInfoModalComponent implements OnInit {
  selectedFeature$: Observable<MapClickedFeature>;
  mapLayer = MapLayer

  constructor(
    private mapStateService: MapStateService
  ) { }

  ngOnInit(
  ) {
    this.selectedFeature$ = this.mapStateService.selectedMapFeatures$.pipe(
      map(features => features[0])
    );
  }

}
