import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AttributionControl, GeolocateControl, LngLatBoundsLike, LngLatLike, Map, MapMouseEvent } from 'maplibre-gl';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';
import { SupabaseService } from '@app/services/supabase.service';
import { MapStateService } from '@app/pages/tab-map/state/map-state.service';
import { color } from '@app/shared/colors';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapLayer, MapSource, mapSourceLayer } from '@app/interfaces/map-layer';
import { environment } from '@env/environment';

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

      this.mapStateService.updateMapLoaded(true);

      this.map.resize();

      this.loadMapIcons();
      this.addAerial();
      this.addLayers();

      this.addClickBehaviourToLayer(MapLayer.Stage);
      this.addClickBehaviourToLayer(MapLayer.Asset);
      this.addClickBehaviourToLayer(MapLayer.AssetIcon);

      this.map.on('movestart', () => this.mapStateService.updateMapInteraction(true))
      this.map.on('moveend', () => this.mapStateService.updateMapInteraction(false))
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

  addClickBehaviourToLayer(mapLayer: MapLayer): void {
    this.map.on('click', mapLayer, e => {

      if (e.features.length > 0) {

        const features: MapClickedFeature[] = e.features.map(feature => ({
          id: feature.properties.id,
          mapLayer,
          properties: feature.properties,
          geometry: feature.geometry as any
        }));

        this.mapStateService.selectMapFeatures(features);
      }
    });

    this.map.on('mouseenter', mapLayer, () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', mapLayer, () => {
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

  flyTo(center: [number, number]): void {
    this.map.flyTo({
      center,
      zoom: 18
    })
  }

  fitBounds(bounds: LngLatBoundsLike): void {
    this.map.fitBounds(bounds, { padding: 10 });
  }

  resize(): void {
    this.map.resize();
  }

  highlightFeature(layerName: MapLayer, id: string): void {
    this.map.setFilter(layerName, ['==', 'id', id]);
  }

  removeFeatureHighlight(layerName: MapLayer): void {
    this.map.setFilter(layerName, ['==', 'id', '']);
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

  addLayers(): void {
    forkJoin(
      Object.values(MapSource)
        .map(layer => this.supabaseService.tableAsGeojson(layer))
    ).pipe(
      tap((layers) => {

        // Add map sources based on MapLayer Enum
        Object.values(MapSource)
          .map((layerName, i) => [layerName, layers[i]])
          .forEach(([layerName, geojson]) => {
            this.map.addSource(layerName as string, {
              type: 'geojson',
              data: geojson
            })
          })

        // Add layers
        this.map.addLayer({
          id: MapLayer.DayEventMask,
          type: 'fill',
          source: MapSource.DayEventMask,
          layout: {},
          paint: {
            'fill-color': 'black',
            'fill-opacity': 0.3,
          },
          filter: ['==', 'id', '52c29de2-fdd7-4b2b-bad9-9c8e68cdf7a4'] // TODO: don't use hardcoded value
        });

        this.map.addLayer({
          id: MapLayer.Event,
          type: 'line',
          source: MapSource.Event,
          layout: {},
          paint: {
            'line-color': 'white',
            'line-width': 3,
          },
        });

        this.map.addLayer({
          id: MapLayer.EventHighLight,
          type: 'line',
          source: MapSource.Event,
          layout: {},
          paint: {
            'line-color': color('--ion-color-tertiary'),
            'line-width': 6,
          },
          filter: ['==', 'id', '']
        });

        this.map.addLayer({
          id: MapLayer.StageHighlight,
          type: 'circle',
          source: MapSource.Stage,
          layout: {},
          paint: {
            'circle-color': color('--ion-color-tertiary'),
            'circle-radius': 40,
          },
          filter: ['==', 'id', '']
        });

        this.map.addLayer({
          id: MapLayer.Asset,
          type: 'circle',
          source: MapSource.Asset,
          layout: {},
          paint: {
            'circle-color': '#c85c67',
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              10, 2,
              15, 4,
              15.5, 0
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': [
              'interpolate', ['linear'], ['zoom'],
              15, 2,
              15.5, 0
            ],
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15, 1,
              15.5, 0
            ]
          },
        });

        this.map.addLayer({
          id: MapLayer.AssetIcon,
          type: 'symbol',
          source: MapSource.Asset,
          minzoom: 15,
          layout: {
            'icon-anchor': 'bottom',
            'icon-offset': [9.5, 0],
            'icon-image': ['get', 'icon'],
            'icon-size': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.5, 0.6
            ],
            'icon-allow-overlap': true
          }
        });

        this.map.addLayer({
          id: MapLayer.Stage,
          type: 'symbol',
          source: MapSource.Stage,
          minzoom: 13,
          layout: {
            'text-field': ['get', 'name'],
            'text-offset': [0, -0.5],
            'text-justify': 'auto',
            'text-transform': 'uppercase',
            'icon-image': 'stage',
            'icon-anchor': 'bottom',
            'icon-size': [
              'interpolate', ['linear'], ['zoom'],
              13, 0.1,
              18, 0.6,
              22, 1.5
            ],
            'icon-allow-overlap': true,
            'text-allow-overlap': true,
            'text-anchor': 'top'
          },
          paint: {
            "text-color": color('--ion-color-light'),
            "text-halo-color": color('--ion-color-medium'),
            "text-halo-width": 3,
            'icon-halo-blur': 10,
            'text-opacity': [
              'interpolate', ['linear'], ['zoom'],
              16.4, 0,
              16.5, 1
            ]
          }
        });

        // TODO: First  Find better way to fit bounds
        this.fitBounds(layers[0].features[0].properties.bounds)

      })
    ).subscribe();
  }

  loadMapIcons(): void {
    const icons = [
      'bar',
      'cocktail',
      'restaurant',
      'toilet',
      'theater',
      'stage'
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
