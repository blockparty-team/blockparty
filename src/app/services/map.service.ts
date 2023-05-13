import { Injectable } from '@angular/core';
import { concat, EMPTY, forkJoin, Observable, of } from 'rxjs';
import { catchError, filter, first, map, switchMap, tap } from 'rxjs/operators';
import { AttributionControl, FilterSpecification, GeolocateControl, LngLatBoundsLike, LngLatLike, Map, PointLike } from 'maplibre-gl';
import { Device } from '@capacitor/device';
import { MapStateService } from '@app/pages/map/state/map-state.service';
import { getCssVariable } from '@app/shared/colors';
import { MapClickedFeature } from '@app/interfaces/map-clicked-feature';
import { MapLayer, MapSource } from '@app/interfaces/map-layer';
import { environment } from '@env/environment';
import { GeolocationService } from './geolocation.service';
import { FileService } from './file.service';
import { MapIconViewModel } from '@app/interfaces/map-icon';
import { Point } from 'geojson';
import { StageGeojsonProperties } from '@app/interfaces/stage-geojson-properties';

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

      if (e.features.length === 0) return;

      const features: MapClickedFeature<any>[] = e.features.map(feature => ({
        id: feature.properties.id,
        mapLayer,
        properties: mapLayer === MapLayer.Stage ?
          {
            ...feature.properties,
            // MapLibre automaticly stringifies nested objects in geojson properties.
            // Since stages has timetables and tickets properties represented as objects, 
            // these are parsed to get the back to original objects.
            timetables: JSON.parse(feature.properties.timetables),
            tickets: feature.properties.tickets ? JSON.parse(feature.properties.tickets) : null,
            tags: feature.properties.tags ? JSON.parse(feature.properties.tags) : null
          } as StageGeojsonProperties
          : feature.properties,
        geometry: feature.geometry as Point
      }));

      this.mapStateService.selectMapFeatures(features);
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
    offset: PointLike = [0, 0],
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

  public fitBounds(bounds: LngLatBoundsLike, padding: number = 10, offset: PointLike = [0, 0]): void {
    this.mapStateService.mapLoaded$.pipe(
      filter(mapLoaded => mapLoaded),
      first(),
      tap(() => {
        this.map.fitBounds(
          bounds,
          { padding, offset }
        );
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
            'circle-color': ['get', 'color'],
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              10, 1,
              15, 4,
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
            'text-offset': [0, 0.5],
            'text-justify': 'auto',
            'text-transform': 'uppercase',
            'text-size': 11,
            'icon-image': ['get', 'icon'],
            'icon-anchor': 'bottom',
            'icon-size': [
              'interpolate', ['linear'], ['zoom'],
              13, 0.1,
              18, 0.5,
              22, 1
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
            'icon-opacity': [
              'interpolate', ['linear'], ['zoom'],
              13, 0,
              14, 1
            ],
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
            'icon-image': ['get', 'icon'],
            'icon-size': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              16, 0.5,
              20, 1
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

  private addImage(fileUrl: string): Observable<HTMLImageElement | ImageBitmap> {
    return new Observable(observer => {
      this.map.loadImage(fileUrl, (error, image) => {
        if (error) {
          observer.error(error);
          return;
        }

        observer.next(image);
        observer.complete();
      });
    });
  }

  private get loadMapIcons$(): Observable<unknown> {
    return this.fileService.mapIconUrls$.pipe(
      filter(icons => !!icons),
      switchMap(icons => forkJoin(
        icons.map(icon => this.addImage(icon.fileUrl).pipe(
          // Catch error to prevent all images loads to fail.
          catchError(error => {
            console.error('map loadImage failed:', error);
            return of(null);
          })
        ))).pipe(
          map(images => icons.map((icon, i) => ({ name: icon.name, image: images[i] })))
        )),
      tap((icons: { name: string, image: HTMLImageElement | ImageBitmap }[]) => {
        icons
          .filter(icon => !!icon.image)
          .forEach(icon => this.map.addImage(icon.name, icon.image))
      })
    );
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
