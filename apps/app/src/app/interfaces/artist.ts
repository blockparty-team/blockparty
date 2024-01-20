import {
  Artist,
  Day,
  Stage,
  Event,
  Timetable as TimetableType,
} from './database-entities';

interface Timetable {
  day: {
    name: Day['name'];
    day: Day['day'];
  };
  start_time: TimetableType['start_time'];
  end_time: TimetableType['end_time'];
  stage: {
    name: Stage['name'];
    geom: Stage['geom'];
    event: {
      name: Event['name'];
    };
  };
}

export interface ArtistFavorite {
  artistId: string;
  isFavorite: boolean;
}

export interface ArtistViewModel extends Partial<Artist> {
  timetable: Timetable[];
  isFavorite: boolean;
  imgUrl: string;
  srcset: string;
}
