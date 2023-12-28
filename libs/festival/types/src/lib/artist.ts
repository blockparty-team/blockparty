import { Tables } from '@shared/data-access/supabase';

interface Timetable {
  day: {
    name: Tables<'day'>['name'];
    day: Tables<'day'>['day'];
  };
  start_time: Tables<'timetable'>['start_time'];
  end_time: Tables<'timetable'>['end_time'];
  stage: {
    name: Tables<'stage'>['name'];
    geom: Tables<'stage'>['geom'];
    event: {
      name: Tables<'event'>['name'];
    };
  };
}

export interface ArtistFavorite {
  artistId: string;
  isFavorite: boolean;
}

export interface ArtistViewModel extends Partial<Tables<'artist'>> {
  timetable: Timetable[];
  isFavorite: boolean;
  imgUrl: string;
  srcset: string;
}
