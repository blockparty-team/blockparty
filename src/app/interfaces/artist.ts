import { Database } from './database-definitions'

type Artist = Database['public']['Tables']['artist']['Row'];
type Day = Database['public']['Tables']['day']['Row'];
type Timetbl = Database['public']['Tables']['timetable']['Row'];
type Stage = Database['public']['Tables']['stage']['Row'];

interface Timetable {
    day: {
        name: Day['name'];
        day: Day['day']
    };
    start_time: Timetbl['start_time'];
    end_time: Timetbl['end_time'];
    stage: {
        name: Stage['name'];
        geom: Stage['geom'];
    };
}

export interface ArtistWithRelations extends Partial<Artist> {
    timetable: Timetable[];
};
