import { Event } from "./database-entities"

type PartialEvent = Pick<Event, 'id' | 'name' | 'description' | 'storage_path' | 'bounds'>;

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

export interface EventWithRelations extends PartialEvent {
    day_event: DayEvent[];
    stage: Stage[];
}

export interface EventViewModel extends PartialEvent {
    artists: Artist[];
    days: string[];
    imgUrl: string;
}