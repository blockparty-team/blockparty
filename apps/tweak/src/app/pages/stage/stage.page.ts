import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ToolbarComponent } from '@tweak/shared/components/toolbar/toolbar.component';
import { MapService } from '@tweak/services/map.service';

@Component({
    selector: 'app-stage',
    templateUrl: './stage.page.html',
    styleUrls: ['./stage.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, IonContent, ToolbarComponent],
    providers: [MapService]
})
export class StagePage implements AfterViewInit {
  private mapService = inject(MapService);

  ngAfterViewInit(): void {
    // this.mapService.initMap('stage-map');
  }
}
