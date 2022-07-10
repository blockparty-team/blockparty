import { Feature, Geometry, LineString, Point, Polygon } from 'geojson';
import { MapLayer } from './map-layer';

export interface MapClickedFeature {
    id: string;
    layerName: MapLayer;
    geometry: Point | Polygon | LineString;
};
