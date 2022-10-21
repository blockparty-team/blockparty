import { Event } from "./database-entities"

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

export interface EventWithRelations extends Pick<Event, 'id' | 'name' | 'description' | 'storage_path'> {
    day_event: DayEvent[];
    stage: Stage[];
}

export interface EventViewModel extends Pick<Event, 'id' | 'name' | 'description' | 'storage_path'> {
    artists: Artist[];
    days: string[];
    imgUrl: string;
}