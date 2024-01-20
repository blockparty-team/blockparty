import { Injectable } from '@angular/core';
import {
  MapLibreGL,
  Map,
  AttributionControl,
  GeolocateControl,
} from 'maplibre-gl';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import {
  TerraDraw,
  TerraDrawMapLibreGLAdapter,
  TerraDrawSelectMode,
  TerraDrawPolygonMode,
  GeoJSONStoreFeatures,
} from 'terra-draw';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class MapService {
  private map: Map | undefined;
  private draw: TerraDraw | undefined;

  private _drawingFinished$ = new Subject<GeoJSONStoreFeatures>();
  public drawingFinished$ = this._drawingFinished$.asObservable();

  private _mapLoaded$ = new BehaviorSubject<boolean>(false);
  mapLoaded$: Observable<boolean> = this._mapLoaded$.asObservable();

  public initMap(container: string): void {
    this.map = new Map({
      container,
      style:
        'https://api.maptiler.com/maps/62517ef6-259e-4ecc-a9df-6b330f8b5092/style.json?key=IFNEgQuIP7z1PzGMheNY',
      center: [12.57632, 55.68215],
      zoom: 11.5,
      attributionControl: false,
    });

    this.addControls(this.map);

    this.map.on('load', () => {
      this._mapLoaded$.next(true);
      if (!this.map) throw new Error('Map not initializes.');

      //   this.mapStateService.updateMapLoaded(true);

      this.map.resize();

      //   this.addAerial();
      //   this.addCustomBaseMap();
      //   this.addMapData();

      //   this.addClickBehaviourToLayer(MapLayer.Stage);
      //   this.addClickBehaviourToLayer(MapLayer.Asset);
      //   this.addClickBehaviourToLayer(MapLayer.AssetIcon);

      //   this.map.on('touchstart', () => this.mapStateService.updateMapInteraction(true));
      //   this.map.on('touchend', () => this.mapStateService.updateMapInteraction(false));
      this.draw = this.initDrawing(this.map);

      this.draw.on('finish', () => {
        if (!this.draw) throw new Error('Draw not initialized.');
        this._drawingFinished$.next(this.draw.getSnapshot()[0]);
        this.draw.setMode('select');
        console.log(this.map?.getStyle().layers);
      });
    });

    // this.map.once('idle', () => this.mapStateService.updateMapIdle(false));
  }

  initDrawing(map: Map): TerraDraw {
    return new TerraDraw({
      adapter: new TerraDrawMapLibreGLAdapter({
        map,
        coordinatePrecision: 9,
      }),
      modes: [
        new TerraDrawSelectMode({
          flags: {
            polygon: {
              feature: {
                // scaleable: true,
                // rotateable: true,
                // draggable: true,
                coordinates: {
                  midpoints: true,
                  draggable: true,
                  deletable: true,
                },
              },
            },
          },
        }),
        new TerraDrawPolygonMode({
          allowSelfIntersections: false,
          pointerDistance: 30,
        }),
      ],
    });
  }

  public startDrawing(features?: GeoJSONStoreFeatures[]): void {
    if (!this.draw) throw new Error('Draw not initialized.');

    this.draw.start();
    this.draw.setMode('polygon');

    if (features) {
      this.draw.addFeatures(features);
    }
  }

  public addDrawFeatures(features: GeoJSONStoreFeatures[]) {
    if (!this.draw) throw new Error('Draw not initialized.');

    this.draw.addFeatures(features);
  }

  public resize(): void {
    if (!this.map) throw new Error('Map not initialized.');

    this.map.resize();
  }

  private addControls(map: Map): void {
    map.addControl(new AttributionControl(), 'bottom-left');

    const geolocateControl = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showAccuracyCircle: false,
    });

    map.addControl(geolocateControl, 'bottom-right');

    geolocateControl.on('trackuserlocationstart', () => {
      // Request geolocation permission on IOS and Android
      // TODO clean up mix of promise and observable
      Promise.all([Device.getInfo(), Geolocation.checkPermissions()]).then(
        ([device, permission]) => {
          if (permission.location !== 'granted' && device.platform !== 'web') {
            Geolocation.requestPermissions();
          }
        }
      );
    });
  }
}
