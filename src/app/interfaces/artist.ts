/* eslint-disable @typescript-eslint/naming-convention */
import { definitions } from './supabase';

interface Timetable {
    day: {
        name: definitions['day']['name'];
        day: definitions['day']['day']
    };
    start_time: definitions['timetable']['start_time'];
    end_time: definitions['timetable']['end_time'];
    stage: {
        name: definitions['stage']['name'];
        geom: definitions['stage']['geom'];
    };
}

export interface ArtistWithRelations extends Partial<definitions['artist']> {
    timetable: Timetable[];
};
