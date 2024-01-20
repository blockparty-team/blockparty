import { Tables } from "./database-definitions";

export interface AssetGeojsonProperties extends Omit<Tables<'asset_geojson'>, 'geom'> {
  imgUrl?: string;
}
