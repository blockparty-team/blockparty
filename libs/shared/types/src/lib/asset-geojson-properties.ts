import { Tables } from '@shared/types';

export interface AssetGeojsonProperties extends Omit<Tables<'asset_geojson'>, 'geom'> {
  imgUrl?: string;
}
