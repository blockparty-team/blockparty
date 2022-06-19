import { Injectable } from '@angular/core';
import { Map } from 'maplibre-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map: Map;

  constructor() { }

  initMap(): void {
    this.map = new Map({
      container: 'map-container',
      style: 'https://api.maptiler.com/maps/decadbf9-1a07-4b7b-9726-fed2f003b673/style.json?key=MZCjtFvEvhy0zEdhtmhp',
      center: [12.547927, 55.667071],
      zoom: 15,
      attributionControl: false,
      hash: true
    });

    this.map.on('load', () => {
      this.map.resize();

      this.addIcon([12.547927, 55.667071]);
    });
  }

  addIcon(coords: [number, number]): void {
    this.map.loadImage('assets/map-icons/stage.png', (error, img) => {
      if (error) {
        throw error;
      };

      this.map.addImage('stage', img);

      this.map.addSource('point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: coords
              }
            }
          ]
        }
      });

      this.map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'point',
        minzoom: 13,
        layout: {
          'icon-image': 'stage',
          'icon-size': [
            'interpolate', ['linear'], ['zoom'],
            13, 0.02,
            22, 2
          ]
        }
      });

    });
  }
}
