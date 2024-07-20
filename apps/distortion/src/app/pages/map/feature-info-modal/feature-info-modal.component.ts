import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  GeojsonProperties,
  MapClickedFeature,
  MapLayer,
} from '@blockparty/festival/types';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MapStateService } from '@blockparty/festival/data-access/state/map';
import { MapService } from '@blockparty/festival/service/map';
import { AssetComponent } from './asset/asset.component';
import { StageTimetableComponent } from './stage-timetable/stage-timetable.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-feature-info-modal',
  templateUrl: './feature-info-modal.component.html',
  styleUrls: ['./feature-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    StageTimetableComponent,
    AssetComponent,
    AsyncPipe,
    IonContent,
  ],
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
