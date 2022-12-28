export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artist: {
        Row: {
          id: string
          name: string
          description: string | null
          storage_path: string | null
          bandcamp: string | null
          spotify: string | null
          tidal: string | null
          apple_music: string | null
          soundcloud: string | null
          youtube: string | null
          instagram: string | null
          facebook: string | null
          webpage: string | null
          bandcamp_iframe: string | null
          inserted_at: string
          public: boolean | null
          ts: unknown | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          storage_path?: string | null
          bandcamp?: string | null
          spotify?: string | null
          tidal?: string | null
          apple_music?: string | null
          soundcloud?: string | null
          youtube?: string | null
          instagram?: string | null
          facebook?: string | null
          webpage?: string | null
          bandcamp_iframe?: string | null
          inserted_at?: string
          public?: boolean | null
          ts?: unknown | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          storage_path?: string | null
          bandcamp?: string | null
          spotify?: string | null
          tidal?: string | null
          apple_music?: string | null
          soundcloud?: string | null
          youtube?: string | null
          instagram?: string | null
          facebook?: string | null
          webpage?: string | null
          bandcamp_iframe?: string | null
          inserted_at?: string
          public?: boolean | null
          ts?: unknown | null
        }
      }
      asset: {
        Row: {
          id: string
          description: string | null
          geom: unknown | null
          asset_type_id: string
          icon_id: string | null
          event_id: string
          inserted_at: string
          public: boolean | null
        }
        Insert: {
          id?: string
          description?: string | null
          geom?: unknown | null
          asset_type_id: string
          icon_id?: string | null
          event_id: string
          inserted_at?: string
          public?: boolean | null
        }
        Update: {
          id?: string
          description?: string | null
          geom?: unknown | null
          asset_type_id?: string
          icon_id?: string | null
          event_id?: string
          inserted_at?: string
          public?: boolean | null
        }
      }
      asset_type: {
        Row: {
          id: string
          name: string
          description: string | null
          inserted_at: string
          public: boolean | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          inserted_at?: string
          public?: boolean | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          inserted_at?: string
          public?: boolean | null
        }
      }
      day: {
        Row: {
          id: string
          day: string
          name: string | null
          description: string | null
          inserted_at: string
          public: boolean | null
        }
        Insert: {
          id?: string
          day: string
          name?: string | null
          description?: string | null
          inserted_at?: string
          public?: boolean | null
        }
        Update: {
          id?: string
          day?: string
          name?: string | null
          description?: string | null
          inserted_at?: string
          public?: boolean | null
        }
      }
      day_event: {
        Row: {
          id: string
          day_id: string
          event_id: string
          inserted_at: string
        }
        Insert: {
          id?: string
          day_id: string
          event_id: string
          inserted_at?: string
        }
        Update: {
          id?: string
          day_id?: string
          event_id?: string
          inserted_at?: string
        }
      }
      event: {
        Row: {
          id: string
          name: string
          description: string | null
          geom: unknown | null
          style: Json | null
          inserted_at: string
          public: boolean | null
          bounds: number[] | null
          storage_path: string | null
          event_type_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          geom?: unknown | null
          style?: Json | null
          inserted_at?: string
          public?: boolean | null
          bounds?: number[] | null
          storage_path?: string | null
          event_type_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          geom?: unknown | null
          style?: Json | null
          inserted_at?: string
          public?: boolean | null
          bounds?: number[] | null
          storage_path?: string | null
          event_type_id?: string | null
        }
      }
      event_type: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string | null
          inserted_at: string
          public: boolean | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string | null
          inserted_at?: string
          public?: boolean | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string | null
          inserted_at?: string
          public?: boolean | null
        }
      }
      favorite: {
        Row: {
          user_id: string
          entity: Database["public"]["Enums"]["favorite_entity"]
          ids: string[]
          inserted_at: string
        }
        Insert: {
          user_id: string
          entity: Database["public"]["Enums"]["favorite_entity"]
          ids: string[]
          inserted_at?: string
        }
        Update: {
          user_id?: string
          entity?: Database["public"]["Enums"]["favorite_entity"]
          ids?: string[]
          inserted_at?: string
        }
      }
      icon: {
        Row: {
          id: string
          name: string
          storage_path: string | null
          inserted_at: string
          public: boolean | null
        }
        Insert: {
          id?: string
          name: string
          storage_path?: string | null
          inserted_at?: string
          public?: boolean | null
        }
        Update: {
          id?: string
          name?: string
          storage_path?: string | null
          inserted_at?: string
          public?: boolean | null
        }
      }
      profile: {
        Row: {
          id: string
          username: string | null
          inserted_at: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          username?: string | null
          inserted_at?: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          inserted_at?: string
          avatar_url?: string | null
        }
      }
      stage: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_id: string | null
          geom: unknown | null
          event_id: string
          inserted_at: string
          public: boolean | null
          ts: unknown | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon_id?: string | null
          geom?: unknown | null
          event_id: string
          inserted_at?: string
          public?: boolean | null
          ts?: unknown | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_id?: string | null
          geom?: unknown | null
          event_id?: string
          inserted_at?: string
          public?: boolean | null
          ts?: unknown | null
        }
      }
      timetable: {
        Row: {
          id: string
          day_id: string
          start_time: string
          end_time: string
          artist_id: string
          stage_id: string
          inserted_at: string
          public: boolean | null
        }
        Insert: {
          id?: string
          day_id: string
          start_time: string
          end_time: string
          artist_id: string
          stage_id: string
          inserted_at?: string
          public?: boolean | null
        }
        Update: {
          id?: string
          day_id?: string
          start_time?: string
          end_time?: string
          artist_id?: string
          stage_id?: string
          inserted_at?: string
          public?: boolean | null
        }
      }
    }
    Views: {
      asset_geojson: {
        Row: {
          id: string | null
          name: string | null
          description: string | null
          icon: string | null
          geom: unknown | null
        }
      }
      day_event_mask: {
        Row: {
          id: string | null
          geom: unknown | null
          bounds: number[] | null
        }
      }
      day_event_stage_timetable: {
        Row: {
          id: string | null
          name: string | null
          first_start_time: string | null
          last_end_time: string | null
          events: Json | null
        }
      }
      entity_distance_search: {
        Row: {
          entity: string | null
          id: string | null
          name: string | null
          geom: unknown | null
        }
      }
      entity_text_search: {
        Row: {
          entity: string | null
          id: string | null
          name: string | null
          description: string | null
          ts: unknown | null
        }
      }
      map_icon: {
        Row: {
          name: string | null
          storage_path: string | null
        }
      }
      stage_geojson: {
        Row: {
          id: string | null
          name: string | null
          icon: string | null
          timetables: Json | null
          geom: unknown | null
        }
      }
    }
    Functions: {
      distance_to: {
        Args: { lng: number; lat: number; search_radius: number }
        Returns: Record<string, unknown>[]
      }
      table_as_geojson: {
        Args: { _tbl: unknown }
        Returns: Json
      }
      text_search: {
        Args: { search_term: string }
        Returns: Record<string, unknown>[]
      }
      upsert_favorite: {
        Args: {
          _user_id: string
          _entity: Database["public"]["Enums"]["favorite_entity"]
          _ids: unknown
        }
        Returns: undefined
      }
    }
    Enums: {
      favorite_entity: "artist" | "stage" | "asset"
    }
  }
}

