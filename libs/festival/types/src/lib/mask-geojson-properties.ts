import { Tables } from '@blockparty/distortion/data-access/supabase';

export type MaskGeojsonProperties = Omit<Tables<'day_event_mask'>, 'geom'>;
