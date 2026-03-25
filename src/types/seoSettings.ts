export interface SeoConfig {
  // General
  name: string;
  type: string;
  summary: string;
  blog_theme: string;
  founders: string;
  key_features: string;
  pricing_plans: string;

  // Target Audience
  target_country: string;
  primary_language: string;
  target_audience_summary: string;
  pain_points: string;
  product_usage: string;

  // Competitors
  competitor_prompt: string;
  competitor_urls: string;
  youtube_channels_exclude: string;

  // Images
  main_image_branding: string;
  inline_image_branding: string;

  // CTA
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

  // Prompts
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

  // Backlinks
  build_backlinks: boolean;
  backlink_notifications: boolean;
  dr_growth_notifications: boolean;
  priority_anchor_keywords: string;
  strict_keyword_mode: boolean;
  source_article_relevance: "high" | "medium" | "low";

  // News
  suggest_news: boolean;

  // Videos
  suggest_videos: boolean;
  video_country: string;
  video_publication_date: string;
  video_search_queries: string;

  // Advanced
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

export const defaultSeoConfig: SeoConfig = {
  name: "Rebel Force",
  type: "SaaS",
  summary: "Rebel Force specializes in building data-driven enablement systems to optimize business operations. Their services include diagnosing constraints, designing enablement blueprints, executing solutions with dedicated teams, and validating results through measurable ROI.",
  blog_theme: "Practical and in-depth content on AI Enablement, data-driven transformation, and flow management. Rebel Force shows how organizations apply focus, discipline, and system-level interventions to turn AI into measurable business value.",
  founders: "",
  key_features: "1. Data-driven enablement systems\n2. AI integration and automation\n3. Process design and organizational flow\n4. Dedicated enablement teams\n5. Measurable ROI and performance tracking\n6. Structured 4-phase enablement process (Diagnose, Design, Execute, Validate)\n7. Collaboration with internal teams\n8. Custom solutions for business transformation",
  pricing_plans: "",

  target_country: "U.S. Virgin Islands",
  primary_language: "English",
  target_audience_summary: "The target audience consists of mid-to-large enterprises, business leaders, and decision-makers focused on leveraging data and AI to transform their organizations. They value structured, measurable processes and are interested in optimizing operations for better performance and ROI.",
  pain_points: "Difficulty in achieving seamless integration of AI and data-driven systems, lack of expertise in identifying operational constraints, inefficiency in processes, need for measurable ROI, technical complexity in automation and analytics, and challenges in aligning existing teams with new systems.",
  product_usage: "Integrating AI-driven solutions into operations to optimize workflows, using data analytics to make informed decisions, employing structured frameworks for measurable outcomes, and collaborating with specialized teams to address core constraints and drive growth.",

  competitor_prompt: 'Do not mention, reference, or compare "Rebel Force" with any direct competitors or alternative platforms/products/services in the same industry.',
  competitor_urls: "",
  youtube_channels_exclude: "",

  main_image_branding: "Photorealistic, modern, and professional aesthetic. Clean, uncluttered compositions. Warm, approachable color palette.",
  inline_image_branding: "## Visual Style\n- Clean, modern design\n- Limited color palette (2-4 colors max)\n- Consistent typography (max 3 font sizes)\n- Icons and simple illustrations over complex graphics\n- High contrast for readability",

  cta_display: true,
  cta_add_to_new: true,
  cta_type: "inline",
  cta_title: "Transform Your Business with Data-Driven Systems",
  cta_description: "Unlock your business potential with Rebel Force's AI-powered enablement systems. Diagnose constraints, design solutions, and achieve measurable ROI with our expert team.",
  cta_button_url: "https://rebelforce.nl/",
  cta_button_text: "Get Started Today",
  cta_text_color: "#1a1a2e",
  cta_primary_color: "#1a1a2e",
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

  build_backlinks: true,
  backlink_notifications: true,
  dr_growth_notifications: true,
  priority_anchor_keywords: "data-driven enablement systems\noptimize business operations\nai integration for business\nbusiness transformation services\nscalable enablement systems",
  strict_keyword_mode: false,
  source_article_relevance: "medium",

  suggest_news: false,

  suggest_videos: true,
  video_country: "United States",
  video_publication_date: "Past month",
  video_search_queries: "AI enablement strategy for enterprises\nwhy AI projects fail in large organizations\nAI transformation framework enterprise\nAI implementation vs AI enablement\nenterprise AI strategy explained",

  max_articles_per_period: 1,
  article_period: "day",
  blog_url_prefix: "/blog/",
  enforce_www: true,
  blog_trailing_slash: false,
  blog_html_suffix: false,
  enable_external_linking: true,
  enable_source_citations: false,
  enable_youtube_videos: true,
  only_custom_headlines: false,
  auto_accept_headlines: false,
  notify_when_ready: false,
  use_humanizer: true,
  suggest_tool_ideas: true,
};
