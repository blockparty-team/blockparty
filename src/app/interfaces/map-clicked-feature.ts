import { Feature, Geometry, LineString, Point, Polygon } from 'geojson';
import { MapLayer } from './map-layer';
import { definitions } from './supabase';

export interface MapClickedFeature {
    id: string;
    properties: Partial<definitions['asset_geojson'] | definitions['stage_geojson']>
    mapLayer: MapLayer;
    geometry: Point | Polygon | LineString;
};
