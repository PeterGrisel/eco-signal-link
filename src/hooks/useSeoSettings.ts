import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SeoConfig, defaultSeoConfig } from "@/types/seoSettings";
import { useToast } from "@/hooks/use-toast";

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
    } catch (e: any) {
      toast({ title: "Fout bij opslaan", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  }, [config, settingsId, toast]);

  return { config, updateConfig, saveSettings, loading, saving };
}
