import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthorityDashboard } from "./AuthorityDashboard";
import { AuthorityWebsites } from "./AuthorityWebsites";
import { AuthorityContextBrain } from "./AuthorityContextBrain";
import { AuthorityRuns } from "./AuthorityRuns";
import { AuthorityOpportunities } from "./AuthorityOpportunities";
import { AuthorityAssets } from "./AuthorityAssets";
import { AuthorityPlacements } from "./AuthorityPlacements";
import { AuthorityProvider } from "./AuthorityProvider";

export const AuthorityHub = () => {
  const [tab, setTab] = useState("dashboard");
  return (
    <AuthorityProvider>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-card border border-border h-auto p-1 flex flex-wrap">
          <TabsTrigger value="dashboard" className="text-xs">Dashboard</TabsTrigger>
          <TabsTrigger value="websites" className="text-xs">Websites</TabsTrigger>
          <TabsTrigger value="context" className="text-xs">Context Brain</TabsTrigger>
          <TabsTrigger value="runs" className="text-xs">Runs</TabsTrigger>
          <TabsTrigger value="opportunities" className="text-xs">Opportunities</TabsTrigger>
          <TabsTrigger value="assets" className="text-xs">Assets</TabsTrigger>
          <TabsTrigger value="placements" className="text-xs">Placements</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard"><AuthorityDashboard /></TabsContent>
        <TabsContent value="websites"><AuthorityWebsites /></TabsContent>
        <TabsContent value="context"><AuthorityContextBrain /></TabsContent>
        <TabsContent value="runs"><AuthorityRuns /></TabsContent>
        <TabsContent value="opportunities"><AuthorityOpportunities /></TabsContent>
        <TabsContent value="assets"><AuthorityAssets /></TabsContent>
        <TabsContent value="placements"><AuthorityPlacements /></TabsContent>
      </Tabs>
    </AuthorityProvider>
  );
};