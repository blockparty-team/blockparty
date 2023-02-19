import { Point, Feature } from "geojson";
import { AssetGeojson, EntityDistanceSearch, EntityTextSearch } from "./database-entities";
import { ArtistViewModel } from "./artist";
import { EventViewModel } from "./event";
import { StageGeojsonProperties } from "./stage-geojson-properties";

export interface EntityFreeTextSearchResult extends Omit<EntityTextSearch, 'ts'> {
    rank: number;
    similarity: number;
    artist?: ArtistViewModel;
    event?: EventViewModel;
    stage?: Feature<Point, StageGeojsonProperties>;
    asset?: Feature<Point, AssetGeojson>;
}

export interface EntityDistanceSearchResult extends Pick<EntityDistanceSearch, 'entity' | 'id' | 'name'> {
    distance: number,
    geom: Point
}
