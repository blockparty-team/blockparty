import { Day, Event } from './database-entities';

export type PartialEvent = Pick<Event, 'id' | 'name' | 'bounds'>

export interface DayEvent {
    id: Day['id'];
    day: Day['day'];
    name: Day['name'];
    event: PartialEvent[];
}
