import { Day, Event, EventType } from './database-entities';

export interface PartialEvent {
    id: Event['id'];
    name: Event['name'];
    bounds: Event['bounds'];
    event_type: {
        color: EventType['color'];
    };
}

export interface DayEvent {
    id: Day['id'];
    day: Day['day'];
    name: Day['name'];
    event: PartialEvent[];
}
