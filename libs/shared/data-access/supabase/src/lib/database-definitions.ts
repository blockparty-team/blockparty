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
      app_config: {
        Row: {
          config: Json | null
          id: string
          inserted_at: string
        }
        Insert: {
          config?: Json | null
          id?: string
          inserted_at?: string
        }
        Update: {
          config?: Json | null
          id?: string
          inserted_at?: string
        }
        Relationships: []
      }
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
          name: string | null
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
          name?: string | null
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
          name?: string | null
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
          public: boolean | null
        }
        Insert: {
          day_id: string
          event_id: string
          id?: string
          inserted_at?: string
          public?: boolean | null
        }
        Update: {
          day_id?: string
          event_id?: string
          id?: string
          inserted_at?: string
          public?: boolean | null
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
          rank: number | null
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
          rank?: number | null
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
          rank?: number | null
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
          rank: number | null
        }
        Insert: {
          color?: string | null
          description?: string | null
          id?: string
          inserted_at?: string
          name: string
          public?: boolean | null
          rank?: number | null
        }
        Update: {
          color?: string | null
          description?: string | null
          id?: string
          inserted_at?: string
          name?: string
          public?: boolean | null
          rank?: number | null
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
      map_pmtiles: {
        Row: {
          id: string
          inserted_at: string
          name: string
          public: boolean | null
          storage_path: string
          style: Json
        }
        Insert: {
          id?: string
          inserted_at?: string
          name: string
          public?: boolean | null
          storage_path: string
          style: Json
        }
        Update: {
          id?: string
          inserted_at?: string
          name?: string
          public?: boolean | null
          storage_path?: string
          style?: Json
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
        Relationships: []
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
        Args: { lng: number; lat: number; search_radius: number }
        Returns: {
          entity: string
          id: string
          name: string
          geom: unknown
          distance: number
        }[]
      }
      table_as_geojson: {
        Args: { _tbl: unknown }
        Returns: Json
      }
      text_search: {
        Args: { search_term: string }
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
          user_metadata: Json | null
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
          user_metadata?: Json | null
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
          user_metadata?: Json | null
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
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
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
        Args: { bucketid: string; name: string; owner: string; metadata: Json }
        Returns: undefined
      }
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      favorite_entity: ["artist", "stage", "asset"],
      text_search_entity: ["artist", "stage", "asset", "event"],
    },
  },
  storage: {
    Enums: {},
  },
} as const

