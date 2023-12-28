import { Point, Feature } from 'geojson';
import { ArtistViewModel } from './artist';
import { EventViewModel } from './event';
import { StageGeojsonProperties } from './stage-geojson-properties';
import { AssetGeojsonProperties } from './asset-geojson-properties';
import { Tables } from 'supabase';

export interface EntityFreeTextSearchResult
  extends Omit<Tables<'entity_text_search'>, 'ts'> {
  rank: number;
  similarity: number;
  artist?: ArtistViewModel;
  event?: EventViewModel;
  stage?: Feature<Point, StageGeojsonProperties>;
  asset?: Feature<Point, AssetGeojsonProperties>;
}

export interface EntityDistanceSearchResult
  extends Pick<Tables<'entity_distance_search'>, 'entity' | 'id' | 'name'> {
  distance: number;
  geom: Point;
}
