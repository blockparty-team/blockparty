import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements AfterViewInit {

  constructor(
    private mapService: MapService,
  ) { }

  ngAfterViewInit(): void {
    this.mapService.initMap();
  }

}
