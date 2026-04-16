import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompetitorsTabContent } from "./AdminCompetitors";
import { ListingsTabContent } from "./AdminListings";
import { IndexingTabContent } from "./AdminIndexing";
import { Globe } from "lucide-react";

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
          Concurrenten, listings en indexering
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
        </TabsList>

        <TabsContent value="competitors"><CompetitorsTabContent /></TabsContent>
        <TabsContent value="listings"><ListingsTabContent /></TabsContent>
        <TabsContent value="indexing"><IndexingTabContent /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSeoHub;
