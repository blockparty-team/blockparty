import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {

  constructor(
    private mapSerice: MapService
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.mapSerice.initMap();
  }

}
