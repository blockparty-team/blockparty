import { Injectable } from '@angular/core';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapLayer } from '@app/interfaces/map-layer';
import { Map, MapMouseEvent } from 'maplibre-gl';
import { environment } from 'src/environments/environment';
import { SupabaseService } from './supabase.service';
import { MapStateService } from '../pages/tab-map/state/map-state.service';
import { tap } from 'rxjs/operators';
import { Feature, Point, Polygon } from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map: Map;

  constructor(
    private mapStateService: MapStateService,
    private supabaseService: SupabaseService
  ) { }

  initMap(): void {
    this.map = new Map({
      container: 'map-container',
      style: environment.maptilerStyleJson,
      center: [12.547927, 55.667071],
      zoom: 15,
      attributionControl: false
    });

    this.map.on('load', () => {
      this.map.resize();

      this.addStages();

      this.addClickBehaviourToLayer('stage');

    });

  }

  addClickBehaviourToLayer(layerName: MapLayer): void {
    this.map.on('click', layerName, e => {

      if (e.features.length > 0) {
        const features: MapClickedFeature[] = e.features.map(feature => ({
          id: feature.properties.id,
          layerName,
          geometry: feature.geometry as any
        }));

        this.mapStateService.selectedMapFeatures(features);
      }
    });

    this.map.on('mouseenter', layerName, () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', layerName, () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  onClick(event: MapMouseEvent): void {

    const features = this.map.queryRenderedFeatures(event.lngLat);

    console.log(features);

    this.map.on('mouseenter', 'praj-point', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'praj-point', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  addStages(): void {
    this.map.loadImage('assets/map-icons/stage.png', (error, img) => {
      if (error) {
        throw error;
      };

      this.map.addImage('stage', img);

      this.supabaseService.tableAsGeojson('stage').pipe(
        tap(geojson => {
          this.map.addSource('stage', {
            type: 'geojson',
            data: geojson
          });

          this.map.addLayer({
            id: 'stage',
            type: 'symbol',
            source: 'stage',
            minzoom: 13,
            layout: {
              // 'text-field': ['get', 'name'],
              // 'text-offset': [0, 2],
              // 'text-justify': 'auto',
              'icon-image': 'stage',
              'icon-size': [
                'interpolate', ['linear'], ['zoom'],
                13, 0.02,
                22, 1.5
              ],
              'icon-allow-overlap': true
            }
          });
        })
      ).subscribe();

    });
  }
}
