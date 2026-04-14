export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agent_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          journey_id: string
          layer_id: number | null
          role: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          journey_id: string
          layer_id?: number | null
          role: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          journey_id?: string
          layer_id?: number | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_tracking_ips: {
        Row: {
          created_at: string
          id: string
          ip_address: string
          label: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address: string
          label?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string
          label?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["blog_post_status"]
          title: string
          topic_id: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          title: string
          topic_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          title?: string
          topic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "content_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      blueprints: {
        Row: {
          doc_json: Json | null
          id: string
          journey_id: string
          paid: boolean
          pdf_url: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          doc_json?: Json | null
          id?: string
          journey_id: string
          paid?: boolean
          pdf_url?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          doc_json?: Json | null
          id?: string
          journey_id?: string
          paid?: boolean
          pdf_url?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blueprints_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: true
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      cheatsheet_feedback: {
        Row: {
          cheatsheet_slug: string
          created_at: string
          helpful: boolean | null
          id: string
          rating: number | null
          session_id: string
        }
        Insert: {
          cheatsheet_slug: string
          created_at?: string
          helpful?: boolean | null
          id?: string
          rating?: number | null
          session_id: string
        }
        Update: {
          cheatsheet_slug?: string
          created_at?: string
          helpful?: boolean | null
          id?: string
          rating?: number | null
          session_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          selected_package: Json | null
          session_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          selected_package?: Json | null
          session_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          selected_package?: Json | null
          session_id?: string | null
        }
        Relationships: []
      }
      content_queue: {
        Row: {
          blog_post_id: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          error_message: string | null
          headline: string
          id: string
          keyword: string | null
          notes: string | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["content_queue_status"]
          topic_id: string | null
          updated_at: string
        }
        Insert: {
          blog_post_id?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          error_message?: string | null
          headline: string
          id?: string
          keyword?: string | null
          notes?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["content_queue_status"]
          topic_id?: string | null
          updated_at?: string
        }
        Update: {
          blog_post_id?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          error_message?: string | null
          headline?: string
          id?: string
          keyword?: string | null
          notes?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["content_queue_status"]
          topic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_queue_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_queue_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "content_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      content_topics: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          priority: number | null
          slug: string
          sort_order: number
          status: string | null
          target_article_count: number | null
          target_keywords: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          priority?: number | null
          slug: string
          sort_order?: number
          status?: string | null
          target_article_count?: number | null
          target_keywords?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          priority?: number | null
          slug?: string
          sort_order?: number
          status?: string | null
          target_article_count?: number | null
          target_keywords?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_topics_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      conversion_pages: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          label: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          label: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          label?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      directory_listings: {
        Row: {
          category: string | null
          created_at: string
          dr_score: number | null
          id: string
          live_at: string | null
          name: string
          notes: string | null
          status: Database["public"]["Enums"]["listing_status"]
          submitted_at: string | null
          updated_at: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          dr_score?: number | null
          id?: string
          live_at?: string | null
          name: string
          notes?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          submitted_at?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          dr_score?: number | null
          id?: string
          live_at?: string | null
          name?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          submitted_at?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      gsc_snapshots: {
        Row: {
          clicks: number | null
          created_at: string
          ctr: number | null
          date: string
          device: string | null
          id: string
          impressions: number | null
          page: string | null
          position: number | null
          query: string
        }
        Insert: {
          clicks?: number | null
          created_at?: string
          ctr?: number | null
          date: string
          device?: string | null
          id?: string
          impressions?: number | null
          page?: string | null
          position?: number | null
          query: string
        }
        Update: {
          clicks?: number | null
          created_at?: string
          ctr?: number | null
          date?: string
          device?: string | null
          id?: string
          impressions?: number | null
          page?: string | null
          position?: number | null
          query?: string
        }
        Relationships: []
      }
      indexing_requests: {
        Row: {
          created_at: string
          id: string
          indexed_at: string | null
          requested_at: string | null
          response_message: string | null
          status: Database["public"]["Enums"]["indexing_status"]
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          indexed_at?: string | null
          requested_at?: string | null
          response_message?: string | null
          status?: Database["public"]["Enums"]["indexing_status"]
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          indexed_at?: string | null
          requested_at?: string | null
          response_message?: string | null
          status?: Database["public"]["Enums"]["indexing_status"]
          url?: string
        }
        Relationships: []
      }
      journey_inputs: {
        Row: {
          field_key: string
          id: string
          journey_id: string
          layer_id: number
          section_type: string
          updated_at: string
          value_json: Json | null
        }
        Insert: {
          field_key: string
          id?: string
          journey_id: string
          layer_id: number
          section_type: string
          updated_at?: string
          value_json?: Json | null
        }
        Update: {
          field_key?: string
          id?: string
          journey_id?: string
          layer_id?: number
          section_type?: string
          updated_at?: string
          value_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_inputs_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journeys: {
        Row: {
          completed_at: string | null
          current_layer: number
          id: string
          module_id: string
          paid: boolean
          score_total: number
          started_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_layer?: number
          id?: string
          module_id?: string
          paid?: boolean
          score_total?: number
          started_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_layer?: number
          id?: string
          module_id?: string
          paid?: boolean
          score_total?: number
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journeys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "signal_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_evaluations: {
        Row: {
          articles_published: number | null
          avg_ctr: number | null
          avg_position: number | null
          conversion_clicks: number | null
          created_at: string
          id: string
          month: string
          recommendations: Json | null
          top_keywords: Json | null
          topic_performance: Json | null
          total_clicks: number | null
          total_impressions: number | null
        }
        Insert: {
          articles_published?: number | null
          avg_ctr?: number | null
          avg_position?: number | null
          conversion_clicks?: number | null
          created_at?: string
          id?: string
          month: string
          recommendations?: Json | null
          top_keywords?: Json | null
          topic_performance?: Json | null
          total_clicks?: number | null
          total_impressions?: number | null
        }
        Update: {
          articles_published?: number | null
          avg_ctr?: number | null
          avg_position?: number | null
          conversion_clicks?: number | null
          created_at?: string
          id?: string
          month?: string
          recommendations?: Json | null
          top_keywords?: Json | null
          topic_performance?: Json | null
          total_clicks?: number | null
          total_impressions?: number | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          avatar_url: string | null
          company: string
          created_at: string
          expertise: string[] | null
          id: string
          is_approved: boolean
          is_visible: boolean
          journey_id: string | null
          linkedin_url: string | null
          name: string
          referral_code: string | null
          sector: string | null
          tagline: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          company: string
          created_at?: string
          expertise?: string[] | null
          id?: string
          is_approved?: boolean
          is_visible?: boolean
          journey_id?: string | null
          linkedin_url?: string | null
          name: string
          referral_code?: string | null
          sector?: string | null
          tagline?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string
          created_at?: string
          expertise?: string[] | null
          id?: string
          is_approved?: boolean
          is_visible?: boolean
          journey_id?: string | null
          linkedin_url?: string | null
          name?: string
          referral_code?: string | null
          sector?: string | null
          tagline?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_settings: {
        Row: {
          config: Json
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      signal_profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      site_events: {
        Row: {
          created_at: string
          event_category: string
          event_label: string | null
          event_name: string
          id: string
          metadata: Json | null
          page_path: string | null
          referrer: string | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          event_category?: string
          event_label?: string | null
          event_name: string
          id?: string
          metadata?: Json | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          event_category?: string
          event_label?: string | null
          event_name?: string
          id?: string
          metadata?: Json | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
      site_pages: {
        Row: {
          changefreq: string
          created_at: string
          id: string
          is_active: boolean
          label: string
          path: string
          priority: number
          updated_at: string
        }
        Insert: {
          changefreq?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          path: string
          priority?: number
          updated_at?: string
        }
        Update: {
          changefreq?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          path?: string
          priority?: number
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tracking_scripts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          location: string
          name: string
          script_content: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          location?: string
          name: string
          script_content: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          location?: string
          name?: string
          script_content?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      blog_post_status: "draft" | "published" | "archived"
      content_queue_status:
        | "pending"
        | "approved"
        | "declined"
        | "generating"
        | "published"
        | "failed"
      content_type: "article" | "tool" | "video" | "pseo"
      indexing_status: "pending" | "requested" | "indexed" | "failed"
      listing_status: "todo" | "submitted" | "live" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      blog_post_status: ["draft", "published", "archived"],
      content_queue_status: [
        "pending",
        "approved",
        "declined",
        "generating",
        "published",
        "failed",
      ],
      content_type: ["article", "tool", "video", "pseo"],
      indexing_status: ["pending", "requested", "indexed", "failed"],
      listing_status: ["todo", "submitted", "live", "rejected"],
    },
  },
} as const
