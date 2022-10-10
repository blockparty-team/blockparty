import { Day, Artist, Stage, Timetable, Event } from './database-entities';

export interface TimetableWithRelations {
    id: Timetable['id'];
    day_id: Timetable['day_id'];
    start_time: Timetable['start_time'];
    end_time: Timetable['end_time'];
    artist: Artist;
}

export interface StageWithRelations {
    id: Stage['id'];
    name: Stage['name'];
    description: Stage['description'];
    timetable: TimetableWithRelations[];
}

export interface EventWithRelations {
    id: Event['id'];
    name: Event['name'];
    description: Event['description'];
    bounds: Event['bounds'];
    stage: StageWithRelations[];
}

export interface DayWithRelations {
    id: Day['id'];
    day: Day['day'];
    name: Day['name'];
    description: Day['description'];
    event: EventWithRelations[];
}
