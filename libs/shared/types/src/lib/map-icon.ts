import { Tables } from './database-definitions';

export interface MapIconViewModel extends Tables<'map_icon'> {
  fileUrl: string | null;
  image: HTMLImageElement | null;
}
