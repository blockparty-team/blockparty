import { Tables } from '@shared/types';

export type MaskGeojsonProperties = Omit<Tables<'day_event_mask'>, 'geom'>;
