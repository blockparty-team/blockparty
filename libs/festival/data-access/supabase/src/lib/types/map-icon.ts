import { MapIcon } from './database-entities';

export interface MapIconViewModel extends MapIcon {
  fileUrl: string | null;
  image: HTMLImageElement | null;
}
