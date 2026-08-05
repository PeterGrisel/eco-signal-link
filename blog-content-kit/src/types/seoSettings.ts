// ============================================================================
// SeoConfig — the single config contract that de-brands the whole engine.
// ----------------------------------------------------------------------------
// One row lives in the `seo_settings` table (config JSONB). Edit it in the
// admin UI (AdminSettings) or seed it via config/seed-seo-settings.sql.
// Every edge function reads its site identity from here, so filling this in
// is 90% of "making the kit yours".
// ============================================================================

export interface SeoConfig {
  // --- Identity (used everywhere) ---
  name: string;                      // Site / brand name
  site_url: string;                  // Canonical base URL, no trailing slash
  type: string;                      // e.g. "Agency", "SaaS", "Blog"
  summary: string;                   // One-paragraph description of the business
  blog_theme: string;                // What the blog is about (steers generation)

  // --- Company detail (optional context for generation) ---
  founders: string;
  key_features: string;
  pricing_plans: string;

  // --- Target audience ---
  target_country: string;
  primary_language: string;          // e.g. "Nederlands", "English"
  target_audience_summary: string;
  pain_points: string;
  product_usage: string;

  // --- Competitors ---
  competitor_prompt: string;
  competitor_urls: string;
  youtube_channels_exclude: string;

  // --- Internal linking / fixed pages ---
  // Pages the article/glossary writer may link to besides blog posts.
  fixed_pages: { title: string; path: string }[];

  // --- Optional curated tool/resource library (was "de Groeistack") ---
  tool_library_enabled: boolean;                       // off by default
  tool_library_category_labels: Record<string, string>; // category slug -> label

  // --- Glossary ---
  glossary_focus: string;            // topic focus for generated glossary terms

  // --- Search Console brand filtering ---
  brand_terms: string[];             // extra branded query terms to exclude from stats

  // --- Images ---
  main_image_branding: string;
  inline_image_branding: string;

  // --- CTA (appended to generated articles) ---
  cta_display: boolean;
  cta_add_to_new: boolean;
  cta_type: string;
  cta_title: string;
  cta_description: string;
  cta_button_url: string;
  cta_button_text: string;
  cta_text_color: string;
  cta_primary_color: string;
  cta_note: string;

  // --- Custom prompt overrides (leave blank to use built-in prompts) ---
  prompt_style_tone: string;
  prompt_outline: string;
  prompt_introduction: string;
  prompt_article_sections: string;
  prompt_metadata: string;
  prompt_image: string;
  prompt_external_links: string;
  use_custom_style_prompt: boolean;
  use_custom_outline_prompt: boolean;
  use_custom_intro_prompt: boolean;
  use_custom_sections_prompt: boolean;
  use_custom_metadata_prompt: boolean;
  use_custom_image_prompt: boolean;
  use_custom_links_prompt: boolean;

  // --- Videos (optional YouTube suggestions) ---
  suggest_videos: boolean;
  video_country: string;
  video_publication_date: string;
  video_search_queries: string;

  // --- Integrations ---
  ga4_property_id: string;
  ga4_measurement_id: string;

  // --- Advanced ---
  max_articles_per_period: number;
  article_period: "day" | "week";
  blog_url_prefix: string;
  enforce_www: boolean;
  blog_trailing_slash: boolean;
  blog_html_suffix: boolean;
  enable_external_linking: boolean;
  enable_source_citations: boolean;
  enable_youtube_videos: boolean;
  only_custom_headlines: boolean;
  auto_accept_headlines: boolean;
  notify_when_ready: boolean;
  use_humanizer: boolean;
  suggest_tool_ideas: boolean;
}

// Neutral placeholder defaults. Replace the strings with your site's details
// (or fill them in through the admin Settings screen after cloning).
export const defaultSeoConfig: SeoConfig = {
  name: "Your Site",
  site_url: "https://example.com",
  type: "Blog",
  summary: "One-paragraph description of what this site/business does.",
  blog_theme: "Describe what the blog covers and for whom. This steers every generated article.",

  founders: "",
  key_features: "",
  pricing_plans: "",

  target_country: "Nederland",
  primary_language: "Nederlands",
  target_audience_summary: "Describe your ideal reader / customer.",
  pain_points: "",
  product_usage: "",

  competitor_prompt: "",
  competitor_urls: "",
  youtube_channels_exclude: "",

  fixed_pages: [
    { title: "Home", path: "/" },
    { title: "Blog", path: "/blog" },
  ],

  tool_library_enabled: false,
  tool_library_category_labels: {},

  glossary_focus: "your subject area (topics the glossary should cover)",

  brand_terms: [],

  main_image_branding: "Describe the visual style for hero/feature images.",
  inline_image_branding: "Describe the visual style for inline images.",

  cta_display: true,
  cta_add_to_new: true,
  cta_type: "inline",
  cta_title: "",
  cta_description: "",
  cta_button_url: "",
  cta_button_text: "",
  cta_text_color: "#f5f5f5",
  cta_primary_color: "#f97316",
  cta_note: "",

  prompt_style_tone: "",
  prompt_outline: "",
  prompt_introduction: "",
  prompt_article_sections: "",
  prompt_metadata: "",
  prompt_image: "",
  prompt_external_links: "",
  use_custom_style_prompt: false,
  use_custom_outline_prompt: false,
  use_custom_intro_prompt: false,
  use_custom_sections_prompt: false,
  use_custom_metadata_prompt: false,
  use_custom_image_prompt: false,
  use_custom_links_prompt: false,

  suggest_videos: false,
  video_country: "Netherlands",
  video_publication_date: "Past month",
  video_search_queries: "",

  ga4_property_id: "",
  ga4_measurement_id: "",

  max_articles_per_period: 1,
  article_period: "day",
  blog_url_prefix: "/blog/",
  enforce_www: false,
  blog_trailing_slash: false,
  blog_html_suffix: false,
  enable_external_linking: true,
  enable_source_citations: false,
  enable_youtube_videos: false,
  only_custom_headlines: false,
  auto_accept_headlines: false,
  notify_when_ready: false,
  use_humanizer: true,
  suggest_tool_ideas: false,
};
