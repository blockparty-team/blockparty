/* eslint-disable @typescript-eslint/naming-convention */
import { definitions } from './supabase';

export interface TimetableWithRelations {
    id: definitions['timetable']['id'];
    start_time: definitions['timetable']['start_time'];
    end_time: definitions['timetable']['end_time'];
    artist: definitions['artist'];
}

export interface StageWithRelations {
    id: definitions['stage']['id'];
    name: definitions['stage']['name'];
    description: definitions['stage']['description'];
    timetable: TimetableWithRelations[];
}

export interface EventWithRelations {
    id: definitions['event']['id'];
    name: definitions['event']['name'];
    description: definitions['event']['description'];
    bounds: definitions['event']['bounds'];
    stage: StageWithRelations[];
}

export interface DayWithRelations {
    id: definitions['day']['id'];
    day: definitions['day']['day'];
    name: definitions['day']['name'];
    description: definitions['day']['description'];
    event: EventWithRelations[];
}
