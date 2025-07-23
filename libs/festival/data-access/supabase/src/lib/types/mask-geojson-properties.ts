import { Tables } from './database-definitions';

export type MaskGeojsonProperties = Omit<Tables<'day_event_mask'>, 'geom'>;
