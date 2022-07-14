import { Injectable } from '@angular/core';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapLayer } from '@app/interfaces/map-layer';
import { AttributionControl, GeolocateControl, LngLatBoundsLike, Map, MapMouseEvent } from 'maplibre-gl';
import { environment } from 'src/environments/environment';
import { SupabaseService } from './supabase.service';
import { MapStateService } from '../pages/tab-map/state/map-state.service';
import { tap } from 'rxjs/operators';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';

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

    this.addControls();

    this.map.on('load', () => {

      this.map.resize();

      this.loadMapIcons();

      this.addAerial();
      this.addStages();
      this.addEvents();
      this.addAssets();
      this.addDayMask();

      this.addClickBehaviourToLayer('stage');
      this.addClickBehaviourToLayer('asset');
    });
  }

  addControls(): void {
    this.map.addControl(
      new AttributionControl(),
      'bottom-left'
    );

    const geolocateControl = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showAccuracyCircle: false
    })

    this.map.addControl(geolocateControl, 'bottom-right');

    geolocateControl.on('trackuserlocationstart', () => {

      // Request geolocation permission on IOS and Android
      Promise.all([Device.getInfo(), Geolocation.checkPermissions()])
        .then(([device, permission]) => {
          if (permission.location !== 'granted' && device.platform !== 'web') {
            Geolocation.requestPermissions();
          }
        });
    })
  }

  addClickBehaviourToLayer(layerName: MapLayer): void {
    this.map.on('click', layerName, e => {

      if (e.features.length > 0) {
        const features: MapClickedFeature[] = e.features.map(feature => ({
          id: feature.properties.id,
          layerName,
          geometry: feature.geometry as any
        }));

        this.mapStateService.selectMapFeatures(features);
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

    this.map.on('mouseenter', 'praj-point', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'praj-point', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  fitBounds(bounds: LngLatBoundsLike): void {
    this.map.fitBounds(bounds, { padding: 10 });
  }

  addAerial(): void {
    this.map.addSource('aerial', {
      "type": "raster",
      "tiles": [
        "https://services.datafordeler.dk/GeoDanmarkOrto/orto_foraar/1.0.0/WMS?username=DTMMBNXGMB&password=LvA$*001&VERSION=1.1.1&REQUEST=GetMap&BBOX={bbox-epsg-3857}&SRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=orto_foraar&STYLES=&FORMAT=image/jpeg"
      ],
      "tileSize": 256
    });

    this.map.addLayer({
      "id": "aerial",
      "type": "raster",
      "source": "aerial",
      "paint": {
        "raster-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          15,
          0,
          16,
          1
        ]
      },
      "layout": {
        "visibility": "visible"
      },
      "minzoom": 14
    }, 'label_road');
  }

  addDayMask(): void {
    this.supabaseService.tableAsGeojson('day_event_mask').pipe(
      tap(geojson => {
        this.map.addSource('day_event_mask', {
          type: 'geojson',
          data: geojson
        });

        this.map.addLayer({
          id: 'day_event_mask',
          type: 'fill',
          source: 'day_event_mask',
          layout: {},
          paint: {
            'fill-color': 'black',
            'fill-opacity': 0.3,
          },
          filter: ['==', 'day_id', '']
        });

        // this.map.addLayer({
        //   id: 'event-outline',
        //   type: 'line',
        //   source: 'event',
        //   layout: {},
        //   paint: {
        //     'line-color': 'gray',
        //     'line-width': 5,
        //     'line-dasharray': [4, 1]
        //   }
        // });
      })
    ).subscribe();
  }

  filterDayMask(dayId: string): void {
    this.map.setFilter('day_event_mask', ['==', 'day_id', dayId])
  }

  addEvents(): void {
    this.supabaseService.tableAsGeojson('event').pipe(
      tap(geojson => {
        this.map.addSource('event', {
          type: 'geojson',
          data: geojson
        });

        // this.map.addLayer({
        //   id: 'event',
        //   type: 'fill',
        //   source: 'event',
        //   layout: {},
        //   paint: {
        //     'fill-color': 'white',
        //     'fill-opacity': 0.2,
        //   }
        // });

        this.map.addLayer({
          id: 'event-outline',
          type: 'line',
          source: 'event',
          layout: {},
          paint: {
            'line-color': 'white',
            'line-width': 3,
            // 'line-dasharray': [4, 1]
          }
        });
      })
    ).subscribe();
  }

  addAssets(): void {
    this.supabaseService.tableAsGeojson('asset').pipe(
      tap(geojson => {
        this.map.addSource('asset', {
          type: 'geojson',
          data: geojson
        });

        this.map.addLayer({
          id: 'asset',
          type: 'circle',
          source: 'asset',
          layout: {},
          paint: {
            'circle-color': '#c85c67',
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              15, 4,
              16, 10,
              17, 0
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': [
              'interpolate', ['linear'], ['zoom'],
              16, 2,
              17, 0
            ],
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              16, 1,
              17, 0
            ]
          },
        });

        this.map.addLayer({
          id: 'asset-icon',
          type: 'symbol',
          source: 'asset',
          minzoom: 16,
          layout: {
            'icon-anchor': 'bottom',
            // 'text-field': ['get', 'name'],
            'icon-offset': [9.5, 0],
            // 'text-justify': 'auto',
            'icon-image': 'toilet',
            'icon-size': [
              'interpolate', ['linear'], ['zoom'],
              16, 0,
              17, 0.8
            ],
            'icon-allow-overlap': true
          }
        });

        // this.map.addLayer({
        //   id: 'asset-heat',
        //   type: 'heatmap',
        //   source: 'asset',
        //   maxzoom: 17,
        //   layout: {},
        //   paint: {
        //     'heatmap-weight': [
        //       'interpolate',
        //       ['linear'],
        //       ['zoom'],
        //       12,
        //       1,
        //       22,
        //       5
        //     ],
        //     'heatmap-radius': [
        //       'interpolate',
        //       ['linear'],
        //       ['zoom'],
        //       0,
        //       1,
        //       9.9,
        //       1,
        //       22,
        //       25
        //     ],
        //     'heatmap-color': [
        //       'interpolate',
        //       ['linear'],
        //       ['heatmap-density'],
        //       0,
        //       'rgba(0, 0, 255, 0)',
        //       0.1,
        //       'hsl(141, 44%, 83%)',
        //       0.3,
        //       'hsl(173, 39%, 75%)',
        //       0.5,
        //       'hsl(196, 68%, 70%)',
        //       0.7,
        //       'hsl(223, 83%, 70%)',
        //       1,
        //       'hsl(213, 100%, 50%)'
        //     ],
        //     'heatmap-opacity': [
        //       'interpolate',
        //       ['linear'],
        //       ['zoom'],
        //       0,
        //       0.6,
        //       16,
        //       0.6,
        //       17,
        //       0
        //     ],
        //     'heatmap-intensity': 2
        //   }
        // });

      })
    ).subscribe();
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
                13, 0.1,
                18, 0.6,
                22, 1.5
              ],
              'icon-allow-overlap': true
            }
          });
        })
      ).subscribe();

    });
  }

  loadMapIcons(): void {
    const icons = [
      'bar',
      'cocktail',
      'restaurant',
      'toilet',
      'theater'
    ]

    icons.forEach(icon => {
      this.map.loadImage(`assets/map-icons/${icon}.png`, (error, img) => {
        if (error) {
          throw error;
        };

        this.map.addImage(icon, img);
      })
    })
  }
}
