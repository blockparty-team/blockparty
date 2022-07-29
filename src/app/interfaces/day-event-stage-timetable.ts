export interface Timetable {
    end_time: Date;
    artist_id: string;
    start_time: Date;
    artist_name: string;
}

export interface StageTimetables {
    stage_name: string;
    timetables: Timetable[];
    last_end_time: Date;
    first_start_time: Date;
}

export interface EventTimetables {
    stages: StageTimetables[];
    event_id: string;
    event_name: string;
    last_end_time: Date;
    first_start_time: Date;
}

export interface DayEventStageTimetable {
    id: string;
    name: string;
    first_start_time: Date;
    last_end_time: Date;
    events: EventTimetables[];
}