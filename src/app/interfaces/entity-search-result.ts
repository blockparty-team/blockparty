import { ArtistWithRelations } from "./artist";
import { definitions } from "./supabase";

export interface EntitySearchResult extends Pick<definitions['entity_text_search'], 'entity' | 'id' | 'name' | 'description'> {
    rank: number;
    similarity: number;
    artist?: ArtistWithRelations 
}