import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTabContent } from "./AdminOverview";
import { KpiTabContent } from "./AdminKpi";
import { LayoutDashboard } from "lucide-react";

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-primary" /> Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Traffic, conversies en search performance
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })}>
        <TabsList className="w-full justify-start bg-card border border-border mb-6 h-auto p-1">
          <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Overview
          </TabsTrigger>
          <TabsTrigger value="kpi" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            KPI & SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><OverviewTabContent /></TabsContent>
        <TabsContent value="kpi"><KpiTabContent /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
