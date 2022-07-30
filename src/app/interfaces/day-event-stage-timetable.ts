export interface Timetable {
    end_time: Date;
    artist_id: string;
    start_time: Date;
    artist_name: string;
}

export interface StageTimetable {
    stage_name: string;
    timetable: Timetable[];
    last_end_time: Date;
    first_start_time: Date;
}

export interface EventTimetable {
    stages: StageTimetable[];
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
    events: EventTimetable[];
}

// View Models for Timetable grid
export interface TimetbaleViewModel extends Timetable  {
    columnStart: number;
    columnEnd: number;
    // rowStart: number;
}

export interface StageTimetableViewModel  {
    stageName: StageTimetable['stage_name'];
    timetable: TimetbaleViewModel[];
}

export interface EventTimetableViewModel  {
    eventId: EventTimetable['event_id'];
    eventName: EventTimetable['event_name'];
    stages: StageTimetableViewModel[];
}

export interface DayTimetableViewModel  {
    dayId: DayEventStageTimetable['id'];
    dayName: DayEventStageTimetable['name'];
    events: EventTimetableViewModel[];
}