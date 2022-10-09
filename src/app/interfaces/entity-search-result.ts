import { Point } from "geojson";
import { ArtistWithRelations } from "./artist";
import { definitions } from "./supabase-old";

export interface EntityFreeTextSearchResult extends Pick<definitions['entity_text_search'], 'entity' | 'id' | 'name' | 'description'> {
    rank: number;
    similarity: number;
    artist?: ArtistWithRelations 
}

export interface EntityDistanceSearchResult extends Pick<definitions['entity_distance_search'], 'entity' | 'id' | 'name'> {
    distance: number,
    geom: Point
}
