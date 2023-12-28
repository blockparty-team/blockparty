import { Tables } from 'supabase';

type PartialEvent = Pick<
  Tables<'event'>,
  'id' | 'name' | 'description' | 'storage_path' | 'bounds'
>;
type PartialEventType = Pick<
  Tables<'event_type'>,
  'id' | 'name' | 'color' | 'description'
>;

interface Day {
  name: string;
}

interface DayEvent {
  day: Day;
}

interface Artist {
  name: string;
  id: string;
}

interface Timetable {
  artist: Artist;
}

interface Stage {
  timetable: Timetable[];
}

export interface Ticket {
  name: string;
  url: string;
}

export interface EventWithRelations extends PartialEvent {
  day_event: DayEvent[];
  stage: Stage[];
  event_type: PartialEventType;
}

export interface EventViewModel extends PartialEvent {
  artists: Artist[];
  days: string[];
  imgUrl: string;
  srcset: string;
  event_type: PartialEventType;
  tickets: Ticket[];
}
