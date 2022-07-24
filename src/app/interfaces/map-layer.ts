// Table or view names for DB entities with geometries
export enum MapSource {
    DayEventMask = 'day_event_mask',
    Event = 'event',
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

export const mapSourceLayer = {
    'day_event_mask': DayEventMask,
    'stage': StageLayer,
    'event': Event,
    'asset_geojson': AssetLayer
}

// export type MapSource = keyof typeof mapSourceLayer

// export type MapLayer = typeof mapSourceLayer[keyof typeof mapSourceLayer];

// const ts = 