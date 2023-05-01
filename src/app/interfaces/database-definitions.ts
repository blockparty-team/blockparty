export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      artist: {
        Row: {
          apple_music: string | null
          bandcamp: string | null
          bandcamp_iframe: string | null
          country: string | null
          description: string | null
          facebook: string | null
          id: string
          inserted_at: string
          instagram: string | null
          is_visible: boolean | null
          name: string
          public: boolean | null
          soundcloud: string | null
          soundcloud_iframe: string | null
          spotify: string | null
          storage_path: string | null
          tidal: string | null
          ts: unknown | null
          webpage: string | null
          youtube: string | null
        }
        Insert: {
          apple_music?: string | null
          bandcamp?: string | null
          bandcamp_iframe?: string | null
          country?: string | null
          description?: string | null
          facebook?: string | null
          id?: string
          inserted_at?: string
          instagram?: string | null
          is_visible?: boolean | null
          name: string
          public?: boolean | null
          soundcloud?: string | null
          soundcloud_iframe?: string | null
          spotify?: string | null
          storage_path?: string | null
          tidal?: string | null
          ts?: unknown | null
          webpage?: string | null
          youtube?: string | null
        }
        Update: {
          apple_music?: string | null
          bandcamp?: string | null
          bandcamp_iframe?: string | null
          country?: string | null
          description?: string | null
          facebook?: string | null
          id?: string
          inserted_at?: string
          instagram?: string | null
          is_visible?: boolean | null
          name?: string
          public?: boolean | null
          soundcloud?: string | null
          soundcloud_iframe?: string | null
          spotify?: string | null
          storage_path?: string | null
          tidal?: string | null
          ts?: unknown | null
          webpage?: string | null
          youtube?: string | null
        }
      }
      asset: {
        Row: {
          asset_type_id: string
          description: string | null
          event_id: string
          geom: unknown | null
          icon_id: string | null
          id: string
          inserted_at: string
          public: boolean | null
        }
        Insert: {
          asset_type_id: string
          description?: string | null
          event_id: string
          geom?: unknown | null
          icon_id?: string | null
          id?: string
          inserted_at?: string
          public?: boolean | null
        }
        Update: {
          asset_type_id?: string
          description?: string | null
          event_id?: string
          geom?: unknown | null
          icon_id?: string | null
          id?: string
          inserted_at?: string
          public?: boolean | null
        }
      }
      asset_type: {
        Row: {
          description: string | null
          id: string
          inserted_at: string
          name: string
          public: boolean | null
        }
        Insert: {
          description?: string | null
          id?: string
          inserted_at?: string
          name: string
          public?: boolean | null
        }
        Update: {
          description?: string | null
          id?: string
          inserted_at?: string
          name?: string
          public?: boolean | null
        }
      }
      day: {
        Row: {
          day: string
          description: string | null
          id: string
          inserted_at: string
          name: string | null
          public: boolean | null
        }
        Insert: {
          day: string
          description?: string | null
          id?: string
          inserted_at?: string
          name?: string | null
          public?: boolean | null
        }
        Update: {
          day?: string
          description?: string | null
          id?: string
          inserted_at?: string
          name?: string | null
          public?: boolean | null
        }
      }
      day_event: {
        Row: {
          day_id: string
          event_id: string
          id: string
          inserted_at: string
        }
        Insert: {
          day_id: string
          event_id: string
          id?: string
          inserted_at?: string
        }
        Update: {
          day_id?: string
          event_id?: string
          id?: string
          inserted_at?: string
        }
      }
      event: {
        Row: {
          bounds: number[] | null
          description: string | null
          event_type_id: string | null
          geom: unknown | null
          id: string
          inserted_at: string
          name: string
          public: boolean | null
          storage_path: string | null
          style: Json | null
          tickets: Json | null
        }
        Insert: {
          bounds?: number[] | null
          description?: string | null
          event_type_id?: string | null
          geom?: unknown | null
          id?: string
          inserted_at?: string
          name: string
          public?: boolean | null
          storage_path?: string | null
          style?: Json | null
          tickets?: Json | null
        }
        Update: {
          bounds?: number[] | null
          description?: string | null
          event_type_id?: string | null
          geom?: unknown | null
          id?: string
          inserted_at?: string
          name?: string
          public?: boolean | null
          storage_path?: string | null
          style?: Json | null
          tickets?: Json | null
        }
      }
      event_type: {
        Row: {
          color: string | null
          description: string | null
          id: string
          inserted_at: string
          name: string
          public: boolean | null
        }
        Insert: {
          color?: string | null
          description?: string | null
          id?: string
          inserted_at?: string
          name: string
          public?: boolean | null
        }
        Update: {
          color?: string | null
          description?: string | null
          id?: string
          inserted_at?: string
          name?: string
          public?: boolean | null
        }
      }
      favorite: {
        Row: {
          device_id: string
          entity: Database["public"]["Enums"]["favorite_entity"]
          ids: string[]
          inserted_at: string
        }
        Insert: {
          device_id: string
          entity: Database["public"]["Enums"]["favorite_entity"]
          ids: string[]
          inserted_at?: string
        }
        Update: {
          device_id?: string
          entity?: Database["public"]["Enums"]["favorite_entity"]
          ids?: string[]
          inserted_at?: string
        }
      }
      icon: {
        Row: {
          id: string
          inserted_at: string
          name: string
          public: boolean | null
          storage_path: string | null
        }
        Insert: {
          id?: string
          inserted_at?: string
          name: string
          public?: boolean | null
          storage_path?: string | null
        }
        Update: {
          id?: string
          inserted_at?: string
          name?: string
          public?: boolean | null
          storage_path?: string | null
        }
      }
      profile: {
        Row: {
          avatar_url: string | null
          id: string
          inserted_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          inserted_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          inserted_at?: string
          username?: string | null
        }
      }
      stage: {
        Row: {
          description: string | null
          event_id: string
          geom: unknown | null
          icon_id: string | null
          id: string
          inserted_at: string
          name: string
          public: boolean | null
          rank: number
          ts: unknown | null
        }
        Insert: {
          description?: string | null
          event_id: string
          geom?: unknown | null
          icon_id?: string | null
          id?: string
          inserted_at?: string
          name: string
          public?: boolean | null
          rank?: number
          ts?: unknown | null
        }
        Update: {
          description?: string | null
          event_id?: string
          geom?: unknown | null
          icon_id?: string | null
          id?: string
          inserted_at?: string
          name?: string
          public?: boolean | null
          rank?: number
          ts?: unknown | null
        }
      }
      timetable: {
        Row: {
          artist_id: string
          day_id: string
          end_time: string
          id: string
          inserted_at: string
          public: boolean | null
          stage_id: string
          start_time: string
        }
        Insert: {
          artist_id: string
          day_id: string
          end_time: string
          id?: string
          inserted_at?: string
          public?: boolean | null
          stage_id: string
          start_time: string
        }
        Update: {
          artist_id?: string
          day_id?: string
          end_time?: string
          id?: string
          inserted_at?: string
          public?: boolean | null
          stage_id?: string
          start_time?: string
        }
      }
    }
    Views: {
      asset_geojson: {
        Row: {
          description: string | null
          geom: unknown | null
          icon: string | null
          id: string | null
          name: string | null
        }
      }
      day_event_mask: {
        Row: {
          bounds: number[] | null
          geom: unknown | null
          id: string | null
        }
      }
      day_event_stage_timetable: {
        Row: {
          events: Json | null
          first_start_time: string | null
          id: string | null
          last_end_time: string | null
          name: string | null
        }
      }
      entity_distance_search: {
        Row: {
          entity: string | null
          geom: unknown | null
          id: string | null
          name: string | null
        }
      }
      entity_text_search: {
        Row: {
          entity: Database["public"]["Enums"]["text_search_entity"] | null
          id: string | null
          name: string | null
          ts: unknown | null
        }
      }
      event_geojson: {
        Row: {
          color: string | null
          geom: unknown | null
          id: string | null
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
          description: string | null
          geom: unknown | null
          icon: string | null
          id: string | null
          name: string | null
          tickets: Json | null
          timetables: Json | null
        }
      }
    }
    Functions: {
      distance_to: {
        Args: {
          lng: number
          lat: number
          search_radius: number
        }
        Returns: {
          entity: string
          id: string
          name: string
          geom: unknown
          distance: number
        }[]
      }
      table_as_geojson: {
        Args: {
          _tbl: unknown
        }
        Returns: Json
      }
      text_search: {
        Args: {
          search_term: string
        }
        Returns: {
          rank: number
          similarity: number
          entity: Database["public"]["Enums"]["text_search_entity"]
          id: string
        }[]
      }
      upsert_favorite: {
        Args: {
          _device_id: string
          _entity: Database["public"]["Enums"]["favorite_entity"]
          _ids: string[]
        }
        Returns: undefined
      }
    }
    Enums: {
      favorite_entity: "artist" | "stage" | "asset"
      text_search_entity: "artist" | "stage" | "asset" | "event"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

