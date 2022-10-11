import { Point, Polygon } from 'geojson';
import { AssetGeojson } from './database-entities';
import { MapLayer } from './map-layer';
import { StageGeojsonProperties } from './stage-geojson-properties';

export type GeojsonProperties =  StageGeojsonProperties | AssetGeojson;

export interface MapClickedFeature<T> {
    id: string;
    properties: T
    mapLayer: MapLayer;
    geometry: Point | Polygon;
};
