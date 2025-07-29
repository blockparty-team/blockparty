import { Event, EventType } from './database-entities';

export interface PartialEventType {
  id: EventType['id'];
  name: EventType['name'];
  color: EventType['color'];
  rank: EventType['rank'];
}

export interface PartialEvent {
  id: Event['id'];
  name: Event['name'];
  bounds: Event['bounds'];
  rank: Event['rank'];
  event_type: PartialEventType;
}

export interface DayEvent {
  id: string;
  day: string;
  name: string;
  event: PartialEvent[];
}
