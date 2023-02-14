import { Injectable } from '@angular/core';
import { concat, EMPTY, Observable } from 'rxjs';
import { catchError, filter, first, tap } from 'rxjs/operators';
import { AttributionControl, FilterSpecification, GeolocateControl, LngLatBoundsLike, LngLatLike, Map, PointLike } from 'maplibre-gl';
import { Device } from '@capacitor/device';
import { MapStateService } from '@app/pages/map/state/map-state.service';
import { getCssVariable } from '@app/shared/colors';
import { GeojsonProperties, MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapLayer, MapSource } from '@app/interfaces/map-layer';
import { environment } from '@env/environment';
import { GeolocationService } from './geolocation.service';
import { FileService } from './file.service';
import { MapIconViewModel } from '@app/interfaces/map-icon';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map: Map;

  constructor(
    private mapStateService: MapStateService,
    private geolocationService: GeolocationService,
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

      this.map.on('movestart', () => this.mapStateService.updateMapInteraction(true));
      this.map.on('moveend', () => this.mapStateService.updateMapInteraction(false));
    });

    this.map.once('idle', () => this.mapStateService.updateMapIdle(false));

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

        const features: MapClickedFeature<GeojsonProperties>[] = e.features.map(feature => ({
          id: feature.properties.id,
          mapLayer,
          properties: feature.properties as GeojsonProperties,
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

  public flyTo(
    center: [number, number],
    offset: PointLike = [0,0],
    zoom: number = 18
  ): void {
    this.mapStateService.mapLoaded$.pipe(
      filter(mapLoaded => mapLoaded),
      first(),
      tap(() => {
        this.map.flyTo({
          center,
          offset,
          zoom,
        })
      })
    ).subscribe()
  }

  public fitBounds(bounds: LngLatBoundsLike): void {
    this.mapStateService.mapLoaded$.pipe(
      filter(mapLoaded => mapLoaded),
      first(),
      tap(() => {
        this.map.fitBounds(bounds, { padding: 10 });
      })
    ).subscribe()
  }

  public resize(): void {
    this.map.resize();
  }

  public highlightFeature(layerName: MapLayer, id: string, autoRemove = false): void {
    this.mapStateService.mapIdle$.pipe(
      filter(mapIdle => !mapIdle),
      first(),
      tap(() => {
        this.map.setFilter(layerName, ['==', 'id', id]);

        if (autoRemove) {
          setTimeout(() => {
            this.removeFeatureHighlight(layerName);
          }, 5000);
        }
      })
    ).subscribe();
  }

  public removeFeatureHighlight(layerName: MapLayer): void {
    this.map.setFilter(layerName, ['==', 'id', '']);
  }

  public filterLayer(layer: MapLayer, property: string, values: string[]) {
    const filter: FilterSpecification = ['in', property, ...values];
    this.map.setFilter(layer, filter);
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
    return this.mapStateService.mapLayers$.pipe(
      tap(layers => {

        // Add map sources
        layers.forEach(({ mapSource, geojson }) => {

          // Layer can be added twice since initial load from local storage
          if (this.map.getSource(mapSource)) {
            (this.map.getSource(mapSource) as any).setData(geojson)
            return;
          }

          this.map.addSource(mapSource as string, {
            type: 'geojson',
            data: geojson
          })
        });

        // Layer can be added twice since initial load from local storage
        const layersAdded = (Object.values(MapLayer) as string[]).every(layer => {
          return this.map.getStyle().layers
            .map(layer => layer.id)
            .includes(layer)
        })

        if (layersAdded) {
          return;
        }

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
            'line-color': ['get', 'color'],
            'line-width': [
              'interpolate', ['linear'], ['zoom'],
              10, 1,
              17, 5,
              21, 14,
            ],
            'line-opacity': 0.8
          },
        });

        this.map.addLayer({
          id: MapLayer.EventHighLight,
          type: 'line',
          source: MapSource.Event,
          layout: {},
          paint: {
            'line-color': ['get', 'color'],
            'line-width': [
              'interpolate', ['linear'], ['zoom'],
              10, 2,
              18, 7,
              21, 18,
            ],
          },
          filter: ['==', 'id', '']
        });

        this.map.addLayer({
          id: MapLayer.StageHighlight,
          type: 'circle',
          source: MapSource.Stage,
          layout: {},
          paint: {
            'circle-color': getCssVariable('--ion-color-primary'),
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
            "text-color": getCssVariable('--ion-text-color'),
            "text-halo-color": getCssVariable('--ion-background-color'),
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

  // private add3dBuildings(): void {
  //   this.map.addLayer({
  //     'id': '3d-buildings',
  //     'source': 'openmaptiles',
  //     'source-layer': 'building',
  //     'type': 'fill-extrusion',
  //     'minzoom': 16,
  //     'paint': {
  //       'fill-extrusion-color': 'hsl(47, 66%, 59%)',
  //       'fill-extrusion-height': [
  //         'interpolate',
  //         ['linear'],
  //         ['zoom'],
  //         16,
  //         0,
  //         16.5,
  //         ['get', 'render_height']
  //       ],
  //       'fill-extrusion-base': [
  //         'interpolate',
  //         ['linear'],
  //         ['zoom'],
  //         16,
  //         0,
  //         16.5,
  //         ['get', 'render_min_height']
  //       ],
  //       'fill-extrusion-opacity': 0.4
  //     }
  //   });
  // }

  private get loadMapIcons$(): Observable<MapIconViewModel[]> {
    return this.fileService.mapIconUrls$.pipe(
      filter(icons => !!icons),
      tap(icons => icons.forEach(icon => {
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
      this.loadMapIcons$.pipe(
        catchError(err => {
          console.error(err);
          return EMPTY;
        })),
      this.addLayers$
    ).subscribe();
  }

}
