import { Event, EventType } from './database-entities';
import { Ticket } from './event';

interface EventTicket {
  name: Event['name'];
  tickets: Ticket[];
}

export interface EventsGroupedByType {
  name: EventType['name'];
  description: EventType['description'];
  color: EventType['color'];
  event: EventTicket[];
}
