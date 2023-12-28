import { AssetGeojson } from '@/supabase';

export interface AssetGeojsonProperties extends Omit<AssetGeojson, 'geom'> {
  imgUrl?: string;
}
