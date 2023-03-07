import { Point, Feature } from "geojson";
import { EntityDistanceSearch, EntityTextSearch } from "./database-entities";
import { ArtistViewModel } from "./artist";
import { EventViewModel } from "./event";
import { StageGeojsonProperties } from "./stage-geojson-properties";
import { AssetGeojsonProperties } from "./asset-geojson-properties";

export interface EntityFreeTextSearchResult extends Omit<EntityTextSearch, 'ts'> {
    rank: number;
    similarity: number;
    artist?: ArtistViewModel;
    event?: EventViewModel;
    stage?: Feature<Point, StageGeojsonProperties>;
    asset?: Feature<Point, AssetGeojsonProperties>;
}

export interface EntityDistanceSearchResult extends Pick<EntityDistanceSearch, 'entity' | 'id' | 'name'> {
    distance: number,
    geom: Point
}
