import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ToolbarComponent } from '@tweak/shared/components/toolbar/toolbar.component';
import { MapService } from '@tweak/services/map.service';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.page.html',
  styleUrls: ['./asset.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, IonContent, ToolbarComponent],
  providers: [MapService],
})
export class AssetPage implements AfterViewInit {
  private mapService = inject(MapService);

  ngAfterViewInit(): void {
    // this.mapService.initMap('asset-map');
  }
}
