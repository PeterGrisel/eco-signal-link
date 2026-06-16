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

  // Integrations
  ga4_property_id: string;
  ga4_measurement_id: string;

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
  // General
  name: "B2BGroeiMachine",
  type: "Agency",
  summary: "B2BGroeiMachine bouwt voorspelbare groei-systemen voor B2B-bedrijven. Wij combineren twee stromen (nieuwe klanten en recruitment) in één data-gedreven systeem met signaalgebaseerde targeting, omnichannel outreach en intent-scoring. Het resultaat: een continu geoptimaliseerde pipeline die meetbaar groeit. Platform-agnostisch, integreert met bestaande CRM's en tools zoals HubSpot, Salesforce, Clay en Zapier.",
  blog_theme: "Praktische, diepgaande content over B2B sales, leadgeneratie, recruitment-marketing en data-gedreven groeistrategieën. Focus op hoe MKB en midmarket bedrijven een voorspelbaar groeiproces opzetten met signaalgebaseerde targeting, omnichannel outreach en slimme automatisering. Geen fluff, wel concrete frameworks en resultaten.",
  founders: "",
  key_features: "1. Twee groeistromen: nieuwe klanten + recruitment in één systeem\n2. 4-lagen systeemopzet met ICP-mapping\n3. Signaalgebaseerde targeting (intent data, triggers)\n4. Omnichannel outreach (6 tot 8 touchpoints)\n5. Intent-scoring en kwalificatie\n6. Tweewekelijkse rapportage met dedicated campagnemanager\n7. Platform-agnostisch: integreert met HubSpot, Salesforce, Clay, Zapier\n8. Datahub: AI-gedreven sales tooling\n9. Add-ons: Full Sales Management en Full Service Recruitment",
  pricing_plans: "| Plan | Prijs | Beschrijving | Kenmerken |\n|------|-------|-------------|----------|\n| Basispakket | Vast maandbedrag | Beide stromen actief, 4-lagen systeem, omnichannel outreach | Tot 5 gebruikers, €0 opstartkosten, tweewekelijkse rapportage |\n| + Full Sales Management | Add-on | Sales, Marketing, Strategie en Relatiebeheer | Vier pijlers, volledig uitbesteed salesteam |\n| + Full Service Recruitment | Add-on | Sourcing, Selectie, Begeleiding en Teamopbouw | Commerciële en digitale rollen |",

  // Target Audience
  target_country: "Nederland",
  primary_language: "Nederlands",
  target_audience_summary: "MKB en midmarket B2B-bedrijven (10 tot 500 medewerkers) in Nederland en België die willen groeien maar geen gestructureerd sales- of recruitmentproces hebben. Eigenaren, directeuren, sales managers en HR-managers die worstelen met onvoorspelbare instroom van klanten of kandidaten. Ze zoeken een partner die het systeem bouwt, niet alleen leads levert.",
  pain_points: "Onvoorspelbare pipeline en omzet, afhankelijkheid van netwerk en referrals, geen gestructureerd outreach-proces, moeite met het aantrekken van sales- en commercieel talent, te veel tijd kwijt aan handmatig prospecten, geen inzicht in welke kanalen werken, vendor lock-in bij huidige tools, gebrek aan data-gedreven besluitvorming.",
  product_usage: "B2BGroeiMachine wordt ingezet als externe groeipartner die het volledige acquisitie- en recruitmentsysteem opzet en beheert. Klanten krijgen een dedicated campagnemanager, tweewekelijkse rapportages en een dashboard met real-time inzicht in hun pipeline. Het systeem draait continu en optimaliseert op basis van data.",

  // Competitors
  competitor_prompt: 'Vermeld, refereer of vergelijk B2BGroeiMachine niet met directe concurrenten of alternatieve platforms/diensten in dezelfde branche. Content moet exclusief voor de B2BGroeiMachine blog worden geschreven zonder alternatieven te erkennen, tenzij specifiek vereist in de headline.',
  competitor_urls: "",
  youtube_channels_exclude: "",

  // Images
  main_image_branding: "Professionele, moderne B2B-sfeer. Donkere achtergronden met warme accenten (oranje/amber). Clean composities met focus op data-visualisaties, dashboards, teamwork en groei. Geen stockfoto-gevoel.",
  inline_image_branding: "## Visuele Stijl\n- Donker kleurenschema met oranje/amber accenten\n- Clean, modern design\n- Beperkt kleurenpalet (donkerblauw, oranje, wit)\n- Iconen en eenvoudige illustraties boven complexe graphics\n- Hoog contrast voor leesbaarheid\n- Data-visualisaties en dashboards waar relevant",

  // CTA
  cta_display: true,
  cta_add_to_new: true,
  cta_type: "inline",
  cta_title: "Klaar voor voorspelbare groei?",
  cta_description: "Ontdek hoe B2BGroeiMachine een data-gedreven groei-systeem bouwt voor uw bedrijf. Twee stromen, één systeem: nieuwe klanten én het juiste talent.",
  cta_button_url: "https://www.b2bgroeimachine.io/#pricing",
  cta_button_text: "Bekijk de mogelijkheden",
  cta_text_color: "#f5f5f5",
  cta_primary_color: "#f97316",
  cta_note: "P.S. Wij zijn géén leadgenerator. Wij bouwen systemen.",

  // Prompts
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

  // Backlinks
  build_backlinks: true,
  backlink_notifications: true,
  dr_growth_notifications: true,
  priority_anchor_keywords: "b2b leadgeneratie\nvoorspelbare groei\nsales automatisering\nrecruitment marketing\nomnichannel outreach\nsignaalgebaseerde targeting\nB2B groei systeem\ndata-gedreven sales\nintent-based selling\noutbound sales uitbesteden",
  strict_keyword_mode: false,
  source_article_relevance: "medium",

  // News
  suggest_news: false,

  // Videos
  suggest_videos: true,
  video_country: "Netherlands",
  video_publication_date: "Past month",
  video_search_queries: "B2B leadgeneratie strategie\noutbound sales automatisering\nrecruitment marketing B2B\nHubSpot sales pipeline opzetten\ndata-driven sales proces",

  // Integrations
  ga4_property_id: "",
  ga4_measurement_id: "",

  // Advanced
  max_articles_per_period: 1,
  article_period: "day",
  blog_url_prefix: "/blog/",
  enforce_www: false,
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
