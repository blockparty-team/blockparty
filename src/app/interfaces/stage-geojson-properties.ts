import { definitions } from "./supabase-old";

export interface Day {
    id: definitions['day']['id'];
    name: definitions['day']['name'];
    date: definitions['day']['day'];
}

export interface Timetable {
    start_time: definitions['timetable']['start_time'];
    end_time: definitions['timetable']['end_time'];
    name: definitions['artist']['name'];
    artist_id: definitions['artist']['id'];
}

export interface TimetableDay {
    day: Day;
    timetable: Timetable[];
}

export interface StageGeojsonProperties {
    id: definitions['stage']['id'];
    name: definitions['stage']['name'];
    icon: definitions['icon']['name'];
    timetables: TimetableDay[];

}

