import AdminLayout from "@/components/admin/AdminLayout";
import { useSeoSettings } from "@/hooks/useSeoSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings, Save, Loader2 } from "lucide-react";
import { GeneralTab, TargetAudienceTab, CompetitorsTab, ImagesTab } from "@/components/admin/settings/BasicTabs";
import { CtaTab, PromptsTab, BacklinksTab, NewsTab, VideosTab, AdvancedTab, IntegrationsTab } from "@/components/admin/settings/AdvancedTabs";

const tabs = [
  { value: "general", label: "General" },
  { value: "audience", label: "Target Audience" },
  { value: "competitors", label: "Competitors" },
  { value: "images", label: "Images" },
  { value: "cta", label: "CTA" },
  { value: "prompts", label: "Prompts" },
  { value: "backlinks", label: "Backlinks" },
  { value: "news", label: "News" },
  { value: "videos", label: "Videos" },
  { value: "integrations", label: "Integrations" },
  { value: "advanced", label: "Advanced" },
];

const AdminSettings = () => {
  const { config, updateConfig, saveSettings, loading, saving } = useSeoSettings();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" /> SEO Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configureer je content engine, doelgroep, prompts en meer
          </p>
        </div>
        <Button variant="hero" onClick={saveSettings} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Opslaan..." : "Opslaan"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-card border border-border mb-6 h-auto p-1">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs whitespace-nowrap data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="max-w-3xl">
          <TabsContent value="general"><GeneralTab config={config} onChange={updateConfig} /></TabsContent>
          <TabsContent value="audience"><TargetAudienceTab config={config} onChange={updateConfig} /></TabsContent>
          <TabsContent value="competitors"><CompetitorsTab config={config} onChange={updateConfig} /></TabsContent>
          <TabsContent value="images"><ImagesTab config={config} onChange={updateConfig} /></TabsContent>
          <TabsContent value="cta"><CtaTab config={config} onChange={updateConfig} /></TabsContent>
          <TabsContent value="prompts"><PromptsTab config={config} onChange={updateConfig} /></TabsContent>
          <TabsContent value="backlinks"><BacklinksTab config={config} onChange={updateConfig} /></TabsContent>
          <TabsContent value="news"><NewsTab config={config} onChange={updateConfig} /></TabsContent>
          <TabsContent value="videos"><VideosTab config={config} onChange={updateConfig} /></TabsContent>
          <TabsContent value="integrations"><IntegrationsTab config={config} onChange={updateConfig} /></TabsContent>
          <TabsContent value="advanced"><AdvancedTab config={config} onChange={updateConfig} /></TabsContent>
        </div>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;
