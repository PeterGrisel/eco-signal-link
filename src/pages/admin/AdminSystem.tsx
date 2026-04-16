import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScriptsTabContent } from "./AdminScripts";
import { McpTabContent } from "./AdminMcp";
import { SettingsTabContent } from "./AdminSettings";
import { Settings } from "lucide-react";

const AdminSystem = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "scripts";

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" /> System
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tracking, MCP server en instellingen
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })}>
        <TabsList className="w-full justify-start bg-card border border-border mb-6 h-auto p-1">
          <TabsTrigger value="scripts" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Scripts
          </TabsTrigger>
          <TabsTrigger value="mcp" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            MCP
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scripts"><ScriptsTabContent /></TabsContent>
        <TabsContent value="mcp"><McpTabContent /></TabsContent>
        <TabsContent value="settings"><SettingsTabContent /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSystem;
