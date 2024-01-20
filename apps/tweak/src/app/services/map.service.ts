import { Injectable, effect, signal } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { apply } from 'ol-mapbox-style';
import { FeatureCollection } from 'geojson';
import { fromLonLat } from 'ol/proj';
import { Draw, Modify, Snap, Select } from 'ol/interaction.js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Geometry, { Type } from 'ol/geom/Geometry';
import { Subject } from 'rxjs';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import Feature from 'ol/Feature';

export enum MapSource {
  DayEventMask = 'day_event_mask',
  Event = 'event_geojson',
  Stage = 'stage_geojson',
  Asset = 'asset_geojson',
}

export type MapLayer =
  | 'day_event_mask'
  | 'event_geojson'
  | 'stage_geojson'
  | 'asset_geojson';

export type BaseMap = 'streets' | 'satelite';

export type Features = {
  [K in MapSource]: FeatureCollection;
};

@Injectable({ providedIn: 'root' })
export class MapService {
  private map!: Map;
  private draw!: Draw;
  private select!: Select;
  private modify!: Modify;

  private _mapLoaded = signal<boolean>(false);
  public readonly mapLoaded = this._mapLoaded.asReadonly();

  private _selectedFeature = signal<Feature<Geometry> | null>(null);
  public readonly selectedFeature = this._selectedFeature.asReadonly();

  private currentBaseMap = signal<BaseMap>('satelite');

  private _drawingFinished$ = new Subject<any>();
  public drawingFinished$ = this._drawingFinished$.asObservable();

  private mapTilerKey = 'IFNEgQuIP7z1PzGMheNY';

  constructor() {
    effect(() => {
      this.map.removeLayer(this.map.getLayers().getArray()[0]);
      this.currentBaseMap() === 'satelite'
        ? apply(this.map, this.baseMapUrl('satelite'))
        : apply(this.map, this.baseMapUrl('streets'));
    });
  }

  initMap(targetElement: string) {
    this.map = new Map({
      target: targetElement,
      view: new View({
        center: fromLonLat([12.57632, 55.68215]),
        zoom: 12,
      }),
      controls: [],
    });

    this.map.on('loadend', () => {
      this._mapLoaded.set(true);
    });
  }

  addGeoJSON(geojson: FeatureCollection, layerName: MapLayer): void {
    const vectorSource = new VectorSource({
      features: new GeoJSON({ featureProjection: 'EPSG:4326' }).readFeatures(
        geojson,
        { featureProjection: 'EPSG:3857' }
      ),
    }) as VectorSource<Feature<Geometry>>;

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      properties: { name: layerName },
      style: new Style({
        stroke: new Stroke({
          color: 'blue',
          lineDash: [4],
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
    });

    this.map.addLayer(vectorLayer);

    // this.modify = new Modify({ source: vectorSource });
    // this.map.addInteraction(this.modify);

    this.select = new Select({
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: 'rgba(255, 255, 255, 0.7)',
          width: 2,
        }),
      }),
    });

    this.select.on('select', (e) => {
      this._selectedFeature.set(e.selected[0]);
      // console.log(e.selected[0].getProperties());
    });

    this.map.addInteraction(this.select);
  }

  //--------------------------------
  // DRAWING
  //--------------------------------
  startDrawing(geometryType: Type): void {
    this.map.removeInteraction(this.select);

    const drawSource = new VectorSource({ wrapX: false });

    const drawLayer = new VectorLayer({
      source: drawSource,
      properties: { name: 'draw' },
    });

    this.map.addLayer(drawLayer);

    this.modify = new Modify({ source: drawSource });
    this.map.addInteraction(this.modify);

    this.draw = new Draw({
      source: drawSource,
      type: geometryType,
    });

    this.map.addInteraction(this.draw);

    this.draw.on('drawend', (e) => {
      const geojsonFormat = new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });
      const geojson = geojsonFormat.writeFeaturesObject([e.feature]);
      this._drawingFinished$.next(geojson.features[0]);

      this.map.removeInteraction(this.draw);
      this.map.removeInteraction(this.modify);
      this.map.removeInteraction(this.select);
    });
  }

  stopDrawing(): void {
    this.draw.finishDrawing();
  }

  removeLastDrawPoint(): void {
    this.draw.removeLastPoint();
  }

  toggleBaseMap() {
    this.currentBaseMap.update((basemap) =>
      basemap === 'satelite' ? 'streets' : 'satelite'
    );
  }

  private baseMapUrl(baseMap: BaseMap) {
    const sateliteId = 'a6169730-0cb8-462b-b6df-4e612b23cd91';
    const streetsId = '62517ef6-259e-4ecc-a9df-6b330f8b5092';

    const mapId = baseMap === 'satelite' ? sateliteId : streetsId;
    return `https://api.maptiler.com/maps/${mapId}/style.json?key=${this.mapTilerKey}`;
  }
}
