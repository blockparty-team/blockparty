import { AssetGeojson } from './database-entities';

export interface AssetGeojsonProperties extends Omit<AssetGeojson, 'geom'> {
  imgUrl?: string;
}
