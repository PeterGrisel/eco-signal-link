import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogTabContent } from "./AdminBlog";
import { AutopilotTabContent } from "./AdminAutopilot";
import { CalendarTabContent } from "./AdminCalendar";
import { TaxonomyTabContent } from "./AdminTaxonomy";
import { JobsTabContent } from "./AdminJobs";
import { FileText } from "lucide-react";

const AdminContentHub = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "articles";

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" /> Content
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Artikelen, autopilot, kalender en strategie
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })}>
        <TabsList className="w-full justify-start bg-card border border-border mb-6 h-auto p-1 overflow-x-auto flex-nowrap">
          <TabsTrigger value="articles" className="text-xs whitespace-nowrap data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Artikelen
          </TabsTrigger>
          <TabsTrigger value="autopilot" className="text-xs whitespace-nowrap data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Autopilot
          </TabsTrigger>
          <TabsTrigger value="kalender" className="text-xs whitespace-nowrap data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Kalender
          </TabsTrigger>
          <TabsTrigger value="strategie" className="text-xs whitespace-nowrap data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Strategie
          </TabsTrigger>
          <TabsTrigger value="jobs" className="text-xs whitespace-nowrap data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles"><BlogTabContent /></TabsContent>
        <TabsContent value="autopilot"><AutopilotTabContent /></TabsContent>
        <TabsContent value="kalender"><CalendarTabContent /></TabsContent>
        <TabsContent value="strategie"><TaxonomyTabContent /></TabsContent>
        <TabsContent value="jobs"><JobsTabContent /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminContentHub;
