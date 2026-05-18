import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SeoConfig, defaultSeoConfig } from "@/types/seoSettings";
import { useToast } from "@/hooks/use-toast";

const GA4_ID_RE = /^G-[A-Z0-9]{6,}$/i;

const buildGtagSnippet = (measurementId: string) => `<!-- Auto-seeded by /admin/settings (GA4 Measurement ID) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${measurementId}', { anonymize_ip: true, send_page_view: true });
</script>`;

async function seedGa4TrackingScript(measurementId: string) {
  const script_content = buildGtagSnippet(measurementId);
  const { data: existing } = await supabase
    .from("tracking_scripts")
    .select("id, script_content")
    .eq("name", "GA4")
    .maybeSingle();

  if (existing) {
    if (existing.script_content === script_content) return { changed: false };
    const { error } = await supabase
      .from("tracking_scripts")
      .update({ script_content, is_active: true, location: "head" })
      .eq("id", existing.id);
    if (error) throw error;
    return { changed: true };
  }
  const { error } = await supabase.from("tracking_scripts").insert({
    name: "GA4",
    description: "Google Analytics 4 (auto-geseed vanuit SEO Settings).",
    script_content,
    location: "head",
    is_active: true,
    sort_order: 0,
  });
  if (error) throw error;
  return { changed: true };
}

export function useSeoSettings() {
  const [config, setConfig] = useState<SeoConfig>(defaultSeoConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase
      .from("seo_settings")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setSettingsId(data.id);
      const merged = { ...defaultSeoConfig, ...(data.config as Partial<SeoConfig>) };
      setConfig(merged);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateConfig = useCallback((partial: Partial<SeoConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  }, []);

  const saveSettings = useCallback(async () => {
    setSaving(true);
    try {
      if (settingsId) {
        const { error } = await supabase
          .from("seo_settings")
          .update({ config: config as any })
          .eq("id", settingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("seo_settings")
          .insert({ config: config as any })
          .select("id")
          .single();
        if (error) throw error;
        if (data) setSettingsId(data.id);
      }
      toast({ title: "Settings opgeslagen!" });

      const mid = (config.ga4_measurement_id || "").trim();
      if (mid && GA4_ID_RE.test(mid)) {
        try {
          const { changed } = await seedGa4TrackingScript(mid);
          if (changed) {
            toast({
              title: "GA4 gtag snippet geactiveerd",
              description: `Measurement ID ${mid} is geseed in /admin/scripts en staat live (categorie: analytics, na cookie-consent).`,
            });
          }
        } catch (e: any) {
          toast({
            title: "GA4 snippet niet opgeslagen",
            description: e.message ?? "Onbekende fout bij seeden van tracking_scripts.",
            variant: "destructive",
          });
        }
      }
    } catch (e: any) {
      toast({ title: "Fout bij opslaan", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  }, [config, settingsId, toast]);

  return { config, updateConfig, saveSettings, loading, saving };
}
