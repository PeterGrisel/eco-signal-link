import { SeoConfig } from "@/types/seoSettings";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Props {
  config: SeoConfig;
  onChange: (partial: Partial<SeoConfig>) => void;
}

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-semibold text-foreground">{label}</Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const Toggle = ({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-start gap-3 py-2">
    <Switch checked={checked} onCheckedChange={onChange} className="mt-0.5" />
    <div>
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  </div>
);

export const CtaTab = ({ config, onChange }: Props) => (
  <div className="space-y-6">
    <Toggle label="Display" hint="Show the CTA in published articles" checked={config.cta_display} onChange={v => onChange({ cta_display: v })} />
    <Toggle label="Add to new articles" hint="Automatically insert the CTA into new articles" checked={config.cta_add_to_new} onChange={v => onChange({ cta_add_to_new: v })} />
    <Field label="Type">
      <Input value={config.cta_type} onChange={e => onChange({ cta_type: e.target.value })} placeholder="inline" />
    </Field>
    <Field label="Title">
      <Input value={config.cta_title} onChange={e => onChange({ cta_title: e.target.value })} />
    </Field>
    <Field label="Description">
      <Textarea value={config.cta_description} onChange={e => onChange({ cta_description: e.target.value })} rows={3} />
    </Field>
    <Field label="Button URL">
      <Input value={config.cta_button_url} onChange={e => onChange({ cta_button_url: e.target.value })} />
    </Field>
    <Field label="Button Text">
      <Input value={config.cta_button_text} onChange={e => onChange({ cta_button_text: e.target.value })} />
    </Field>
    <Field label="Note" hint="A note to display under the button">
      <Input value={config.cta_note} onChange={e => onChange({ cta_note: e.target.value })} />
    </Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Text Color">
        <div className="flex items-center gap-2">
          <input type="color" value={config.cta_text_color} onChange={e => onChange({ cta_text_color: e.target.value })} className="w-10 h-10 rounded border border-border cursor-pointer" />
          <Input value={config.cta_text_color} onChange={e => onChange({ cta_text_color: e.target.value })} className="flex-1" />
        </div>
      </Field>
      <Field label="Primary Color" hint="Color of the border and the CTA button">
        <div className="flex items-center gap-2">
          <input type="color" value={config.cta_primary_color} onChange={e => onChange({ cta_primary_color: e.target.value })} className="w-10 h-10 rounded border border-border cursor-pointer" />
          <Input value={config.cta_primary_color} onChange={e => onChange({ cta_primary_color: e.target.value })} className="flex-1" />
        </div>
      </Field>
    </div>
  </div>
);

export const PromptsTab = ({ config, onChange }: Props) => {
  const prompts = [
    { key: "prompt_style_tone", customKey: "use_custom_style_prompt", label: "Language Style & Tone", default: "Apply style, voice and, tone from the examples below..." },
    { key: "prompt_outline", customKey: "use_custom_outline_prompt", label: "Outline", default: "The table of contents should:\n- Have a clear introduction summarizing the topic\n- Include only essential main sections (up to 5 root sections)\n- Have concrete and descriptive headers" },
    { key: "prompt_introduction", customKey: "use_custom_intro_prompt", label: "Introduction", default: "" },
    { key: "prompt_article_sections", customKey: "use_custom_sections_prompt", label: "Article Sections", default: "" },
    { key: "prompt_metadata", customKey: "use_custom_metadata_prompt", label: "Metadata", default: "" },
    { key: "prompt_image", customKey: "use_custom_image_prompt", label: "Image", default: "" },
    { key: "prompt_external_links", customKey: "use_custom_links_prompt", label: "External Links", default: "" },
  ] as const;

  return (
    <div className="space-y-6">
      <p className="text-sm text-primary">* You can customize a portion of each prompt below. Your custom input will be injected into the main prompt.</p>
      {prompts.map(p => (
        <div key={p.key} className="p-4 rounded-lg border border-border space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-foreground">{p.label}</Label>
          </div>
          <Textarea
            value={(config as any)[p.key]}
            onChange={e => onChange({ [p.key]: e.target.value })}
            rows={4}
            placeholder={p.default || `Custom ${p.label.toLowerCase()} prompt...`}
          />
          <Toggle
            label="Use custom prompt"
            checked={(config as any)[p.customKey]}
            onChange={v => onChange({ [p.customKey]: v })}
          />
        </div>
      ))}
    </div>
  );
};

