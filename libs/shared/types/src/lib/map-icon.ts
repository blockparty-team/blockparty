import { Tables } from '@blockparty/distortion/data-access/supabase';

export interface MapIconViewModel extends Tables<'map_icon'> {
  fileUrl: string | null;
  image: HTMLImageElement | null;
}
