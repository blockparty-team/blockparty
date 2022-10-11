import { Artist, Day, Stage, Timetable as TimetableType } from './database-entities'

interface Timetable {
    day: {
        name: Day['name'];
        day: Day['day']
    };
    start_time: TimetableType['start_time'];
    end_time: TimetableType['end_time'];
    stage: {
        name: Stage['name'];
        geom: Stage['geom'];
    };
}

export interface ArtistWithRelations extends Partial<Artist> {
    timetable: Timetable[];
};
