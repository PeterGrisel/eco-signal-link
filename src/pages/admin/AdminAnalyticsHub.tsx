import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsTabContent } from "./AdminAnalytics";
import { LeadsTabContent } from "./AdminLeads";
import { Activity } from "lucide-react";

const AdminAnalyticsHub = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "events";

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" /> Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Events, sessies en leads
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })}>
        <TabsList className="w-full justify-start bg-card border border-border mb-6 h-auto p-1">
          <TabsTrigger value="events" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Events
          </TabsTrigger>
          <TabsTrigger value="leads" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Leads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events"><AnalyticsTabContent /></TabsContent>
        <TabsContent value="leads"><LeadsTabContent /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminAnalyticsHub;
