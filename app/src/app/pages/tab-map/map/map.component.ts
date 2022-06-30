import { Component, AfterViewInit } from '@angular/core';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {

  constructor(
    private mapSerice: MapService,
  ) { }

  ngAfterViewInit(): void {
    this.mapSerice.initMap();
  }

}
