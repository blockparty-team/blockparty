import { Injectable } from '@angular/core';
import { concat, forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AttributionControl, GeolocateControl, LngLatBoundsLike, LngLatLike, Map } from 'maplibre-gl';
import { Device } from '@capacitor/device';
import { SupabaseService } from '@app/services/supabase.service';
import { MapStateService } from '@app/pages/tab-map/state/map-state.service';
import { color } from '@app/shared/colors';
import { GeojsonProperties, MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapLayer, MapSource } from '@app/interfaces/map-layer';
import { environment } from '@env/environment';
import { GeolocationService } from './geolocation.service';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map: Map;

  constructor(
    private mapStateService: MapStateService,
    private geolocationService: GeolocationService,
    private supabaseService: SupabaseService,
    private fileService: FileService
  ) { }

  public initMap(): void {
    this.map = new Map({
      container: 'map-container',
      style: environment.maptilerStyleJson,
      center: environment.mapView.center as LngLatLike,
      zoom: environment.mapView.zoom,
      pitch: environment.mapView.pitch,
      attributionControl: false
    });

    this.addControls();

    this.map.on('load', () => {

      this.mapStateService.updateMapLoaded(true);

      this.map.resize();

      this.addAerial();
      this.addMapData();

      this.addClickBehaviourToLayer(MapLayer.Stage);
      this.addClickBehaviourToLayer(MapLayer.Asset);
      this.addClickBehaviourToLayer(MapLayer.AssetIcon);

      this.map.on('movestart', () => this.mapStateService.updateMapInteraction(true))
      this.map.on('moveend', () => this.mapStateService.updateMapInteraction(false))
    });
  }

  private addControls(): void {
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
      // TODO clean up mix of promise and observable
      Promise.all([Device.getInfo(), this.geolocationService.checkPermissions().toPromise()])
        .then(([device, permission]) => {
          if (permission.location !== 'granted' && device.platform !== 'web') {
            this.geolocationService.requestPermissions().toPromise();
          }
        });
    })
  }

  private addClickBehaviourToLayer(mapLayer: MapLayer): void {
    this.map.on('click', mapLayer, e => {

      if (e.features.length > 0) {

        const features: MapClickedFeature<any>[] = e.features.map(feature => ({
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

  public flyTo(center: [number, number]): void {
    this.map.flyTo({
      center,
      zoom: 18
    })
  }

  public fitBounds(bounds: LngLatBoundsLike): void {
    this.map.fitBounds(bounds, { padding: 10 });
  }

  public resize(): void {
    this.map.resize();
  }

  public highlightFeature(layerName: MapLayer, id: string): void {
    this.map.setFilter(layerName, ['==', 'id', id]);
  }

  public removeFeatureHighlight(layerName: MapLayer): void {
    this.map.setFilter(layerName, ['==', 'id', '']);
  }

  private addAerial(): void {
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

  private get addLayers$(): Observable<any> {
    return forkJoin(
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
          id: MapLayer.Stage,
          type: 'symbol',
          source: MapSource.Stage,
          minzoom: 13,
          layout: {
            'text-field': ['get', 'name'],
            'text-offset': [0, -0.5],
            'text-justify': 'auto',
            'text-transform': 'uppercase',
            'text-size': 13,
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

      })
    );
  }

  private add3dBuildings(): void {
    this.map.addLayer({
      'id': '3d-buildings',
      'source': 'openmaptiles',
      'source-layer': 'building',
      'type': 'fill-extrusion',
      'minzoom': 16,
      'paint': {
        'fill-extrusion-color': 'hsl(47, 66%, 59%)',
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          16,
          0,
          16.5,
          ['get', 'render_height']
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          16,
          0,
          16.5,
          ['get', 'render_min_height']
        ],
        'fill-extrusion-opacity': 0.4
      }
    });
  }

  private get loadMapIcons$(): Observable<any> {
    return this.fileService.mapIconUrls$.pipe(
      tap(mapIcons => mapIcons.forEach(icon => {
        this.map.loadImage(icon.fileUrl, (error, img) => {

          if (error) {
            throw error;
          };

          this.map.addImage(icon.name, img);
        })
      }))
    )
  }

  private addMapData(): void {
    concat(
      this.loadMapIcons$,
      this.addLayers$
    ).subscribe();
  }

}
