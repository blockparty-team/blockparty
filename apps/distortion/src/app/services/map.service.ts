import { inject, Injectable } from '@angular/core';
import { concat, EMPTY } from 'rxjs';
import { catchError, filter, first, switchMap, tap } from 'rxjs/operators';
import { Device } from '@capacitor/device';
import {
  AttributionControl,
  FilterSpecification,
  GeolocateControl,
  LngLatBoundsLike,
  LngLatLike,
  Map,
  PointLike,
  StyleImageInterface,
  addProtocol
} from 'maplibre-gl';
import { Point } from 'geojson';
import { MapStateService } from '@distortion/app/pages/map/state/map-state.service';
import { getCssVariable } from '@distortion/app/shared/colors';
import { GeolocationService } from '@distortion/app/services/geolocation.service';
import { StageGeojsonProperties } from '@distortion/app/interfaces/stage-geojson-properties';
import { MapLayer, MapSource } from '@distortion/app/interfaces/map-layer';
import { MapClickedFeature } from '@distortion/app/interfaces/map-clicked-feature';
import { MapIconViewModel } from '@distortion/app/interfaces/map-icon';
import { environment } from '@shared/environments';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Protocol, PMTiles } from "pmtiles";
import { getBucketAndPath } from '../shared/functions/storage';
import { SupabaseService } from '@blockparty/shared/data-access/supabase-service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private mapStateService = inject(MapStateService);
  private geolocationService = inject(GeolocationService);
  private supabase = inject(SupabaseService);

  private map: Map;
  private pmtilesProtocol = new Protocol();

  private addMapIcons$ = this.mapStateService.mapIcons$.pipe(
    // Add images to MapLibre map object
    tap((icons: MapIconViewModel[]) => {
      icons
        .filter((icon) => !!icon.image)
        .forEach((icon) => {
          if (this.map.hasImage(icon.name)) {
            this.map.removeImage(icon.name);
          }
          this.map.addImage(icon.name, icon.image);
        });
    }),
    catchError((err) => {
      console.error(err);
      return EMPTY;
    })
  );

  private addMapLayers$ = this.mapStateService.mapLayers$.pipe(
    tap((layers) => {
      // Add map sources
      layers.forEach(({ mapSource, geojson }) => {
        // Layer can be added twice since initial load from local storage
        if (this.map.getSource(mapSource)) {
          (this.map.getSource(mapSource) as any).setData(geojson);
          return;
        }

        this.map.addSource(mapSource as string, {
          type: 'geojson',
          data: geojson,
        });
      });

      // Layer can be added twice since initial load from local storage
      const layersAdded = (Object.values(MapLayer) as string[]).every(
        (layer) => {
          return this.map
            .getStyle()
            .layers.map((layer) => layer.id)
            .includes(layer);
        }
      );

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
        filter: ['==', 'id', '52c29de2-fdd7-4b2b-bad9-9c8e68cdf7a4'], // TODO: don't use hardcoded value
      });

      this.map.addLayer({
        id: MapLayer.Event,
        type: 'line',
        source: MapSource.Event,
        layout: {},
        paint: {
          'line-color': ['get', 'color'],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            1,
            17,
            5,
            21,
            14,
          ],
          'line-opacity': 0.8,
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
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            2,
            18,
            7,
            21,
            18,
          ],
        },
        filter: ['==', 'id', ''],
      });

      this.map.addLayer({
        id: MapLayer.StageHighlight,
        type: 'symbol',
        source: MapSource.Stage,
        layout: {
          'icon-image': 'pulsing-dot',
          'icon-allow-overlap': true,
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            11,
            0.01,
            16,
            0.2,
            18,
            1,
          ]
        },
        filter: ['==', 'id', ''],
      });

      this.map.addLayer({
        id: MapLayer.AssetHighlight,
        type: 'symbol',
        source: MapSource.Asset,

        layout: {
          'icon-image': 'pulsing-dot',
          'icon-allow-overlap': true,
          'icon-offset': [-4, 0],
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            11,
            0.01,
            16,
            0.2,
            18,
            0.5,
          ]
        },
        filter: ['==', 'id', ''],
      });

      this.map.addLayer({
        id: MapLayer.Asset,
        type: 'circle',
        source: MapSource.Asset,
        layout: {},
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            1,
            15,
            4,
            15.5,
            0,
          ],
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            1,
            15.5,
            0,
          ],
        },
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
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            16,
            0.3,
            20,
            1.1
          ],
          'icon-allow-overlap': true,
        },
      });

      this.map.addLayer({
        id: MapLayer.Stage,
        type: 'symbol',
        source: MapSource.Stage,
        minzoom: 11,
        layout: {
          'text-field': ['get', 'name'],
          'text-offset': [0, 0.5],
          'text-justify': 'auto',
          'text-transform': 'uppercase',
          'text-size': 11,
          'icon-image': ['get', 'icon'],
          'icon-anchor': 'bottom',
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            11,
            0.01,
            15,
            0.2,
            17,
            0.4,
            22,
            1,
          ],
          'icon-allow-overlap': true,
          'text-allow-overlap': true,
          'text-anchor': 'top',
        },
        paint: {
          'text-color': getCssVariable('--ion-text-color'),
          'text-halo-color': getCssVariable('--ion-background-color'),
          'text-halo-width': 3,
          'icon-halo-blur': 10,
          'icon-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0, 12, 1],
          'text-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            16.4,
            0,
            16.5,
            1,
          ],
        },
      });

    })
  );

  private addCustomBaseMap$ = this.mapStateService.mapTiles$.pipe(
    tap(tileLayers => {
      tileLayers.forEach(tileLayer => {
        const [bucket, path] = getBucketAndPath(tileLayer.storage_path);
        const url = this.supabase.publicImageUrl(bucket, path);

        const protocol = new PMTiles(`pmtiles://${url}`);
        this.pmtilesProtocol.add(protocol);

        if (!this.map.getSource(tileLayer.name)) {
          this.map.addSource(tileLayer.name, {
            type: 'vector',
            url: `pmtiles://${url}`
          });
        }


        (tileLayer.style as []).forEach((style: any) => {
          if (this.map.getLayer(style.id)) return;

          this.map.addLayer({
            ...style,
            source: tileLayer.name
          }, MapLayer.Asset)
        });
      })
    })
  )

  constructor() {
    this.mapStateService.mapLoaded$.pipe(
      filter(loaded => loaded),
      switchMap(() => concat(
        this.addMapIcons$,
        this.addMapLayers$.pipe(
          // This is not chained in concat, since addMapLayers$ not completing
          // hence this switchMap is used to trigger addCustomBaseMap$ after addMapLayers$ is done
          switchMap(() => this.addCustomBaseMap$)
        )
      )),
      takeUntilDestroyed()
    ).subscribe();
  }

  public initMap(): void {
    this.map = new Map({
      container: 'map-container',
      style: environment.maptilerStyleJson,
      center: environment.mapView.center as LngLatLike,
      zoom: environment.mapView.zoom,
      pitch: environment.mapView.pitch,
      attributionControl: false,
    });

    addProtocol("pmtiles", this.pmtilesProtocol.tile);


    this.addControls();

    this.map.on('load', () => {

      this.mapStateService.updateMapLoaded(true);

      this.map.resize();
      this.map.addImage('pulsing-dot', this.pulsingDot(this.map, 250), { pixelRatio: 2 });

      this.addAerial();

      // TODO: Remove this method when pmtiles basemap is tested and working
      // this.addCustomBaseMap();

      this.addClickBehaviourToLayer(MapLayer.Stage);
      this.addClickBehaviourToLayer(MapLayer.Asset);
      this.addClickBehaviourToLayer(MapLayer.AssetIcon);

      this.map.on('touchstart', () => {
        this.mapStateService.updateMapInteraction(true);
        this.removeFeatureHighlight(MapLayer.StageHighlight);
        this.removeFeatureHighlight(MapLayer.AssetHighlight);
      });
      this.map.on('touchend', () =>
        this.mapStateService.updateMapInteraction(false)
      );
    });

    this.map.once('idle', () => this.mapStateService.updateMapIdle(false));
  }

  private addControls(): void {
    this.map.addControl(new AttributionControl(), 'bottom-left');

    const geolocateControl = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showAccuracyCircle: false,
    });

    this.map.addControl(geolocateControl, 'bottom-right');

    geolocateControl.on('trackuserlocationstart', () => {
      // Request geolocation permission on IOS and Android
      // TODO clean up mix of promise and observable
      Promise.all([
        Device.getInfo(),
        this.geolocationService.checkPermissions().toPromise(),
      ]).then(([device, permission]) => {
        if (permission.location !== 'granted' && device.platform !== 'web') {
          this.geolocationService.requestPermissions().toPromise();
        }
      });
    });
  }

  private addClickBehaviourToLayer(mapLayer: MapLayer): void {
    this.map.on('click', mapLayer, (e) => {
      if (e.features.length === 0) return;

      const features: MapClickedFeature<any>[] = e.features.map((feature) => ({
        id: feature.properties.id,
        mapLayer,
        properties:
          mapLayer === MapLayer.Stage
            ? ({
              ...feature.properties,
              // MapLibre automaticly stringifies nested objects in geojson properties.
              // Since stages has timetables and tickets properties represented as objects,
              // these are parsed to get the back to original objects.
              timetables: JSON.parse(feature.properties.timetables),
              tickets: feature.properties.tickets
                ? JSON.parse(feature.properties.tickets)
                : null,
              tags: feature.properties.tags
                ? JSON.parse(feature.properties.tags)
                : null,
            } as StageGeojsonProperties)
            : feature.properties,
        geometry: feature.geometry as Point,
      }));

      switch (features[0].mapLayer) {
        case 'stage':
          this.highlightFeature(MapLayer.StageHighlight, features[0].id);
          break;
        case 'asset_geojson-icon':
          this.highlightFeature(MapLayer.AssetHighlight, features[0].id);
          break;
        default:
          break;
      }

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
    this.mapStateService.mapLoaded$
      .pipe(
        filter((mapLoaded) => mapLoaded),
        first(),
        tap(() => {
          this.map.flyTo({
            center,
            offset,
            zoom,
          });
        })
      )
      .subscribe();
  }

  public fitBounds(
    bounds: LngLatBoundsLike,
    padding: number = 10,
    offset: PointLike = [0, 0]
  ): void {
    this.mapStateService.mapLoaded$
      .pipe(
        filter((mapLoaded) => mapLoaded),
        first(),
        tap(() => {
          this.map.fitBounds(bounds, { padding, offset });
        })
      )
      .subscribe();
  }

  public resize(): void {
    this.map.resize();
  }

  public highlightFeature(
    layerName: MapLayer,
    id: string,
    autoRemove = false
  ): void {
    this.mapStateService.mapIdle$
      .pipe(
        filter((mapIdle) => !mapIdle),
        first(),
        tap(() => {
          this.map.setFilter(layerName, ['==', 'id', id]);

          if (autoRemove) {
            setTimeout(() => {
              this.removeFeatureHighlight(layerName);
            }, 5000);
          }
        })
      )
      .subscribe();
  }

  public removeFeatureHighlight(layerName: MapLayer): void {
    if (this.map.getLayer(layerName)) {
      this.map.setFilter(layerName, ['==', 'id', '']);
    }
  }

  public filterLayer(layer: MapLayer, property: string, values: string[]) {
    const filter: FilterSpecification = ['in', property, ...values];
    this.map.setFilter(layer, filter);
  }

  // TODO: Remove this method when pmtiles basemap is tested and working
  private addCustomBaseMap(): void {
    this.map.addSource('custom-base-map', {
      type: 'raster',
      tiles: [
        `https://api.maptiler.com/tiles/32951a70-ebdd-4640-a35b-b070263ab0ca/{z}/{x}/{y}.png?key=${environment.maptilerApiKey}`,
      ],
      tileSize: 256,
      minzoom: 14,
      bounds: [12.61504, 55.689367, 12.620842, 55.691206],
    });

    this.map.addLayer(
      {
        id: 'custom-base-map',
        type: 'raster',
        source: 'custom-base-map',
        paint: {
          'raster-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            14,
            0,
            15,
            0.9,
          ],
        },
        layout: {
          visibility: 'visible',
        },
        minzoom: 14,
      },
      'label_road'
    );
  }

  private addAerial(): void {
    this.map.addSource('aerial', {
      type: 'raster',
      tiles: [
        'https://services.datafordeler.dk/GeoDanmarkOrto/orto_foraar/1.0.0/WMS?username=DTMMBNXGMB&password=LvA$*001&VERSION=1.1.1&REQUEST=GetMap&BBOX={bbox-epsg-3857}&SRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=orto_foraar&STYLES=&FORMAT=image/jpeg',
      ],
      tileSize: 256,
    });

    this.map.addLayer(
      {
        id: 'aerial',
        type: 'raster',
        source: 'aerial',
        paint: {
          'raster-opacity': ['interpolate', ['linear'], ['zoom'], 15, 0, 16, 1],
        },
        layout: {
          visibility: 'visible',
        },
        minzoom: 14,
      },
      'label_road'
    );
  }

  private pulsingDot(map: Map, size: number, drawInnerCircle: boolean = false): StyleImageInterface {
    const self = this;
    return {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // get rendering context for the map canvas when layer is added to the map
      onAdd() {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d', { willReadFrequently: true });
      },

      // called once before every frame where the icon will be used
      render() {
        const duration = 2000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(255, 200, 200,${1 - t})`;
        context.fill();

        // draw inner circle
        if (drawInnerCircle) {
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
          );
          context.fillStyle = 'rgba(255, 100, 100, 1)';
          context.strokeStyle = 'white';
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();
        }

        // update this image's data with data from the canvas
        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
      }
    }
  };
}
