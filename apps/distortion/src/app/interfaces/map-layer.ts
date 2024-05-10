import { FeatureCollection, LineString, Point, Polygon } from 'geojson';

// Table or view names for DB entities with geometries
export enum MapSource {
  DayEventMask = 'day_event_mask',
  Event = 'event_geojson',
  Stage = 'stage_geojson',
  Asset = 'asset_geojson',
}

export enum MapLayer {
  DayEventMask = 'day_event_mask',
  Event = 'event',
  EventHighLight = 'event-highlight',
  Stage = 'stage',
  StageHighlight = 'stage-highlight',
  Asset = 'asset_geojson',
  AssetIcon = 'asset_geojson-icon',
  AssetHighlight = 'asset-highlight',
}

export enum StageLayer {
  Stage = 'stage',
  StageHighlight = 'stage-highlight',
}

export enum AssetLayer {
  Asset = 'asset',
  AssetIcon = 'asset-icon',
}

export enum Event {
  Event = 'event',
  EventHighLight = 'event-highlight',
}

export enum DayEventMask {
  DayEventMask = 'day-event-mask',
}

export interface MapSourceGeojson<T> {
  mapSource: MapSource;
  geojson: FeatureCollection<Point | LineString | Polygon, T>;
}
