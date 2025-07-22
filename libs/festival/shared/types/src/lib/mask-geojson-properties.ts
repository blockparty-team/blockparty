import { Tables } from '@blockparty/festival/data-access/supabase';

export type MaskGeojsonProperties = Omit<Tables<'day_event_mask'>, 'geom'>;
