import { SeoConfig } from "@/types/seoSettings";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  config: SeoConfig;
  onChange: (partial: Partial<SeoConfig>) => void;
}

export const GeneralTab = ({ config, onChange }: Props) => (
  <div className="space-y-6">
    <Field label="Name" hint="Product/Service or Website title">
      <Input value={config.name} onChange={e => onChange({ name: e.target.value })} />
    </Field>
    <Field label="Type" hint="Website General Type">
      <Select value={config.type} onValueChange={v => onChange({ type: v })}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {["SaaS", "Agency", "E-commerce", "Blog", "Marketplace", "Consultancy", "Other"].map(t => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
    <Field label="Summary" hint="Make sure that all details and facts about your website are correct">
      <Textarea value={config.summary} onChange={e => onChange({ summary: e.target.value })} rows={4} />
    </Field>
    <Field label="Blog Theme" hint="Clearly articulate the primary focus and subject matter of your blog">
      <Textarea value={config.blog_theme} onChange={e => onChange({ blog_theme: e.target.value })} rows={4} />
    </Field>
    <Field label="Product/Service Founders" hint="Names, links to social media profiles, etc. Not required">
      <Textarea value={config.founders} onChange={e => onChange({ founders: e.target.value })} rows={2} />
    </Field>
    <Field label="Key Features and Benefits" hint="List major features and benefits (if applicable)">
      <Textarea value={config.key_features} onChange={e => onChange({ key_features: e.target.value })} rows={4} />
    </Field>
    <Field label="Pricing Plans" hint="Detail available pricing tiers or subscription options (if applicable)">
      <Textarea value={config.pricing_plans} onChange={e => onChange({ pricing_plans: e.target.value })} rows={4} />
    </Field>
  </div>
);

export const TargetAudienceTab = ({ config, onChange }: Props) => (
  <div className="space-y-6">
    <Field label="Primary Target Country" hint="Audience's primary target country">
      <Input value={config.target_country} onChange={e => onChange({ target_country: e.target.value })} />
    </Field>
    <Field label="Primary Language" hint="Primary language of the audience">
      <Select value={config.primary_language} onValueChange={v => onChange({ primary_language: v })}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {["English", "Nederlands", "Deutsch", "Français", "Español"].map(l => (
            <SelectItem key={l} value={l}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
    <Field label="Target Audience Summary" hint="Detailed overview of the target audience">
      <Textarea value={config.target_audience_summary} onChange={e => onChange({ target_audience_summary: e.target.value })} rows={5} />
    </Field>
    <Field label="Pain Points">
      <Textarea value={config.pain_points} onChange={e => onChange({ pain_points: e.target.value })} rows={4} />
    </Field>
    <Field label="Product Usage" hint="How the audience uses or interacts with the product?">
      <Textarea value={config.product_usage} onChange={e => onChange({ product_usage: e.target.value })} rows={3} />
    </Field>
  </div>
);

export const CompetitorsTab = ({ config, onChange }: Props) => (
  <div className="space-y-6">
    <Field label="Prompt" hint="Describe requirements and list specific competitors to exclude from articles">
      <Textarea value={config.competitor_prompt} onChange={e => onChange({ competitor_prompt: e.target.value })} rows={4} />
    </Field>
    <Field label="Competitor website URLs to Exclude" hint="Enter competitor website URLs to exclude from content (one per line)">
      <Textarea value={config.competitor_urls} onChange={e => onChange({ competitor_urls: e.target.value })} rows={4} placeholder="https://competitor1.com&#10;https://competitor2.com" />
    </Field>
    <Field label="YouTube channel URLs to Exclude" hint="Enter competitor YouTube channel URLs to exclude from videos (one per line)">
      <Textarea value={config.youtube_channels_exclude} onChange={e => onChange({ youtube_channels_exclude: e.target.value })} rows={4} />
    </Field>
  </div>
);

export const ImagesTab = ({ config, onChange }: Props) => (
  <div className="space-y-6">
    <Field label="Main picture: Branding & Theme" hint="Customize the branding prompt here to reflect your blog post's desired style">
      <Textarea value={config.main_image_branding} onChange={e => onChange({ main_image_branding: e.target.value })} rows={4} />
    </Field>
    <Field label="Inline pictures Branding" hint="Customize the branding prompt to reflect inline pictures desired style">
      <Textarea value={config.inline_image_branding} onChange={e => onChange({ inline_image_branding: e.target.value })} rows={6} />
    </Field>
  </div>
);

// Helper
const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-semibold text-foreground">{label}</Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);
