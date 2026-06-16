import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompetitorsTabContent } from "./AdminCompetitors";
import { ListingsTabContent } from "./AdminListings";
import { IndexingTabContent } from "./AdminIndexing";
import { IndexabilityTabContent } from "./AdminIndexability";
import { BacklinksTabContent } from "./AdminBacklinks";
import { AuthorityHub } from "./authority/AuthorityHub";
import { Globe, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeoSettings } from "@/hooks/useSeoSettings";
import { IntegrationsTab } from "@/components/admin/settings/AdvancedTabs";
import AiReadinessPanel from "@/components/admin/AiReadinessPanel";

const AnalyticsTabContent = () => {
  const { config, updateConfig, saveSettings, loading, saving } = useSeoSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Google Analytics 4</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Vul je GA4 Measurement ID in. Bij opslaan wordt de gtag.js snippet automatisch geseed en geactiveerd na cookie-consent.
          </p>
        </div>
        <Button variant="hero" onClick={saveSettings} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Opslaan..." : "Opslaan"}
        </Button>
      </div>
      <IntegrationsTab config={config} onChange={updateConfig} />
    </div>
  );
};

const AdminSeoHub = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "competitors";

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" /> SEO
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Concurrenten, listings, indexering en analytics
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })}>
        <TabsList className="w-full justify-start bg-card border border-border mb-6 h-auto p-1">
          <TabsTrigger value="competitors" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Concurrenten
          </TabsTrigger>
          <TabsTrigger value="listings" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Listings
          </TabsTrigger>
          <TabsTrigger value="indexing" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Indexing
          </TabsTrigger>
          <TabsTrigger value="indexability" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Indexability
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="ai-readiness" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            AI Readiness
          </TabsTrigger>
          <TabsTrigger value="backlinks" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Backlinks
          </TabsTrigger>
          <TabsTrigger value="authority" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Authority
          </TabsTrigger>
        </TabsList>

        <TabsContent value="competitors"><CompetitorsTabContent /></TabsContent>
        <TabsContent value="listings"><ListingsTabContent /></TabsContent>
        <TabsContent value="indexing"><IndexingTabContent /></TabsContent>
        <TabsContent value="indexability"><IndexabilityTabContent /></TabsContent>
        <TabsContent value="analytics"><AnalyticsTabContent /></TabsContent>
        <TabsContent value="ai-readiness"><AiReadinessPanel /></TabsContent>
        <TabsContent value="backlinks"><BacklinksTabContent /></TabsContent>
        <TabsContent value="authority"><AuthorityHub /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSeoHub;
