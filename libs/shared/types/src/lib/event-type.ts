import { Tables } from '@blockparty/distortion/data-access/supabase';
import { Ticket } from './event';

interface EventTicket {
  name: Tables<'event'>['name'];
  tickets: Ticket[];
}

export interface EventsGroupedByType {
  name: Tables<'event_type'>['name'];
  description: Tables<'event_type'>['description'];
  color: Tables<'event_type'>['color'];
  event: EventTicket[];
}