export const BacklinksTab = ({ config, onChange }: Props) => (
  <div className="space-y-6">
    <Toggle label="Build Backlinks" hint="Exchange backlinks with partner websites to improve your Domain Rating" checked={config.build_backlinks} onChange={v => onChange({ build_backlinks: v })} />
    <Toggle label="Backlink Created Notifications" hint="Get notified when you receive a backlink from a partner website" checked={config.backlink_notifications} onChange={v => onChange({ backlink_notifications: v })} />
    <Toggle label="Domain Rating Growth Notifications" hint="Get notified when your Domain Rating improves" checked={config.dr_growth_notifications} onChange={v => onChange({ dr_growth_notifications: v })} />
    <Field label="Priority Anchor Keywords" hint="Enter each keyword on a new line! These keywords will be prioritized when creating anchor text for backlinks.">
      <Textarea value={config.priority_anchor_keywords} onChange={e => onChange({ priority_anchor_keywords: e.target.value })} rows={5} />
    </Field>
    <Toggle label="Strict Keyword Mode" hint="When enabled, only keywords from your list will be used as anchor text. ⚠️ This may slow down link acquisition." checked={config.strict_keyword_mode} onChange={v => onChange({ strict_keyword_mode: v })} />
    <Field label="Source Article Relevance" hint="Controls how strict the system is when finding backlink opportunities">
      <div className="space-y-2">
        {(["high", "medium", "low"] as const).map(level => (
          <label key={level} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="relevance"
              checked={config.source_article_relevance === level}
              onChange={() => onChange({ source_article_relevance: level })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-foreground capitalize">{level}</span>
          </label>
        ))}
      </div>
      <div className="text-xs text-muted-foreground mt-2 space-y-1">
        <p>- <strong>High</strong>: Only highly relevant placements. May take longer but ensures maximum topical match.</p>
        <p>- <strong>Medium</strong>: Moderately relevant opportunities. Faster acquisition while maintaining good standards.</p>
        <p>- <strong>Low</strong>: Expands search to include less relevant but still legitimate opportunities.</p>
      </div>
    </Field>
  </div>
);

export const NewsTab = ({ config, onChange }: Props) => (
  <div className="space-y-6">
    <Toggle label="Suggest News" hint="Allow the system to monitor industry news and recommend relevant articles that can be used to create fresh, topical content for your website." checked={config.suggest_news} onChange={v => onChange({ suggest_news: v })} />
  </div>
);

export const VideosTab = ({ config, onChange }: Props) => (
  <div className="space-y-6">
    <Toggle label="Suggest Videos" hint="Find relevant YouTube videos based on your topics and suggest them for creating video-based articles for your website." checked={config.suggest_videos} onChange={v => onChange({ suggest_videos: v })} />
    <Field label="Country" hint="Select a country to filter YouTube videos by region. Default is All Countries.">
      <Input value={config.video_country} onChange={e => onChange({ video_country: e.target.value })} />
    </Field>
    <Field label="Publication Date" hint="Filter videos by how recently they were published">
      <Input value={config.video_publication_date} onChange={e => onChange({ video_publication_date: e.target.value })} placeholder="Past month" />
    </Field>
    <Field label="Search Queries (topics)" hint="Enter keywords or phrases to search for relevant YouTube videos. Max 5 queries, one per line.">
      <Textarea value={config.video_search_queries} onChange={e => onChange({ video_search_queries: e.target.value })} rows={5} />
    </Field>
  </div>
);

export const IntegrationsTab = ({ config, onChange }: Props) => (
  <div className="space-y-6">
    <div className="p-4 rounded-lg border border-border bg-card/50 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Google Analytics 4</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Benodigd: GA4 property + service account met Viewer-rol in GA4, en GOOGLE_SERVICE_ACCOUNT_JSON als Supabase secret.
          Property ID + Measurement ID beheer je hier; de JSON key blijft bij Supabase voor veiligheid.
        </p>
      </div>
      <Field label="GA4 Property ID" hint="Numerieke ID (bijv. 502568051). Gebruikt door fetch-ga4-data om rapporten op te halen.">
        <Input
          value={config.ga4_property_id}
          onChange={e => onChange({ ga4_property_id: e.target.value })}
          placeholder="502568051"
        />
      </Field>
      <Field label="GA4 Measurement ID" hint="Start met G- (bijv. G-XXXXXXXXXX). Plak de bijbehorende gtag-snippet in /admin/scripts voor client-side events met consent.">
        <Input
          value={config.ga4_measurement_id}
          onChange={e => onChange({ ga4_measurement_id: e.target.value })}
          placeholder="G-XXXXXXXXXX"
        />
      </Field>
    </div>
  </div>
);

export const AdvancedTab = ({ config, onChange }: Props) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <Field label="Maximum articles per selected Period" hint="⚠️ Generating more than 5 articles daily may harm your SEO">
        <Input type="number" value={config.max_articles_per_period} onChange={e => onChange({ max_articles_per_period: parseInt(e.target.value) || 1 })} />
      </Field>
      <Field label="Period">
        <div className="flex items-center gap-4 mt-2">
          {(["day", "week"] as const).map(p => (
            <label key={p} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="period" checked={config.article_period === p} onChange={() => onChange({ article_period: p })} className="w-4 h-4 accent-primary" />
              <span className="text-sm text-foreground">{p}</span>
            </label>
          ))}
        </div>
      </Field>
    </div>
    <Field label="Blog URL Path Prefix" hint="Part of the URL preceding article identifiers. Usually '/blog/'.">
      <Input value={config.blog_url_prefix} onChange={e => onChange({ blog_url_prefix: e.target.value })} />
    </Field>
    <Toggle label="Enforce WWW" hint="Toggle ON to force website URLs to include 'www.' prefix" checked={config.enforce_www} onChange={v => onChange({ enforce_www: v })} />
    <Toggle label="Blog URL Trailing Slash" hint="Decide whether to add a trailing slash at the end of URLs" checked={config.blog_trailing_slash} onChange={v => onChange({ blog_trailing_slash: v })} />
    <Toggle label="Blog URLs use .html suffix" hint="Enable if your blog posts end with .html extension" checked={config.blog_html_suffix} onChange={v => onChange({ blog_html_suffix: v })} />
    <Toggle label="Enable External Linking" hint="Add external links to articles" checked={config.enable_external_linking} onChange={v => onChange({ enable_external_linking: v })} />
    <Toggle label="Enable Source Citations" hint="Add numbered links [1][2] to reference sources of information" checked={config.enable_source_citations} onChange={v => onChange({ enable_source_citations: v })} />
    <Toggle label="Enable YouTube Videos" hint="Embed related YouTube videos to articles" checked={config.enable_youtube_videos} onChange={v => onChange({ enable_youtube_videos: v })} />
    <Toggle label="Only Custom Headlines" hint="When enabled, only build articles for your custom headlines" checked={config.only_custom_headlines} onChange={v => onChange({ only_custom_headlines: v })} />
    <Toggle label="Auto Accept Headlines" hint="Full Autopilot: automatically accept all generated headlines and build articles without manual review" checked={config.auto_accept_headlines} onChange={v => onChange({ auto_accept_headlines: v })} />
    <Toggle label="Notify when article is ready" hint="Send an email notification when a new article is ready for review" checked={config.notify_when_ready} onChange={v => onChange({ notify_when_ready: v })} />
    <Toggle label="Use Humanizer" hint="Humanize blog posts to make them sound more natural" checked={config.use_humanizer} onChange={v => onChange({ use_humanizer: v })} />
    <Toggle label="Suggest Tool Ideas" hint="Enable suggestions for new interactive tools based on your niche, audience, and SEO opportunities" checked={config.suggest_tool_ideas} onChange={v => onChange({ suggest_tool_ideas: v })} />
  </div>
);
