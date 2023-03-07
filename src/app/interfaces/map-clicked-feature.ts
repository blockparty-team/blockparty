import { Point } from 'geojson';
import { MapLayer } from './map-layer';
import { StageGeojsonProperties } from './stage-geojson-properties';
import { AssetGeojsonProperties } from './asset-geojson-properties';

export type GeojsonProperties = StageGeojsonProperties | AssetGeojsonProperties;

export interface MapClickedFeature<T> {
    id: string;
    properties: T
    mapLayer: MapLayer;
    geometry: Point;
};
