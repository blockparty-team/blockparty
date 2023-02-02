import { Event, EventType } from "./database-entities"

interface EventTicket {
    name: Event['name'];
    ticket_url: Event['ticket_url'];
}

export interface EventsGroupedByType {
    name: EventType['name'];
    description: EventType['description'];
    color: EventType['color'];
    event: EventTicket[];
}