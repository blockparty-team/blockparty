import { Database } from '@blockparty/shared/data-access/supabase';

// Select Tables
export type Day = Database['public']['Tables']['day']['Row'];
export type Event = Database['public']['Tables']['event']['Row'];
export type EventType = Database['public']['Tables']['event_type']['Row'];
export type DayEvent = Database['public']['Tables']['day_event']['Row'];
export type Stage = Database['public']['Tables']['stage']['Row'];
export type Timetable = Database['public']['Tables']['timetable']['Row'];
export type Artist = Database['public']['Tables']['artist']['Row'];
export type Icon = Database['public']['Tables']['icon']['Row'];
export type AssetType = Database['public']['Tables']['asset_type']['Row'];
export type Asset = Database['public']['Tables']['asset']['Row'];
export type Profile = Database['public']['Tables']['profile']['Row'];
export type Favorite = Database['public']['Tables']['favorite']['Row'];

// Insert Table
export type DayInsert = Database['public']['Tables']['day']['Insert'];
export type EventInsert = Database['public']['Tables']['event']['Insert'];

// Views
export type AssetGeojson = Database['public']['Views']['asset_geojson']['Row'];
export type StageGeojson = Database['public']['Views']['stage_geojson']['Row'];
export type DayEventMask = Database['public']['Views']['day_event_mask']['Row'];
export type EntityTextSearch =
  Database['public']['Views']['entity_text_search']['Row'];
export type EntityDistanceSearch =
  Database['public']['Views']['entity_distance_search']['Row'];
export type DayEventStageTimetable =
  Database['public']['Views']['day_event_stage_timetable']['Row'];
export type MapIcon = Database['public']['Views']['map_icon']['Row'];

// Enums
export type FavoriteEntity = Database['public']['Enums']['favorite_entity'];
export type TextSearchEntity =
  Database['public']['Enums']['text_search_entity'];
