import { Tables } from 'supabase';

export interface MapIconViewModel extends Tables<'map_icon'> {
  fileUrl: string | null;
  image: HTMLImageElement | null;
}
