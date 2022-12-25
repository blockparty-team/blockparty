import { Point } from "geojson";
import { ArtistViewModel } from "./artist";
import { EntityDistanceSearch, EntityTextSearch } from "./database-entities";

export interface EntityFreeTextSearchResult extends Omit<EntityTextSearch, 'ts'> {
    rank: number;
    similarity: number;
    artist?: ArtistViewModel 
}

export interface EntityDistanceSearchResult extends Pick<EntityDistanceSearch, 'entity' | 'id' | 'name'> {
    distance: number,
    geom: Point
}
