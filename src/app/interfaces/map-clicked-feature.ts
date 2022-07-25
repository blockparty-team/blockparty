import { Point, Polygon } from 'geojson';
import { MapLayer } from './map-layer';
import { StageGeojsonProperties } from './stage-geojson-properties';
import { definitions } from './supabase';

export type GeojsonProperties =  StageGeojsonProperties | definitions['asset_geojson'];

export interface MapClickedFeature<T> {
    id: string;
    properties: T
    mapLayer: MapLayer;
    geometry: Point | Polygon;
};
