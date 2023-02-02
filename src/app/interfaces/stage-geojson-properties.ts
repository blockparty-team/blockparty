import { Artist, Day as DayType, Event, Icon, Stage, Timetable as TimetableType } from "./database-entities";

export interface Day {
    id: DayType['id'];
    name: DayType['name'];
    date: DayType['day'];
}

export interface Timetable {
    start_time: TimetableType['start_time'];
    end_time: TimetableType['end_time'];
    name: Artist['name'];
    artist_id: Artist['id'];
}

export interface TimetableDay {
    day: Day;
    timetable: Timetable[];
}

export interface StageGeojsonProperties {
    id: Stage['id'];
    description: Stage['description'];
    name: Stage['name'];
    icon: Icon['name'];
    ticket_url: Event['ticket_url'];
    timetables: TimetableDay[];
}

