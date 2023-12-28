import { Tables } from '@shared/data-access/supabase';

export type MaskGeojsonProperties = Omit<Tables<'day_event_mask'>, 'geom'>;
