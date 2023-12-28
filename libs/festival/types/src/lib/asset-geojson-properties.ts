import { Tables } from 'supabase';

export interface AssetGeojsonProperties extends Omit<Tables<'asset_geojson'>, 'geom'> {
  imgUrl?: string;
}
