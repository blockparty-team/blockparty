import { Tables } from '@shared/types';

export interface PartialEventType {
  id: Tables<'event_type'>['id'];
  name: Tables<'event_type'>['name'];
  color: Tables<'event_type'>['color'];
}

export interface PartialEvent {
  id: Tables<'event'>['id'];
  name: Tables<'event'>['name'];
  bounds: Tables<'event'>['bounds'];
  event_type: PartialEventType;
}

export interface DayEvent {
  id: string;
  day: string;
  name: string;
  event: PartialEvent[];
}
