import { Tables } from 'supabase';

export type MaskGeojsonProperties = Omit<Tables<'day_event_mask'>, 'geom'>;
