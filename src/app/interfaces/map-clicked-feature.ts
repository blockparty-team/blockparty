import { Point } from 'geojson';
import { MapLayer } from './map-layer';
import { StageGeojsonProperties } from './stage-geojson-properties';
import { AssetGeojsonProperties } from './asset-geojson-properties';
import { MaskGeojsonProperties } from './mask-geojson-properties';

export type GeojsonProperties = StageGeojsonProperties | AssetGeojsonProperties | MaskGeojsonProperties;

export interface MapClickedFeature<T> {
    id: string;
    properties: T
    mapLayer: MapLayer;
    geometry: Point;
};
