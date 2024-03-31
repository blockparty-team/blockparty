export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
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
          meta: string | null
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
          meta?: string | null
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
          meta?: string | null
          public?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_asset_type_id_fkey"
            columns: ["asset_type_id"]
            isOneToOne: false
            referencedRelation: "asset_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_geojson"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_icon_id_fkey"
            columns: ["icon_id"]
            isOneToOne: false
            referencedRelation: "icon"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "day_event_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "day"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "day_event_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "day_event_stage_timetable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "day_event_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "day_event_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_geojson"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "event_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_type"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
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
        Relationships: []
      }
      icon: {
        Row: {
          color: string | null
          id: string
          inserted_at: string
          name: string
          public: boolean | null
          storage_path: string | null
        }
        Insert: {
          color?: string | null
          id?: string
          inserted_at?: string
          name: string
          public?: boolean | null
          storage_path?: string | null
        }
        Update: {
          color?: string | null
          id?: string
          inserted_at?: string
          name?: string
          public?: boolean | null
          storage_path?: string | null
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stage: {
        Row: {
          description: string | null
          event_id: string
          geom: unknown | null
          icon_id: string | null
          id: string
          inserted_at: string
          meta: string | null
          name: string
          public: boolean | null
          rank: number
          tags: string[] | null
          ts: unknown | null
          url: string | null
        }
        Insert: {
          description?: string | null
          event_id: string
          geom?: unknown | null
          icon_id?: string | null
          id?: string
          inserted_at?: string
          meta?: string | null
          name: string
          public?: boolean | null
          rank?: number
          tags?: string[] | null
          ts?: unknown | null
          url?: string | null
        }
        Update: {
          description?: string | null
          event_id?: string
          geom?: unknown | null
          icon_id?: string | null
          id?: string
          inserted_at?: string
          meta?: string | null
          name?: string
          public?: boolean | null
          rank?: number
          tags?: string[] | null
          ts?: unknown | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stage_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_geojson"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_icon_id_fkey"
            columns: ["icon_id"]
            isOneToOne: false
            referencedRelation: "icon"
            referencedColumns: ["id"]
          },
        ]
      }
      timetable: {
        Row: {
          artist_id: string
          day_id: string
          end_time: string | null
          id: string
          inserted_at: string
          public: boolean | null
          stage_id: string
          start_time: string | null
          visible_on_stage: boolean | null
          visible_on_timetable: boolean | null
        }
        Insert: {
          artist_id: string
          day_id: string
          end_time?: string | null
          id?: string
          inserted_at?: string
          public?: boolean | null
          stage_id: string
          start_time?: string | null
          visible_on_stage?: boolean | null
          visible_on_timetable?: boolean | null
        }
        Update: {
          artist_id?: string
          day_id?: string
          end_time?: string | null
          id?: string
          inserted_at?: string
          public?: boolean | null
          stage_id?: string
          start_time?: string | null
          visible_on_stage?: boolean | null
          visible_on_timetable?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "timetable_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "day"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "day_event_stage_timetable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stage"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stage_geojson"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      asset_geojson: {
        Row: {
          color: string | null
          description: string | null
          geom: unknown | null
          icon: string | null
          id: string | null
          name: string | null
        }
        Relationships: []
      }
      day_event_mask: {
        Row: {
          bounds: number[] | null
          geom: unknown | null
          id: string | null
        }
        Relationships: []
      }
      day_event_stage_timetable: {
        Row: {
          events: Json | null
          first_start_time: string | null
          id: string | null
          last_end_time: string | null
          name: string | null
        }
        Relationships: []
      }
      entity_distance_search: {
        Row: {
          entity: string | null
          geom: unknown | null
          id: string | null
          name: string | null
        }
        Relationships: []
      }
      entity_text_search: {
        Row: {
          entity: Database["public"]["Enums"]["text_search_entity"] | null
          id: string | null
          name: string | null
          ts: unknown | null
        }
        Relationships: []
      }
      event_geojson: {
        Row: {
          color: string | null
          geom: unknown | null
          id: string | null
        }
        Relationships: []
      }
      map_icon: {
        Row: {
          name: string | null
          storage_path: string | null
        }
        Relationships: []
      }
      mask: {
        Row: {
          geom: unknown | null
          id: number | null
        }
        Relationships: []
      }
      stage_geojson: {
        Row: {
          description: string | null
          geom: unknown | null
          icon: string | null
          id: string | null
          name: string | null
          tags: string[] | null
          tickets: Json | null
          timetables: Json | null
          url: string | null
        }
        Relationships: []
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
          owner_id: string | null
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
          owner_id?: string | null
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
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
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
        Relationships: []
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
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

