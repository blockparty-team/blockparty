import { Tables } from "@blockparty/distortion/data-access/supabase";

export interface AssetGeojsonProperties extends Omit<Tables<'asset_geojson'>, 'geom'> {
  imgUrl?: string;
}
