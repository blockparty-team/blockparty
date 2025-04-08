import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MapLayer } from '@blockparty/festival/shared/types';
import { tap } from 'rxjs/operators';
import { MapStateService } from '@blockparty/festival/data-access/state/map';
import { MapService } from '@blockparty/festival/shared/service/map';
import { AssetComponent } from './asset/asset.component';
import { StageTimetableComponent } from './stage-timetable/stage-timetable.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';

@Component({
    selector: 'app-feature-info-modal',
    templateUrl: './feature-info-modal.component.html',
    styleUrls: ['./feature-info-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        StageTimetableComponent,
        AssetComponent,
        AsyncPipe,
        IonContent,
    ]
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
