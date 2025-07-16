import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MapLayer } from '@blockparty/festival/shared/types';
import { tap } from 'rxjs/operators';
import { MapStateService } from '@blockparty/festival/data-access/state/map';
import { MapService } from '@blockparty/festival/shared/service/map';
import { AssetComponent } from './asset/asset.component';
import { StageTimetableComponent } from './stage-timetable/stage-timetable.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-feature-info-modal',
  templateUrl: './feature-info-modal.component.html',
  styleUrls: ['./feature-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StageTimetableComponent, AssetComponent, AsyncPipe],
})
export class FeatureInfoModalComponent {
  private mapStateService = inject(MapStateService);
  private mapService = inject(MapService);

  mapLayer = MapLayer;

  selectedFeature$ = this.mapStateService.selectedMapFeature$.pipe(
    tap((feature) =>
      this.mapService.flyTo(
        feature.geometry.coordinates as [number, number],
        [0, -60],
      ),
    ),
  );
}
