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
      abm_pages: {
        Row: {
          brand_glow_hex: string | null
          brand_glow_hsl: string | null
          brand_primary_hex: string | null
          brand_primary_hsl: string | null
          company_name: string
          created_at: string
          expires_at: string
          hero_headline: string | null
          hero_subline: string | null
          id: string
          intro: string | null
          language: string
          logo_url: string | null
          og_image_url: string | null
          payload: Json
          pdf_url: string | null
          slug: string
          status: string
          updated_at: string
          view_count: number
          website: string | null
        }
        Insert: {
          brand_glow_hex?: string | null
          brand_glow_hsl?: string | null
          brand_primary_hex?: string | null
          brand_primary_hsl?: string | null
          company_name: string
          created_at?: string
          expires_at?: string
          hero_headline?: string | null
          hero_subline?: string | null
          id?: string
          intro?: string | null
          language?: string
          logo_url?: string | null
          og_image_url?: string | null
          payload?: Json
          pdf_url?: string | null
          slug: string
          status?: string
          updated_at?: string
          view_count?: number
          website?: string | null
        }
        Update: {
          brand_glow_hex?: string | null
          brand_glow_hsl?: string | null
          brand_primary_hex?: string | null
          brand_primary_hsl?: string | null
          company_name?: string
          created_at?: string
          expires_at?: string
          hero_headline?: string | null
          hero_subline?: string | null
          id?: string
          intro?: string | null
          language?: string
          logo_url?: string | null
          og_image_url?: string | null
          payload?: Json
          pdf_url?: string | null
          slug?: string
          status?: string
          updated_at?: string
          view_count?: number
          website?: string | null
        }
        Relationships: []
      }
      authority_assets: {
        Row: {
          asset_type: string | null
          backlink_pitch: string | null
          created_at: string
          id: string
          internal_links: Json
          sector: string | null
          status: string
          suggested_slug: string | null
          target_url: string | null
          title: string
          topic: string | null
          updated_at: string
          website_id: string
        }
        Insert: {
          asset_type?: string | null
          backlink_pitch?: string | null
          created_at?: string
          id?: string
          internal_links?: Json
          sector?: string | null
          status?: string
          suggested_slug?: string | null
          target_url?: string | null
          title: string
          topic?: string | null
          updated_at?: string
          website_id: string
        }
        Update: {
          asset_type?: string | null
          backlink_pitch?: string | null
          created_at?: string
          id?: string
          internal_links?: Json
          sector?: string | null
          status?: string
          suggested_slug?: string | null
          target_url?: string | null
          title?: string
          topic?: string | null
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "authority_assets_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "authority_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      authority_context_profiles: {
        Row: {
          context_version: number
          core_topics: Json
          created_at: string
          differentiators: Json
          icp: Json
          id: string
          linkable_assets: Json
          money_pages: Json
          negative_keywords: Json
          proposition: string | null
          raw_summary: string | null
          recommended_pages: Json
          secondary_topics: Json
          sectors: Json
          updated_at: string
          website_id: string
        }
        Insert: {
          context_version?: number
          core_topics?: Json
          created_at?: string
          differentiators?: Json
          icp?: Json
          id?: string
          linkable_assets?: Json
          money_pages?: Json
          negative_keywords?: Json
          proposition?: string | null
          raw_summary?: string | null
          recommended_pages?: Json
          secondary_topics?: Json
          sectors?: Json
          updated_at?: string
          website_id: string
        }
        Update: {
          context_version?: number
          core_topics?: Json
          created_at?: string
          differentiators?: Json
          icp?: Json
          id?: string
          linkable_assets?: Json
          money_pages?: Json
          negative_keywords?: Json
          proposition?: string | null
          raw_summary?: string | null
          recommended_pages?: Json
          secondary_topics?: Json
          sectors?: Json
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "authority_context_profiles_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "authority_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      authority_crawled_pages: {
        Row: {
          canonical_url: string | null
          contact_urls: Json
          created_at: string
          discovery_run_id: string | null
          domain: string | null
          emails: Json
          h1: string | null
          h2: Json
          html_hash: string | null
          id: string
          indexable: boolean | null
          internal_link_count: number
          last_crawled_at: string | null
          meta_description: string | null
          outbound_link_count: number
          robots_allowed: boolean | null
          status_code: number | null
          text_excerpt: string | null
          title: string | null
          url: string
          website_id: string
        }
        Insert: {
          canonical_url?: string | null
          contact_urls?: Json
          created_at?: string
          discovery_run_id?: string | null
          domain?: string | null
          emails?: Json
          h1?: string | null
          h2?: Json
          html_hash?: string | null
          id?: string
          indexable?: boolean | null
          internal_link_count?: number
          last_crawled_at?: string | null
          meta_description?: string | null
          outbound_link_count?: number
          robots_allowed?: boolean | null
          status_code?: number | null
          text_excerpt?: string | null
          title?: string | null
          url: string
          website_id: string
        }
        Update: {
          canonical_url?: string | null
          contact_urls?: Json
          created_at?: string
          discovery_run_id?: string | null
          domain?: string | null
          emails?: Json
          h1?: string | null
          h2?: Json
          html_hash?: string | null
          id?: string
          indexable?: boolean | null
          internal_link_count?: number
          last_crawled_at?: string | null
          meta_description?: string | null
          outbound_link_count?: number
          robots_allowed?: boolean | null
          status_code?: number | null
          text_excerpt?: string | null
          title?: string | null
          url?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "authority_crawled_pages_discovery_run_id_fkey"
            columns: ["discovery_run_id"]
            isOneToOne: false
            referencedRelation: "authority_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authority_crawled_pages_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "authority_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      authority_opportunities: {
        Row: {
          anchor_type: string | null
          asset_needed: boolean
          asset_suggestion: string | null
          authority_score: number
          commercial_value: number
          context_fit: number
          crawled_page_id: string | null
          created_at: string
          discovery_run_id: string | null
          id: string
          opportunity_type: string | null
          outreach_body: string | null
          outreach_subject: string | null
          page_type: string | null
          page_type_fit: number
          placement_probability: number
          priority_score: number
          recommended_action: string | null
          relevance_reason: string | null
          risk_score: number
          sector: string | null
          sector_fit: number
          source_domain: string | null
          source_title: string | null
          source_url: string
          status: string
          suggested_anchor: string | null
          suggested_target_url: string | null
          topic: string | null
          updated_at: string
          website_id: string
        }
        Insert: {
          anchor_type?: string | null
          asset_needed?: boolean
          asset_suggestion?: string | null
          authority_score?: number
          commercial_value?: number
          context_fit?: number
          crawled_page_id?: string | null
          created_at?: string
          discovery_run_id?: string | null
          id?: string
          opportunity_type?: string | null
          outreach_body?: string | null
          outreach_subject?: string | null
          page_type?: string | null
          page_type_fit?: number
          placement_probability?: number
          priority_score?: number
          recommended_action?: string | null
          relevance_reason?: string | null
          risk_score?: number
          sector?: string | null
          sector_fit?: number
          source_domain?: string | null
          source_title?: string | null
          source_url: string
          status?: string
          suggested_anchor?: string | null
          suggested_target_url?: string | null
          topic?: string | null
          updated_at?: string
          website_id: string
        }
        Update: {
          anchor_type?: string | null
          asset_needed?: boolean
          asset_suggestion?: string | null
          authority_score?: number
          commercial_value?: number
          context_fit?: number
          crawled_page_id?: string | null
          created_at?: string
          discovery_run_id?: string | null
          id?: string
          opportunity_type?: string | null
          outreach_body?: string | null
          outreach_subject?: string | null
          page_type?: string | null
          page_type_fit?: number
          placement_probability?: number
          priority_score?: number
          recommended_action?: string | null
          relevance_reason?: string | null
          risk_score?: number
          sector?: string | null
          sector_fit?: number
          source_domain?: string | null
          source_title?: string | null
          source_url?: string
          status?: string
          suggested_anchor?: string | null
          suggested_target_url?: string | null
          topic?: string | null
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "authority_opportunities_crawled_page_id_fkey"
            columns: ["crawled_page_id"]
            isOneToOne: false
            referencedRelation: "authority_crawled_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authority_opportunities_discovery_run_id_fkey"
            columns: ["discovery_run_id"]
            isOneToOne: false
            referencedRelation: "authority_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authority_opportunities_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "authority_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      authority_placements: {
        Row: {
          actual_anchor: string | null
          canonical_url: string | null
          created_at: string
          expected_anchor: string | null
          first_seen_at: string | null
          id: string
          indexable: boolean | null
          last_checked_at: string | null
          link_found: boolean
          notes: string | null
          opportunity_id: string | null
          placement_url: string
          rel_attribute: string | null
          status: string
          status_code: number | null
          target_url: string
          updated_at: string
          website_id: string
        }
        Insert: {
          actual_anchor?: string | null
          canonical_url?: string | null
          created_at?: string
          expected_anchor?: string | null
          first_seen_at?: string | null
          id?: string
          indexable?: boolean | null
          last_checked_at?: string | null
          link_found?: boolean
          notes?: string | null
          opportunity_id?: string | null
          placement_url: string
          rel_attribute?: string | null
          status?: string
          status_code?: number | null
          target_url: string
          updated_at?: string
          website_id: string
        }
        Update: {
          actual_anchor?: string | null
          canonical_url?: string | null
          created_at?: string
          expected_anchor?: string | null
          first_seen_at?: string | null
          id?: string
          indexable?: boolean | null
          last_checked_at?: string | null
          link_found?: boolean
          notes?: string | null
          opportunity_id?: string | null
          placement_url?: string
          rel_attribute?: string | null
          status?: string
          status_code?: number | null
          target_url?: string
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "authority_placements_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "authority_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authority_placements_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "authority_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      authority_queries: {
        Row: {
          cluster: string | null
          created_at: string
          id: string
          intent: string | null
          last_run_at: string | null
          priority: number
          query: string
          status: string
          website_id: string
        }
        Insert: {
          cluster?: string | null
          created_at?: string
          id?: string
          intent?: string | null
          last_run_at?: string | null
          priority?: number
          query: string
          status?: string
          website_id: string
        }
        Update: {
          cluster?: string | null
          created_at?: string
          id?: string
          intent?: string | null
          last_run_at?: string | null
          priority?: number
          query?: string
          status?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "authority_queries_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "authority_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      authority_runs: {
        Row: {
          completed_at: string | null
          created_at: string
          error: string | null
          high_priority_count: number
          id: string
          opportunities_created: number
          opportunities_rejected: number
          queries_count: number
          run_type: string
          started_at: string | null
          status: string
          urls_discovered: number
          website_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error?: string | null
          high_priority_count?: number
          id?: string
          opportunities_created?: number
          opportunities_rejected?: number
          queries_count?: number
          run_type: string
          started_at?: string | null
          status?: string
          urls_discovered?: number
          website_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error?: string | null
          high_priority_count?: number
          id?: string
          opportunities_created?: number
          opportunities_rejected?: number
          queries_count?: number
          run_type?: string
          started_at?: string | null
          status?: string
          urls_discovered?: number
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "authority_runs_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "authority_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      authority_target_pages: {
        Row: {
          created_at: string
          id: string
          page_type: string | null
          priority: number
          sector: string | null
          status: string
          title: string | null
          topic: string | null
          url: string
          website_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          page_type?: string | null
          priority?: number
          sector?: string | null
          status?: string
          title?: string | null
          topic?: string | null
          url: string
          website_id: string
        }
        Update: {
          created_at?: string
          id?: string
          page_type?: string | null
          priority?: number
          sector?: string | null
          status?: string
          title?: string | null
          topic?: string | null
          url?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "authority_target_pages_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "authority_websites"
            referencedColumns: ["id"]
          },
        ]
      }
      authority_websites: {
        Row: {
          created_at: string
          description: string | null
          domain: string
          id: string
          main_proposition: string | null
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          domain: string
          id?: string
          main_proposition?: string | null
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          domain?: string
          id?: string
          main_proposition?: string | null
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
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
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string
          created_at: string
          cta_variant: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean
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
          cta_variant?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean
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
          cta_variant?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean
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
      client_logos: {
        Row: {
          blog_slug: string | null
          created_at: string
          description: string | null
          domain: string
          id: string
          is_visible: boolean
          logo_url: string | null
          name: string
          padding: number
          scale: number
          sector: string | null
          sort_order: number
          updated_at: string
          website: string | null
        }
        Insert: {
          blog_slug?: string | null
          created_at?: string
          description?: string | null
          domain: string
          id?: string
          is_visible?: boolean
          logo_url?: string | null
          name: string
          padding?: number
          scale?: number
          sector?: string | null
          sort_order?: number
          updated_at?: string
          website?: string | null
        }
        Update: {
          blog_slug?: string | null
          created_at?: string
          description?: string | null
          domain?: string
          id?: string
          is_visible?: boolean
          logo_url?: string | null
          name?: string
          padding?: number
          scale?: number
          sector?: string | null
          sort_order?: number
          updated_at?: string
          website?: string | null
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
      content_bucket_items: {
        Row: {
          bucket_id: string
          category: string | null
          created_at: string
          cta_text: string | null
          cta_url: string | null
          id: string
          intro: string | null
          is_bonus: boolean | null
          layout: string
          payload: Json
          position: number
          slot_label: string | null
          slug: string
          status: string
          subtitle: string | null
          title: string
          type_label: string | null
          updated_at: string
        }
        Insert: {
          bucket_id: string
          category?: string | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          id?: string
          intro?: string | null
          is_bonus?: boolean | null
          layout: string
          payload?: Json
          position?: number
          slot_label?: string | null
          slug: string
          status?: string
          subtitle?: string | null
          title: string
          type_label?: string | null
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          category?: string | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          id?: string
          intro?: string | null
          is_bonus?: boolean | null
          layout?: string
          payload?: Json
          position?: number
          slot_label?: string | null
          slug?: string
          status?: string
          subtitle?: string | null
          title?: string
          type_label?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_bucket_items_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "content_buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      content_bucket_leads: {
        Row: {
          bucket_id: string
          company: string | null
          confirm_token: string
          confirmed_at: string | null
          created_at: string
          delivered_at: string | null
          email: string
          id: string
          ip_hash: string | null
          item_id: string | null
          name: string | null
          status: string
          user_agent: string | null
          utm: Json | null
        }
        Insert: {
          bucket_id: string
          company?: string | null
          confirm_token?: string
          confirmed_at?: string | null
          created_at?: string
          delivered_at?: string | null
          email: string
          id?: string
          ip_hash?: string | null
          item_id?: string | null
          name?: string | null
          status?: string
          user_agent?: string | null
          utm?: Json | null
        }
        Update: {
          bucket_id?: string
          company?: string | null
          confirm_token?: string
          confirmed_at?: string | null
          created_at?: string
          delivered_at?: string | null
          email?: string
          id?: string
          ip_hash?: string | null
          item_id?: string | null
          name?: string | null
          status?: string
          user_agent?: string | null
          utm?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "content_bucket_leads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "content_buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_bucket_leads_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "content_bucket_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_buckets: {
        Row: {
          accent_color: string | null
          created_at: string
          cta_text: string | null
          default_layouts: string[] | null
          description: string | null
          generator_schema: Json | null
          generator_system_prompt: string | null
          id: string
          is_published: boolean
          name: string
          slug: string
          tagline: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          created_at?: string
          cta_text?: string | null
          default_layouts?: string[] | null
          description?: string | null
          generator_schema?: Json | null
          generator_system_prompt?: string | null
          id?: string
          is_published?: boolean
          name: string
          slug: string
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          created_at?: string
          cta_text?: string | null
          default_layouts?: string[] | null
          description?: string | null
          generator_schema?: Json | null
          generator_system_prompt?: string | null
          id?: string
          is_published?: boolean
          name?: string
          slug?: string
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content_entities: {
        Row: {
          confidence: number
          created_at: string
          entity_name: string
          entity_type: string
          id: string
          slug: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          entity_name: string
          entity_type: string
          id?: string
          slug: string
        }
        Update: {
          confidence?: number
          created_at?: string
          entity_name?: string
          entity_type?: string
          id?: string
          slug?: string
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
      content_refresh_queue: {
        Row: {
          created_at: string
          id: string
          last_updated_at: string | null
          priority: string
          reason: string
          signal_data: Json
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_updated_at?: string | null
          priority?: string
          reason: string
          signal_data?: Json
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_updated_at?: string | null
          priority?: string
          reason?: string
          signal_data?: Json
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
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
      glossary_runs: {
        Row: {
          created_at: string
          id: string
          log: Json | null
          message: string | null
          status: string
          term_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          log?: Json | null
          message?: string | null
          status: string
          term_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          log?: Json | null
          message?: string | null
          status?: string
          term_id?: string | null
        }
        Relationships: []
      }
      glossary_terms: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          meta_description: string | null
          published_at: string | null
          related_terms: string[]
          short_def: string
          slug: string
          status: string
          term: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          meta_description?: string | null
          published_at?: string | null
          related_terms?: string[]
          short_def?: string
          slug: string
          status?: string
          term: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          meta_description?: string | null
          published_at?: string | null
          related_terms?: string[]
          short_def?: string
          slug?: string
          status?: string
          term?: string
          updated_at?: string
        }
        Relationships: []
      }
      groeiplan_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          fields: Json
          id: string
          mode: string
          name: string | null
          source_url: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          fields?: Json
          id?: string
          mode?: string
          name?: string | null
          source_url?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          fields?: Json
          id?: string
          mode?: string
          name?: string | null
          source_url?: string | null
        }
        Relationships: []
      }
      groeistack_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          note: string | null
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          note?: string | null
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          note?: string | null
          source?: string
        }
        Relationships: []
      }
      groeistack_tools: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          last_checked_at: string | null
          last_scraped_at: string | null
          link_status: string | null
          logo_url: string | null
          name: string
          published: boolean
          sort_order: number
          source_url: string | null
          updated_at: string
          website: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string
          id?: string
          last_checked_at?: string | null
          last_scraped_at?: string | null
          link_status?: string | null
          logo_url?: string | null
          name: string
          published?: boolean
          sort_order?: number
          source_url?: string | null
          updated_at?: string
          website: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          last_checked_at?: string | null
          last_scraped_at?: string | null
          link_status?: string | null
          logo_url?: string | null
          name?: string
          published?: boolean
          sort_order?: number
          source_url?: string | null
          updated_at?: string
          website?: string
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
      job_runs: {
        Row: {
          created_at: string
          duration_ms: number | null
          finished_at: string | null
          id: string
          job_key: string
          message: string | null
          metadata: Json | null
          started_at: string
          status: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          finished_at?: string | null
          id?: string
          job_key: string
          message?: string | null
          metadata?: Json | null
          started_at?: string
          status?: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          finished_at?: string | null
          id?: string
          job_key?: string
          message?: string | null
          metadata?: Json | null
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      keyword_opportunities: {
        Row: {
          clicks: number | null
          created_at: string
          id: string
          impressions: number | null
          notes: string | null
          page: string | null
          position: number | null
          query: string
          status: string
          suggested_action: string
          updated_at: string
        }
        Insert: {
          clicks?: number | null
          created_at?: string
          id?: string
          impressions?: number | null
          notes?: string | null
          page?: string | null
          position?: number | null
          query: string
          status?: string
          suggested_action?: string
          updated_at?: string
        }
        Update: {
          clicks?: number | null
          created_at?: string
          id?: string
          impressions?: number | null
          notes?: string | null
          page?: string | null
          position?: number | null
          query?: string
          status?: string
          suggested_action?: string
          updated_at?: string
        }
        Relationships: []
      }
      link_suggestions: {
        Row: {
          anchor_text: string | null
          anchor_type: string
          created_at: string
          id: string
          reason: string | null
          score: number
          source_url: string
          status: string
          target_url: string
          updated_at: string
        }
        Insert: {
          anchor_text?: string | null
          anchor_type?: string
          created_at?: string
          id?: string
          reason?: string | null
          score?: number
          source_url: string
          status?: string
          target_url: string
          updated_at?: string
        }
        Update: {
          anchor_text?: string | null
          anchor_type?: string
          created_at?: string
          id?: string
          reason?: string | null
          score?: number
          source_url?: string
          status?: string
          target_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      link_targets: {
        Row: {
          active: boolean
          created_at: string
          id: string
          keyword: string
          pillar_slugs: string[]
          priority: number
          target_type: string
          target_url: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          keyword: string
          pillar_slugs?: string[]
          priority?: number
          target_type?: string
          target_url: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          keyword?: string
          pillar_slugs?: string[]
          priority?: number
          target_type?: string
          target_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      mcp_api_keys: {
        Row: {
          api_key: string
          created_at: string
          id: string
          is_active: boolean
          is_master: boolean
          last_used_at: string | null
          name: string
          permissions: Json | null
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_master?: boolean
          last_used_at?: string | null
          name: string
          permissions?: Json | null
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_master?: boolean
          last_used_at?: string | null
          name?: string
          permissions?: Json | null
        }
        Relationships: []
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
      page_embeddings: {
        Row: {
          content_hash: string | null
          created_at: string
          embedding: string | null
          id: string
          page_type: string
          page_url: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          page_type?: string
          page_url: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          page_type?: string
          page_url?: string
          title?: string | null
          updated_at?: string
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
        Relationships: []
      }
      playbook_runs: {
        Row: {
          created_at: string
          id: string
          log: Json | null
          message: string | null
          playbook_id: string | null
          scenario_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          log?: Json | null
          message?: string | null
          playbook_id?: string | null
          scenario_id?: string | null
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          log?: Json | null
          message?: string | null
          playbook_id?: string | null
          scenario_id?: string | null
          status?: string
        }
        Relationships: []
      }
      playbook_scenarios: {
        Row: {
          active: boolean
          angle: string
          audience: string
          created_at: string
          id: string
          scheduled_date: string | null
          service_line: string
          sort_order: number
          title: string
          used_at: string | null
        }
        Insert: {
          active?: boolean
          angle?: string
          audience?: string
          created_at?: string
          id?: string
          scheduled_date?: string | null
          service_line?: string
          sort_order?: number
          title: string
          used_at?: string | null
        }
        Update: {
          active?: boolean
          angle?: string
          audience?: string
          created_at?: string
          id?: string
          scheduled_date?: string | null
          service_line?: string
          sort_order?: number
          title?: string
          used_at?: string | null
        }
        Relationships: []
      }
      playbooks: {
        Row: {
          audience: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          meta_description: string | null
          published_at: string | null
          scenario_id: string | null
          service_line: string | null
          slug: string
          status: string
          title: string
          tools: string[]
          updated_at: string
        }
        Insert: {
          audience?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          scenario_id?: string | null
          service_line?: string | null
          slug: string
          status?: string
          title: string
          tools?: string[]
          updated_at?: string
        }
        Update: {
          audience?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          scenario_id?: string | null
          service_line?: string | null
          slug?: string
          status?: string
          title?: string
          tools?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "playbooks_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "playbook_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      semrush_backlinks: {
        Row: {
          anchor: string | null
          created_at: string
          first_seen: string
          id: string
          last_seen: string
          nofollow: boolean | null
          page_ascore: number | null
          source_domain: string | null
          source_url: string
          status: string
          target_url: string
          updated_at: string
        }
        Insert: {
          anchor?: string | null
          created_at?: string
          first_seen?: string
          id?: string
          last_seen?: string
          nofollow?: boolean | null
          page_ascore?: number | null
          source_domain?: string | null
          source_url: string
          status?: string
          target_url: string
          updated_at?: string
        }
        Update: {
          anchor?: string | null
          created_at?: string
          first_seen?: string
          id?: string
          last_seen?: string
          nofollow?: boolean | null
          page_ascore?: number | null
          source_domain?: string | null
          source_url?: string
          status?: string
          target_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      semrush_kw_positions: {
        Row: {
          captured_at: string
          database_code: string | null
          id: string
          keyword: string
          position: number
          traffic_pct: number | null
          url: string
          volume: number | null
        }
        Insert: {
          captured_at?: string
          database_code?: string | null
          id?: string
          keyword: string
          position: number
          traffic_pct?: number | null
          url: string
          volume?: number | null
        }
        Update: {
          captured_at?: string
          database_code?: string | null
          id?: string
          keyword?: string
          position?: number
          traffic_pct?: number | null
          url?: string
          volume?: number | null
        }
        Relationships: []
      }
      semrush_sync_runs: {
        Row: {
          authority_score: number | null
          error: string | null
          finished_at: string | null
          id: string
          lost_backlinks: number | null
          new_backlinks: number | null
          rising_pages: number | null
          started_at: string
          status: string
          target_domain: string
          total_backlinks: number | null
          total_refdomains: number | null
        }
        Insert: {
          authority_score?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          lost_backlinks?: number | null
          new_backlinks?: number | null
          rising_pages?: number | null
          started_at?: string
          status?: string
          target_domain: string
          total_backlinks?: number | null
          total_refdomains?: number | null
        }
        Update: {
          authority_score?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          lost_backlinks?: number | null
          new_backlinks?: number | null
          rising_pages?: number | null
          started_at?: string
          status?: string
          target_domain?: string
          total_backlinks?: number | null
          total_refdomains?: number | null
        }
        Relationships: []
      }
      seo_action_items: {
        Row: {
          clicks: number | null
          commercial_intent: string | null
          created_at: string
          id: string
          impressions: number | null
          notes: string | null
          opportunity_score: number | null
          page: string | null
          position: number | null
          priority: string
          query: string
          service_fit: string | null
          status: string
          updated_at: string
        }
        Insert: {
          clicks?: number | null
          commercial_intent?: string | null
          created_at?: string
          id?: string
          impressions?: number | null
          notes?: string | null
          opportunity_score?: number | null
          page?: string | null
          position?: number | null
          priority?: string
          query: string
          service_fit?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          clicks?: number | null
          commercial_intent?: string | null
          created_at?: string
          id?: string
          impressions?: number | null
          notes?: string | null
          opportunity_score?: number | null
          page?: string | null
          position?: number | null
          priority?: string
          query?: string
          service_fit?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_ai_readiness: {
        Row: {
          ai_readiness_score: number
          created_at: string
          has_answer_block: boolean
          has_author_entity: boolean
          has_concrete_examples: boolean
          has_faq: boolean
          has_recent_date: boolean
          has_schema: boolean
          html_crawlable: boolean
          internal_links_count: number
          last_refreshed_at: string | null
          last_scanned_at: string | null
          missing_factors: Json
          page_type: string
          slug: string
          updated_at: string
        }
        Insert: {
          ai_readiness_score?: number
          created_at?: string
          has_answer_block?: boolean
          has_author_entity?: boolean
          has_concrete_examples?: boolean
          has_faq?: boolean
          has_recent_date?: boolean
          has_schema?: boolean
          html_crawlable?: boolean
          internal_links_count?: number
          last_refreshed_at?: string | null
          last_scanned_at?: string | null
          missing_factors?: Json
          page_type?: string
          slug: string
          updated_at?: string
        }
        Update: {
          ai_readiness_score?: number
          created_at?: string
          has_answer_block?: boolean
          has_author_entity?: boolean
          has_concrete_examples?: boolean
          has_faq?: boolean
          has_recent_date?: boolean
          has_schema?: boolean
          html_crawlable?: boolean
          internal_links_count?: number
          last_refreshed_at?: string | null
          last_scanned_at?: string | null
          missing_factors?: Json
          page_type?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_health_log: {
        Row: {
          check_type: string
          created_at: string
          details: Json | null
          id: string
          metric_value: number | null
          severity: string
          target: string | null
        }
        Insert: {
          check_type: string
          created_at?: string
          details?: Json | null
          id?: string
          metric_value?: number | null
          severity?: string
          target?: string | null
        }
        Update: {
          check_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          metric_value?: number | null
          severity?: string
          target?: string | null
        }
        Relationships: []
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
      compute_ai_readiness_score: {
        Args: { r: Database["public"]["Tables"]["seo_ai_readiness"]["Row"] }
        Returns: number
      }
      compute_anchor_diversity: {
        Args: never
        Returns: {
          exact_count: number
          exact_pct: number
          severity: string
          target_url: string
          total_links: number
        }[]
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      find_orphan_pages: {
        Args: never
        Returns: {
          page_type: string
          page_url: string
          title: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_abm_view: { Args: { _slug: string }; Returns: undefined }
      match_related_pages: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_url: string
        }
        Returns: {
          page_type: string
          page_url: string
          similarity: number
          title: string
        }[]
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
