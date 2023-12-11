import { DayEventMask } from './database-entities';

export type MaskGeojsonProperties = Omit<DayEventMask, 'geom'>;
