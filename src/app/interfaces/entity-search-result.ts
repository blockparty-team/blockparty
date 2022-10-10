import { Point } from "geojson";
import { ArtistWithRelations } from "./artist";
import { EntityDistanceSearch, EntityTextSearch } from "./database-entities";

export interface EntityFreeTextSearchResult extends Omit<EntityTextSearch, 'ts'> {
    rank: number;
    similarity: number;
    artist?: ArtistWithRelations 
}

export interface EntityDistanceSearchResult extends Pick<EntityDistanceSearch, 'entity' | 'id' | 'name'> {
    distance: number,
    geom: Point
}
